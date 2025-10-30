// src/modules/tasks/TaskMapper.ts
import { Task } from '../../models/Task';

export interface TaskDto extends Task {
    assigneeUser: { id: string; name: string } | null;
}

export class TaskMapper {
    static toDto(task: Task, assigneeUser?: { id: string; name: string } | null): TaskDto {
        return { ...task, assigneeUser: assigneeUser ?? null };
    }
}