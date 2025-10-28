// src/models/NPSSurvey.ts
export interface NPSSurvey {
    id: number;
    user_id: number;
    score: number;
    comment: string | null;
    created_at: string;
}