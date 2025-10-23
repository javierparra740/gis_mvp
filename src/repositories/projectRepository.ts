// src/repositories/projectRepository.ts
import { Pool } from 'pg';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/Project';

const pool = new Pool(); // configured via env

export const findAll = async (): Promise<Project[]> =>
    (await pool.query('SELECT * FROM projects ORDER BY name')).rows;

export const findById = async (id: string): Promise<Project | null> =>
    (await pool.query('SELECT * FROM projects WHERE id=$1', [id])).rows[0] || null;

export const insert = async (p: CreateProjectDto): Promise<Project> => {
    const { rows } = await pool.query(
        `INSERT INTO projects(name, description, deadline, crs, owner_id, status)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [p.name, p.description, p.deadline, p.crs, p.ownerId, p.status || 'active']
    );
    return rows[0];
};

export const update = async (id: string, p: UpdateProjectDto): Promise<Project> => {
    const keys = Object.keys(p) as (keyof UpdateProjectDto)[];
    const values = keys.map(k => p[k]);
    const set = keys.map((k, i) => `${camelToSnake(k)}=$${i + 2}`).join(',');
    const { rows } = await pool.query(
        `UPDATE projects SET ${set}, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id, ...values]
    );
    return rows[0];
};

export const deleteById = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM projects WHERE id=$1', [id]);
};

// helpers
const camelToSnake = (s: string) => s.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);