-- =========================================================
-- 0.  PostGIS (obligatorio)
-- =========================================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- =========================================================
-- 1.  ORGANIZACIONES
-- =========================================================
CREATE TABLE organizations (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  crs_default VARCHAR(20)  DEFAULT 'EPSG:4326',
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- =========================================================
-- 2.  USUARIOS
-- =========================================================
CREATE TYPE user_role AS ENUM ('Viewer','Editor','ProjectManager','Admin','SuperAdmin','External');

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(120) UNIQUE NOT NULL,
  password_hash   VARCHAR(255)        NOT NULL,
  role            user_role           NOT NULL,
  organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 3.  PROYECTOS
-- =========================================================
CREATE TABLE projects (
  id              SERIAL PRIMARY KEY,
  organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
  name            VARCHAR(120) NOT NULL,
  description     TEXT,
  due_date        DATE,
  responsible     VARCHAR(80),
  crs             VARCHAR(20) DEFAULT 'EPSG:4326',
  status          VARCHAR(30) DEFAULT 'Active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 4.  TAREAS (Kanban + Gantt)
-- =========================================================
CREATE TYPE task_status AS ENUM ('ToDo','Doing','Done');

CREATE TABLE tasks (
  id           SERIAL PRIMARY KEY,
  project_id   INT REFERENCES projects(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  status       task_status DEFAULT 'ToDo',
  due_date     DATE,
  assignee     VARCHAR(80),
  start_date   DATE,
  end_date     DATE,
  responsible  VARCHAR(80),
  closed_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 5.  EVENTOS (calendario)
-- =========================================================
CREATE TABLE events (
  id         SERIAL PRIMARY KEY,
  task_id    INT REFERENCES tasks(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 6.  CAPAS ― geometrías PostGIS
-- =========================================================
CREATE TABLE layers (
  id          SERIAL PRIMARY KEY,
  project_id  INT REFERENCES projects(id)   ON DELETE CASCADE,
  task_id     INT REFERENCES tasks(id)      ON DELETE CASCADE,
  filename    VARCHAR(255) NOT NULL,
  hash        VARCHAR(64)  NOT NULL,          -- SHA-256
  file_path   VARCHAR(500),
  geometry    Geometry(Geometry,4326) NOT NULL, -- SRID fijo
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hash)
);

-- Índices obligatorios para rendimiento e integridad
CREATE INDEX layers_geom_gist   ON layers USING GIST (geometry);
CREATE INDEX layers_project     ON layers (project_id);
CREATE INDEX layers_task        ON layers (task_id);

-- =========================================================
-- 7.  AUDITORÍA
-- =========================================================
CREATE TABLE audit (
  id         SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  user_name  VARCHAR(80) NOT NULL,
  action     VARCHAR(50) NOT NULL,
  old_value  JSONB,
  new_value  JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 8.  KPI
-- =========================================================
CREATE TABLE kpi_history (
  id                SERIAL PRIMARY KEY,
  cycle             INTEGER NOT NULL,
  lead_time_minutes INT,
  nps_avg           NUMERIC(3,2),
  tasks_closed      INT,
  layers_orphan     INT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 9.  NPS
-- =========================================================
CREATE TABLE nps_survey (
  id       SERIAL PRIMARY KEY,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  score    SMALLINT CHECK (score BETWEEN 0 AND 10),
  comment  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
