// src/modules/projects/ProjectValidator.ts
import { CreateProjectDto, UpdateProjectDto, Project } from '../../models/Project';

export class ProjectValidator {
    static create(dto: CreateProjectDto): void {
        if (new Date(dto.deadline) <= new Date()) throw new Error('Deadline must be future');
        if (!dto.name.trim()) throw new Error('Name is required');
    }

    static update(current: Project, dto: UpdateProjectDto): void {
        if (dto.deadline && new Date(dto.deadline) <= new Date()) throw new Error('Deadline must be future');
        if (dto.name !== undefined && !dto.name.trim()) throw new Error('Name cannot be empty');
    }

    static canClone(p: Project): void {
        if (p.status === 'archived') throw new Error('Cannot clone archived project');
    }
}