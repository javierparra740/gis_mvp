// src/models/KPIHistory.ts
export interface KPIHistory {
    id: number;
    cycle: number;
    lead_time_minutes: number | null;
    nps_avg: number | null;
    tasks_closed: number | null;
    layers_orphan: number | null;
    created_at: string;
}