// TaskMapper.ts
import { Task } from '../../models/Task';

export class TaskMapper {
    static toDto(task: Task, assignee?: { id: string; name: string }) {
        return { ...task, assignedTo: assignee };
    }
}