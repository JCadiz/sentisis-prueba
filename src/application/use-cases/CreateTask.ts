import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task, CreateTaskDto } from '@domain/entities/Task';
import { BadRequestError } from '@shared/errors';

// Caso de uso: Crear una nueva tarea
export class CreateTask {
    constructor(private readonly taskRepository: ITaskRepository) {}

    async execute(data: CreateTaskDto): Promise<Task> {
        // Validar que titulo sea un string
        if (typeof data.titulo !== 'string') {
            throw new BadRequestError('El campo "titulo" debe ser una cadena de texto');
        }

        // Validaciones de negocio
        if (!data.titulo || data.titulo.trim().length === 0) {
            throw new BadRequestError('El título es requerido');
        }

        // Validar que el título solo contenga caracteres válidos
        const tituloTrimmed = data.titulo.trim();
        if (!/^[\p{L}\p{N}\s.,;:()\-¿?¡!áéíóúñÁÉÍÓÚÑ]+$/u.test(tituloTrimmed)) {
            throw new BadRequestError('El título contiene caracteres no válidos. Solo se permiten letras, números y signos de puntuación básicos');
        }

        if (data.titulo.length > 200) {
            throw new BadRequestError('El título no puede exceder 200 caracteres');
        }

        // Validar descripción si está presente
        if (data.descripcion !== undefined && data.descripcion !== null) {
            if (typeof data.descripcion !== 'string') {
                throw new BadRequestError('El campo "descripcion" debe ser una cadena de texto');
            }

            if (data.descripcion.length > 1000) {
                throw new BadRequestError('La descripción no puede exceder 1000 caracteres');
            }
        }

        // Crear la tarea
        const task = await this.taskRepository.create({
            titulo: tituloTrimmed,
            descripcion: data.descripcion?.trim(),
        });

        return task;
    }
}
