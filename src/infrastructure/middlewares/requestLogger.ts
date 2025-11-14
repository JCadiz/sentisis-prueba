import morgan from 'morgan';
import { stream } from '@infrastructure/logger';

// Middleware para registrar todas las peticiones HTTP
export const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
);
