// src/utils/logger.ts
import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const now = () => new Date().toISOString();

const logFile = () => path.join(logsDir, `${today()}.log`);

const fmt = (level: string, msg: string, meta?: any) =>
    `[${now()}] [${level}] ${msg}${meta ? ' ' + inspect(meta, { depth: null }) : ''}\n`;

export const logger = {
    info: (msg: string, meta?: any) => fs.appendFileSync(logFile(), fmt('INFO', msg, meta)),
    error: (msg: string, meta?: any) => fs.appendFileSync(logFile(), fmt('ERROR', msg, meta)),
};