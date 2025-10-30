// src/services/taskService.ts
import * as repo from '../repositories/taskRepository';
import { AuditAction, logAudit, logTaskAudit } from '../utils/audit';
import { TaskValidator, TaskMapper } from '../modules/tasks'; // <- crear
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/Task';

export const getTasksByProject = (projectId: string): Promise<Task[]> =>
    repo.findByProject(projectId);

export const getTask = async (id: string): Promise<Task | null> =>
    repo.findById(id);

export const createTask = async (
    dto: CreateTaskDto,
    byUserId: string
): Promise<Task> => {
    TaskValidator.create(dto);
    const created = await repo.insert(dto);
    await logTaskAudit({
        action: AuditAction.TASK_CREATE,
        projectId: (created.project_id).toString(),
        taskId: (created.id).toString(),
        byUserId,
    });
    return created;
};

export const updateTask = async (
    id: string,
    dto: UpdateTaskDto,
    byUserId: string
): Promise<Task> => {
    const current = await repo.findById(id);
    if (!current) throw new Error('Task not found');
    TaskValidator.update(current, dto);
    const updated = await repo.updateById(id, dto);
    await logTaskAudit({
        action: AuditAction.TASK_UPDATE,
        projectId: (updated.project_id).toString(),
        taskId: id,
        byUserId,
    });
    return updated;
};

export const deleteTask = async (
    id: string,
    byUserId: string
): Promise<void> => {
    const exists = await repo.findById(id);
    if (!exists) throw new Error('Task not found');
    await repo.deleteById(id);
    await logTaskAudit({
        action: AuditAction.TASK_DELETE,
        projectId: (exists.project_id).toString(),
        taskId: (id).toString(),
        byUserId,
    });
};