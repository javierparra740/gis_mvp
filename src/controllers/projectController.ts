// src/controllers/projectController.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/projectService';
import { CreateProjectDto, UpdateProjectDto } from '../models/Project';

export const list = async (_: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getProjects()); }
    catch (e) { next(e); }
};

export const single = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const p = await service.getProject(req.params.id);
        if (!p) return res.status(404).json({ message: 'Not found' });
        res.json(p);
    } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto: CreateProjectDto = req.body;
        const created = await service.createProject(dto, (req as any).user.id);
        res.status(201).json(created);
    } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto: UpdateProjectDto = req.body;
        const updated = await service.updateProject(req.params.id, dto, (req as any).user.id);
        res.json(updated);
    } catch (e) { next(e); }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await service.deleteProject(req.params.id, (req as any).user.id);
        res.status(204).send();
    } catch (e) { next(e); }
};

export const clone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cloned = await service.cloneProject(req.params.id, (req as any).user.id);
        res.status(201).json(cloned);
    } catch (e) { next(e); }
};