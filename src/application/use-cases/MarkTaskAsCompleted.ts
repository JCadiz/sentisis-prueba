import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';
import { NotFoundError, BadRequestError } from '@shared/errors';
import mongoose from 'mongoose';

// Caso de uso: Marcar una tarea como completada/pendiente
export class MarkTaskAsCompleted {
    constructor(private readonly taskRepository: ITaskRepository) {}

    async execute(taskId: string, estatus: boolean): Promise<Task> {
        // Validar que el ID sea válido
        if (!taskId || taskId.trim().length === 0) {
            throw new BadRequestError('ID de tarea inválido');
        }

        // Validar que el ID tenga formato de MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new NotFoundError('No se encuentra dicha tarea en nuestro sistema');
        }

        // Verificar que la tarea existe
        const existingTask = await this.taskRepository.findById(taskId);
        if (!existingTask) {
            throw new NotFoundError('No se encuentra dicha tarea en nuestro sistema');
        }

        // Actualizar el estado
        const updatedTask = await this.taskRepository.updateCompleted(taskId, {
            estatus,
        });

        if (!updatedTask) {
            throw new NotFoundError('No se encuentra dicha tarea en nuestro sistema');
        }

        return updatedTask;
    }
}
