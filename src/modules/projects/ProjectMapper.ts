// src/modules/projects/ProjectMapper.ts
import { Project } from '../../models/Project';

export class ProjectMapper {
    static toDto(project: Project, owner?: { id: string; name: string; email: string }) {
        return { ...project, owner };
    }

    static cloneName(original: string): string {
        return `Copia de ${original}`;
    }
}