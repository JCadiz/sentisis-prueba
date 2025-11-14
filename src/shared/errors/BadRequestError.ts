import { AppError } from './AppError';

/**
 * Error de petición inválida
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
