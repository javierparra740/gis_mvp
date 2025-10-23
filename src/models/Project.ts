// src/models/Project.ts
export interface Project {
    id: string;
    name: string;
    description: string;
    deadline: Date;
    crs: string;          // “EPSG:XXXX”
    ownerId: string;          // FK → users.id
    status: 'active' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;