import { AppError } from './AppError';

/**
 * Error cuando un recurso no es encontrado
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
