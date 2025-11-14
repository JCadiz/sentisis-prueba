import winston from 'winston';
import path from 'path';

// Configuración de Winston para el sistema de logs

// Directorio de logs
const logsDir = path.join(process.cwd(), 'logs');

const transports: winston.transport[] = [
    // Archivo de logs generales
    new winston.transports.File({
        filename: path.join(logsDir, 'app.log'),
        level: 'info',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Archivo de logs de errores
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// En desarrollo también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

const options: winston.LoggerOptions = {
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports,
    exitOnError: false,
};

const logger = winston.createLogger(options);

// Stream para Morgan
export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export default logger;
