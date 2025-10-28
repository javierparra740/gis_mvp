// src/models/Project.ts
export type ProjectStatus = 'Active' | 'Inactive' | 'Completed' | 'Cancelled';

export interface Project {
    id: number;
    organization_id: number;
    name: string;
    description: string | null;
    due_date: string | null;
    responsible: string | null;
    crs: string;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
}
