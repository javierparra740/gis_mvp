// src/models/Task.ts
export type TaskStatus = 'ToDo' | 'Doing' | 'Done';

export interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string | null;
    assignee: string | null;
    start_date: string | null;
    end_date: string | null;
    responsible: string | null;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<CreateTaskDto>;