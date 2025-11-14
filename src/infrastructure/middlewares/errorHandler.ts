import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors';
import logger from '@infrastructure/logger/logger';

// Middleware para manejar todos los errores de la aplicación
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Manejo especial para errores de parsing JSON
    if (err instanceof SyntaxError && 'body' in err) {
        logger.error(
            `400 - JSON Syntax Error - ${req.originalUrl} - ${req.method} - ${req.ip}`,
            {
                stack: err.stack,
                body: req.body,
            }
        );

        res.status(400).json({
            success: false,
            error: 'Formato JSON inválido. Verifica que el contenido enviado sea un JSON válido',
        });
        return;
    }

    // Determinar el código de error y el mensaje
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Error interno del servidor';

    // Registrar el error en los logs
    logger.error(
        `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
        {
            stack: err.stack,
            body: req.body,
            params: req.params,
            query: req.query,
        }
    );

    // Preparar respuesta de error
    const errorResponse: any = {
        success: false,
        error: message,
    };

    // Solo incluir stack y detalles en desarrollo
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        if (err instanceof AppError) {
            errorResponse.statusCode = err.statusCode;
            errorResponse.isOperational = err.isOperational;
        }
    }

    res.status(statusCode).json(errorResponse);
};
