import { Request, Response, NextFunction } from 'express';
import { CreateTask } from '@application/use-cases/CreateTask';
import { GetAllTasks } from '@application/use-cases/GetAllTasks';
import { MarkTaskAsCompleted } from '@application/use-cases/MarkTaskAsCompleted';
import { TaskRepository } from '@infrastructure/database/repositories/TaskRepository';

// Controller para manejar las peticiones HTTP de tareas
export class TaskController {
    private taskRepository: TaskRepository;
    private createTaskUseCase: CreateTask;
    private getAllTasksUseCase: GetAllTasks;
    private markTaskAsCompletedUseCase: MarkTaskAsCompleted;

    constructor() {
        this.taskRepository = new TaskRepository();
        this.createTaskUseCase = new CreateTask(this.taskRepository);
        this.getAllTasksUseCase = new GetAllTasks(this.taskRepository);
        this.markTaskAsCompletedUseCase = new MarkTaskAsCompleted(this.taskRepository);
    }

    // POST /tasks - Crear una nueva tarea
    createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { titulo, descripcion } = req.body;

            // Validar que el body contenga al menos el campo titulo
            if (titulo === undefined) {
                res.status(400).json({
                    success: false,
                    error: 'El campo "titulo" es requerido',
                });
                return;
            }

            const task = await this.createTaskUseCase.execute({
                titulo,
                descripcion,
            });

            res.status(201).json({
                success: true,
                message: 'Tarea creada exitosamente',
                data: task,
            });
        } catch (error) {
            next(error);
        }
    };

    // GET /tasks - Obtener todas las tareas con estadísticas y paginación
    getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.getAllTasksUseCase.execute(page, limit);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    // PATCH /tasks/:id - Marcar tarea como completada/pendiente
    markAsCompleted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { estatus } = req.body;

            // Validar que estatus sea booleano
            if (typeof estatus !== 'boolean') {
                res.status(400).json({
                    success: false,
                    error: 'El campo "estatus" debe ser true o false',
                });
                return;
            }

            const task = await this.markTaskAsCompletedUseCase.execute(id, estatus);

            res.status(200).json({
                success: true,
                message: `Tarea marcada como ${estatus ? 'completada' : 'pendiente'}`,
                data: task,
            });
        } catch (error) {
            next(error);
        }
    };
}
