import { createLogger, format, Logger, transports } from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config';


const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: config.is_production ? 'info' : 'debug',
    format: combine(
        label({ label: 'REMOTE-TRIBE' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(colorize(), logFormat),
        }),
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
}) 
export const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};


export default logger;