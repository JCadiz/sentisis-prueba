import { ITaskRepository, PaginationOptions } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';

// Caso de uso: Obtener todas las tareas
export class GetAllTasks {
    constructor(private readonly taskRepository: ITaskRepository) {}

    async execute(page: number = 1, limit: number = 10): Promise<{
        tasks: Task[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const options: PaginationOptions = { page, limit };
        const result = await this.taskRepository.findAll(options);

        return {
            tasks: result.data,
            pagination: result.pagination,
        };
    }
}
