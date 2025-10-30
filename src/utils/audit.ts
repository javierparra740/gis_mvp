// src/utils/audit.ts
import { pool } from '../config/db';

export enum AuditAction {
    PROJECT_CREATE = 'PROJECT_CREATE',
    PROJECT_UPDATE = 'PROJECT_UPDATE',
    PROJECT_DELETE = 'PROJECT_DELETE',
    PROJECT_CLONE = 'PROJECT_CLONE',
    TASK_CREATE = "TASK_CREATE",
    TASK_UPDATE = "TASK_UPDATE",
    TASK_DELETE = "TASK_DELETE",
}
interface Log {
    action: AuditAction;
    projectId: string;
    byUserId: string;
}

interface LogTask extends Log {
    taskId: string
}

export const logTaskAudit = async (l: LogTask) => {
    await pool.query(
        `INSERT INTO audit_log(action, project_id, task_id, user_id, created_at)
     VALUES ($1,$2,$3,$4,NOW())`,
        [l.action, l.projectId, l.taskId, l.byUserId]
    );
};

export const logAudit = async (l: Log) => {
    await pool.query(
        `INSERT INTO audit_log(action, project_id, user_id, created_at)
     VALUES ($1,$2,$3,NOW())`,
        [l.action, l.projectId, l.byUserId]
    );
};