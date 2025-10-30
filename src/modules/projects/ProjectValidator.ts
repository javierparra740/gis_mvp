// src/modules/projects/ProjectValidator.ts
import { CreateProjectDto, UpdateProjectDto, Project } from '../../models/Project';

export class ProjectValidator {
    static create(dto: CreateProjectDto): void {
        if (dto.dueDate) {                                 // ← guarda nula
            if (new Date(dto.dueDate) <= new Date()) {
                throw new Error('Deadline must be future');
            }
        }
        if (!dto.name?.trim()) throw new Error('Name is required');
    }

    static update(current: Project, dto: UpdateProjectDto): void {
        if (dto.dueDate && new Date(dto.dueDate) <= new Date()) throw new Error('Deadline must be future');
        if (dto.name !== undefined && !dto.name.trim()) throw new Error('Name cannot be empty');
    }

    static canClone(p: Project): void {
        if (p.status === 'Cancelled') throw new Error('Cannot clone cancelled project');
    }
}