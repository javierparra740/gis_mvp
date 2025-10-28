-- =========================================================
-- 0.  PostGIS & helpers (run inside the same DB you create)
-- =========================================================
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- already used for users.id

-- =========================================================
-- 1.  ORIGINAL FILE (kept intact)
-- =========================================================
CREATE DATABASE IF NOT EXISTS "db_gis";

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  password   TEXT NOT NULL,
  role       TEXT CHECK (role IN ('admin','user')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  deadline    DATE,
  crs         TEXT,
  owner_id    UUID REFERENCES users(id),
  status      TEXT CHECK (status IN ('active','archived')) DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      TEXT NOT NULL,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 2.  NEW: minimal but robust PostGIS scaffold
-- =========================================================

-- Catalogue of external files (shapefile, GPKG, etc.)
CREATE TABLE spatial_source (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_path     TEXT NOT NULL,
  checksum      TEXT NOT NULL,               -- SHA-256
  file_size_mb  NUMERIC,
  layer_name    TEXT,
  crs_auth      TEXT,                        -- e.g. EPSG:25830
  feature_count INT,
  loaded_at     TIMESTAMPTZ DEFAULT NOW(),
  loaded_by     UUID REFERENCES users(id),
  UNIQUE (file_path, checksum)
);

CREATE INDEX idx_spatial_source_path ON spatial_source (file_path);

-- Real geometries table
CREATE TABLE spatial_feature (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id  UUID NOT NULL REFERENCES spatial_source(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  geom       Geometry(Geometry, 4326) NOT NULL,
  attr       JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mandatory spatial index
CREATE INDEX idx_spatial_feature_geom ON spatial_feature USING GIST (geom);
-- FK indexes
CREATE INDEX idx_spatial_feature_source ON spatial_feature (source_id);
CREATE INDEX idx_spatial_feature_project ON spatial_feature (project_id);
-- JSONB GIN for flexible attributes
CREATE INDEX idx_spatial_feature_attr ON spatial_feature USING GIN (attr);

-- Auto-timestamp
CREATE OR REPLACE FUNCTION trg_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON spatial_feature;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON spatial_feature
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_timestamp();

-- Audit integration (re-uses existing audit_log table)
CREATE OR REPLACE FUNCTION trg_audit_spatial()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (action, project_id, user_id)
    VALUES ('spatial_delete', OLD.project_id, auth.uid());
    RETURN OLD;
  ELSE
    INSERT INTO audit_log (action, project_id, user_id)
    VALUES ('spatial_'||lower(TG_OP), NEW.project_id, auth.uid());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_spatial ON spatial_feature;
CREATE TRIGGER audit_spatial
  AFTER INSERT OR UPDATE OR DELETE ON spatial_feature
  FOR EACH ROW
  EXECUTE FUNCTION trg_audit_spatial();