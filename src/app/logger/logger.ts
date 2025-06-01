import { createLogger, format, transports } from 'winston';
import { config } from '../config';

const vercelFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${config.app_name || 'APP'}] ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: config.is_production ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        vercelFormat
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                config.is_production ? format.uncolorize() : format.colorize(),
                vercelFormat
            )
        })
    ],
    exceptionHandlers: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                vercelFormat
            )
        })
    ],
    rejectionHandlers: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                vercelFormat
            )
        })
    ]
});

export const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export const vercelLogger = {
    log: (message: string, metadata?: Record<string, unknown>) => {
        logger.info(message, metadata);
    },
    error: (error: Error | string, metadata?: Record<string, unknown>) => {
        logger.error(typeof error === 'string' ? error : error.message, {
            ...metadata,
            stack: error instanceof Error ? error.stack : undefined
        });
    },
    warn: (message: string, metadata?: Record<string, unknown>) => {
        logger.warn(message, metadata);
    }
};

export default logger;