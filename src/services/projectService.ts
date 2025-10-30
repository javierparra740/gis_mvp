// src/services/projectService.ts
import * as repo from '../repositories/projectRepository';
import { AuditAction, logAudit } from '../utils/audit';
import { ProjectValidator, ProjectMapper } from '../modules/projects';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/Project';

export const getProjects = (): Promise<Project[]> => repo.findAll();

export const getProject = async (id: string): Promise<Project | null> => repo.findById(id);

export const createProject = async (dto: CreateProjectDto, byUserId: string): Promise<Project> => {
    ProjectValidator.create(dto);
    const created = await repo.insert(dto);
    await logAudit({ action: AuditAction.PROJECT_CREATE, projectId: (created.id).toString(), byUserId });
    return created;
};

export const updateProject = async (id: string, dto: UpdateProjectDto, byUserId: string): Promise<Project> => {
    const current = await repo.findById(id);
    if (!current) throw new Error('Project not found');
    ProjectValidator.update(current, dto);
    const updated = await repo.update(id, dto);
    await logAudit({ action: AuditAction.PROJECT_UPDATE, projectId: id, byUserId });
    return updated;
};

export const deleteProject = async (id: string, byUserId: string): Promise<void> => {
    const exists = await repo.findById(id);
    if (!exists) throw new Error('Project not found');
    await repo.deleteById(id);
    await logAudit({ action: AuditAction.PROJECT_DELETE, projectId: id, byUserId });
};

export const cloneProject = async (id: string, byUserId: string): Promise<Project> => {
    const original = await repo.findById(id);
    if (!original) throw new Error('Project not found');
    ProjectValidator.canClone(original);
    const payload: CreateProjectDto = {
        ...original,
        name: ProjectMapper.cloneName(original.name),
        status: 'Active',
        organizationId: ''
    };
    return createProject(payload, byUserId);
};
