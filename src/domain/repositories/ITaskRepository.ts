import { Task, CreateTaskDto, UpdateTaskDto } from '@domain/entities/Task';

// Interfaz para paginación
export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Interface del repositorio (Puerto/Contract)
export interface ITaskRepository {
    create(data: CreateTaskDto): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    findAll(options?: PaginationOptions): Promise<PaginatedResult<Task>>;
    updateCompleted(id: string, data: UpdateTaskDto): Promise<Task | null>;
    delete(id: string): Promise<boolean>;
}
