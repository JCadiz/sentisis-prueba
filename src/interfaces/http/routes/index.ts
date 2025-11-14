import { Router } from 'express';
import { taskRoutes } from './taskRoutes';

// Router principal de la API
const routes = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar el estado de la API
 *     description: Endpoint para comprobar que la API está funcionando correctamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-11-14T10:00:00.000Z
 *                 uptime:
 *                   type: number
 *                   description: Tiempo de actividad del servidor en segundos
 *                   example: 123.45
 */
routes.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Montar rutas de los módulos
routes.use('/tasks', taskRoutes);

export { routes };
