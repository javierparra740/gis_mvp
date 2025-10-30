// src/controllers/taskController.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/taskService'; // <- crear este archivo
import { CreateTaskDto, UpdateTaskDto } from '../models/Task';

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await service.getTasksByProject(req.params.projectId);
        res.json(tasks);
    } catch (e) { next(e); }
};

export const single = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await service.getTask(req.params.id);
        if (!task) return res.status(404).json({ message: 'Not found' });
        res.json(task);
    } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto: CreateTaskDto = { ...req.body, project_id: Number(req.params.projectId) };
        const created = await service.createTask(dto, (req as any).user.id);
        res.status(201).json(created);
    } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto: UpdateTaskDto = req.body;
        const updated = await service.updateTask(req.params.id, dto, (req as any).user.id);
        res.json(updated);
    } catch (e) { next(e); }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await service.deleteTask(req.params.id, (req as any).user.id);
        res.status(204).send();
    } catch (e) { next(e); }
};