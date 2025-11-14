import { AppError } from './AppError';

/**
 * Error de autorización (permisos insuficientes)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden - Insufficient permissions') {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
