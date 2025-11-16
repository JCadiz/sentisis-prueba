import request from 'supertest';
import express, { Application } from 'express';
import { TaskController } from '@interfaces/http/controllers/TaskController';
import { CreateTask } from '@application/use-cases/CreateTask';
import { GetAllTasks } from '@application/use-cases/GetAllTasks';
import { MarkTaskAsCompleted } from '@application/use-cases/MarkTaskAsCompleted';
import { Task } from '@domain/entities/Task';

// Mock de las dependencias
jest.mock('@infrastructure/database/repositories/TaskRepository');
jest.mock('@application/use-cases/CreateTask');
jest.mock('@application/use-cases/GetAllTasks');
jest.mock('@application/use-cases/MarkTaskAsCompleted');

describe('TaskController', () => {
  let app: Application;
  let taskController: TaskController;
  let mockCreateTask: jest.Mocked<CreateTask>;
  let mockGetAllTasks: jest.Mocked<GetAllTasks>;
  let mockMarkTaskAsCompleted: jest.Mocked<MarkTaskAsCompleted>;

  beforeEach(() => {
    // Resetear mocks antes de cada test
    jest.clearAllMocks();

    // Crear app de Express para testing
    app = express();
    app.use(express.json());

    // Crear instancia del controlador
    taskController = new TaskController();

    // Obtener referencias a los mocks
    mockCreateTask = (taskController as any).createTaskUseCase;
    mockGetAllTasks = (taskController as any).getAllTasksUseCase;
    mockMarkTaskAsCompleted = (taskController as any).markTaskAsCompletedUseCase;

    // Configurar rutas
    app.post('/tasks', taskController.createTask);
    app.get('/tasks', taskController.getAllTasks);
    app.patch('/tasks/:id', taskController.markAsCompleted);
  });

  describe('POST /tasks - Crear tarea', () => {
    it('debe crear una tarea exitosamente con titulo y descripcion', async () => {
      const mockTask: Task = {
        id: '507f1f77bcf86cd799439011',
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        estatus: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: undefined,
        schema_version: 0,
      };

      mockCreateTask.execute.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .send({
          titulo: 'Tarea de prueba',
          descripcion: 'Descripción de prueba',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Tarea creada exitosamente',
        data: expect.objectContaining({
          id: mockTask.id,
          titulo: mockTask.titulo,
          descripcion: mockTask.descripcion,
          estatus: false,
        }),
      });
      expect(mockCreateTask.execute).toHaveBeenCalledWith({
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
      });
    });

    it('debe crear una tarea exitosamente solo con titulo', async () => {
      const mockTask: Task = {
        id: '507f1f77bcf86cd799439011',
        titulo: 'Tarea sin descripción',
        descripcion: undefined,
        estatus: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: undefined,
        schema_version: 0,
      };

      mockCreateTask.execute.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .send({
          titulo: 'Tarea sin descripción',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockCreateTask.execute).toHaveBeenCalledWith({
        titulo: 'Tarea sin descripción',
        descripcion: undefined,
      });
    });

    it('debe retornar error 400 si no se proporciona el titulo', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          descripcion: 'Solo descripción',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "titulo" es requerido',
      });
      expect(mockCreateTask.execute).not.toHaveBeenCalled();
    });

    it('debe crear tarea si titulo es null (null !== undefined)', async () => {
      // El controlador verifica titulo === undefined, por lo que null pasa la validación
      const mockTask: Task = {
        id: '507f1f77bcf86cd799439011',
        titulo: 'null' as any,
        descripcion: 'Descripción',
        estatus: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: undefined,
        schema_version: 0,
      };

      mockCreateTask.execute.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .send({
          titulo: null,
          descripcion: 'Descripción',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('debe retornar error 400 si el body está vacío', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "titulo" es requerido',
      });
    });
  });

  describe('GET /tasks - Obtener todas las tareas', () => {
    it('debe retornar todas las tareas con paginación por defecto', async () => {
      const mockResult = {
        tasks: [
          {
            id: '1',
            titulo: 'Tarea 1',
            descripcion: 'Descripción 1',
            estatus: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: undefined,
            schema_version: 0,
          },
          {
            id: '2',
            titulo: 'Tarea 2',
            descripcion: 'Descripción 2',
            estatus: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: new Date(),
            schema_version: 0,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockGetAllTasks.execute.mockResolvedValue(mockResult);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.tasks[0].id).toBe('1');
      expect(response.body.data.tasks[1].id).toBe('2');
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.total).toBe(2);
      expect(mockGetAllTasks.execute).toHaveBeenCalledWith(1, 10);
    });

    it('debe retornar tareas con paginación personalizada', async () => {
      const mockResult = {
        tasks: [],
        pagination: {
          page: 2,
          limit: 5,
          total: 25,
          totalPages: 3,
        },
      };

      mockGetAllTasks.execute.mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/tasks')
        .query({ page: '2', limit: '5' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockGetAllTasks.execute).toHaveBeenCalledWith(2, 5);
    });

    it('debe usar valores por defecto si los parámetros no son números válidos', async () => {
      const mockResult = {
        tasks: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      };

      mockGetAllTasks.execute.mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/tasks')
        .query({ page: 'invalid', limit: 'invalid' });

      expect(response.status).toBe(200);
      expect(mockGetAllTasks.execute).toHaveBeenCalledWith(1, 10);
    });

    it('debe manejar lista vacía de tareas', async () => {
      const mockResult = {
        tasks: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      mockGetAllTasks.execute.mockResolvedValue(mockResult);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });
  });

  describe('PATCH /tasks/:id - Marcar tarea como completada/pendiente', () => {
    it('debe marcar una tarea como completada', async () => {
      const mockTask: Task = {
        id: '507f1f77bcf86cd799439011',
        titulo: 'Tarea completada',
        descripcion: 'Descripción',
        estatus: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
        schema_version: 0,
      };

      mockMarkTaskAsCompleted.execute.mockResolvedValue(mockTask);

      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({ estatus: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Tarea marcada como completada',
        data: expect.objectContaining({
          id: mockTask.id,
          estatus: true,
        }),
      });
      expect(mockMarkTaskAsCompleted.execute).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        true
      );
    });

    it('debe marcar una tarea como pendiente', async () => {
      const mockTask: Task = {
        id: '507f1f77bcf86cd799439011',
        titulo: 'Tarea pendiente',
        descripcion: 'Descripción',
        estatus: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: undefined,
        schema_version: 0,
      };

      mockMarkTaskAsCompleted.execute.mockResolvedValue(mockTask);

      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({ estatus: false });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Tarea marcada como pendiente',
        data: expect.objectContaining({
          id: mockTask.id,
          estatus: false,
        }),
      });
      expect(mockMarkTaskAsCompleted.execute).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        false
      );
    });

    it('debe retornar error 400 si estatus no es booleano', async () => {
      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({ estatus: 'true' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "estatus" debe ser true o false',
      });
      expect(mockMarkTaskAsCompleted.execute).not.toHaveBeenCalled();
    });

    it('debe retornar error 400 si estatus es null', async () => {
      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({ estatus: null });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "estatus" debe ser true o false',
      });
    });

    it('debe retornar error 400 si estatus no está presente', async () => {
      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "estatus" debe ser true o false',
      });
    });

    it('debe retornar error 400 si estatus es un número', async () => {
      const response = await request(app)
        .patch('/tasks/507f1f77bcf86cd799439011')
        .send({ estatus: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'El campo "estatus" debe ser true o false',
      });
    });
  });
});
