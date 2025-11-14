import { Router } from 'express';
import { TaskController } from '@interfaces/http/controllers/TaskController';

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 maxLength: 200
 *                 example: Comprar víveres
 *               descripcion:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Ir al supermercado y comprar frutas y verduras
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tarea creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas con paginación
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de tareas paginadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: number
 *                           example: 1
 *                         limit:
 *                           type: number
 *                           example: 10
 *                         total:
 *                           type: number
 *                           example: 25
 *                         totalPages:
 *                           type: number
 *                           example: 3
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Marcar tarea como completada o pendiente
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estatus
 *             properties:
 *               estatus:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tarea marcada como completada
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id', taskController.markAsCompleted);

export { router as taskRoutes };
