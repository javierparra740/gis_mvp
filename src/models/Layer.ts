// src/models/Layer.ts
export interface Layer {
    id: number;
    task_id: number;
    filename: string;
    hash: string;
    file_path: string | null;
    geometry: any | null;
    uploaded_at: string;
}