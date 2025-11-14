import { AppError } from './AppError';

/**
 * Error de autenticación
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
