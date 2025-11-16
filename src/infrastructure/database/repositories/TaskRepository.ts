import { ITaskRepository, PaginationOptions, PaginatedResult } from '@domain/repositories/ITaskRepository';
import { Task, CreateTaskDto, UpdateTaskDto } from '@domain/entities/Task';
import { TaskModel } from '@infrastructure/database/schemas/TaskSchema';

// Implementación del repositorio usando Mongoose
export class TaskRepository implements ITaskRepository {

    async create(data: CreateTaskDto): Promise<Task> {
        const task = await TaskModel.create({
            titulo: data.titulo,
            descripcion: data.descripcion,
            estatus: false,
        });

        return this.mapToEntity(task);
    }

    async findById(id: string): Promise<Task | null> {
        const task = await TaskModel.findById(id);

        if (!task) {
            return null;
        }

        return this.mapToEntity(task);
    }

    async findAll(options?: PaginationOptions): Promise<PaginatedResult<Task>> {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;

        // Obtener total de documentos
        const total = await TaskModel.countDocuments();

        // Obtener tareas paginadas
        const tasks = await TaskModel.find()
            .sort({ createdAt: -1 }) // Más recientes primero
            .skip(skip)
            .limit(limit)
            .lean(); // Mejora performance

        return {
            data: tasks.map(task => this.mapToEntity(task)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updateCompleted(id: string, data: UpdateTaskDto): Promise<Task | null> {
        const task = await TaskModel.findByIdAndUpdate(
            id,
            { estatus: data.estatus },
            { new: true, runValidators: true }
        );

        if (!task) {
            return null;
        }

        return this.mapToEntity(task);
    }

    // Mapear documento de Mongoose a entidad de dominio
    private mapToEntity(doc: any): Task {
        return {
            id: doc._id.toString(),
            titulo: doc.titulo,
            descripcion: doc.descripcion,
            estatus: doc.estatus,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            completedAt: doc.completedAt,
            schema_version: doc.schema_version,
        };
    }
}
