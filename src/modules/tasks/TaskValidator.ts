// src/modules/tasks/TaskValidator.ts
import { CreateTaskDto, UpdateTaskDto, Task } from '../../models/Task';

export class TaskValidator {
    static create(dto: CreateTaskDto): void {
        if (!dto.title?.trim()) throw new Error('Title required');
        if (dto.due_date && new Date(dto.due_date) <= new Date()) {
            throw new Error('Due date must be future');
        }
    }

    static update(current: Task, dto: UpdateTaskDto): void {
        if (dto.title !== undefined && !dto.title.trim()) {
            throw new Error('Title cannot be empty');
        }
    }
}