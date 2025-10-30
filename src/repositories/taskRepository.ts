// src/repositories/taskRepository.ts
import { pool } from '../config/db';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/Task';

const camelToSnake = (s: string) => s.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);

export const findByProject = async (projectId: string): Promise<Task[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
    );
    return rows;
};

export const findById = async (id: string): Promise<Task | null> => {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return rows[0] || null;
};

export const insert = async (dto: CreateTaskDto): Promise<Task> => {
    const { rows } = await pool.query(
        `INSERT INTO tasks(
       title, description, status, due_date,
       project_id, assignee, start_date, end_date,
       responsible, closed_at
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
        [
            dto.title,
            dto.description || null,
            dto.status || 'ToDo',
            dto.due_date || null,
            dto.project_id,
            dto.assignee || null,
            dto.start_date || null,
            dto.end_date || null,
            dto.responsible || null,
            dto.closed_at || null
        ]
    );
    return rows[0];
};

export const updateById = async (id: string, dto: UpdateTaskDto): Promise<Task> => {
    const keys = Object.keys(dto) as (keyof UpdateTaskDto)[];
    const values = keys.map(k => dto[k]);
    const set = keys
        .map((k, i) => `${k === 'assignee' ? 'assignee' : camelToSnake(k)}=$${i + 2}`)
        .join(',');
    const { rows } = await pool.query(
        `UPDATE tasks SET ${set}, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id, ...values]
    );
    return rows[0];
};

export const deleteById = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
};