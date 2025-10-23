CREATE DATABASE IF NOT EXISTS "db_gis";

CREATE TABLE users (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name  TEXT NOT NULL,
  password TEXT NOT NULL,
  role  TEXT CHECK (role IN ('admin','user')) DEFAULT 'user',
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
