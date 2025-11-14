// Entidad de dominio para una Tarea
export interface Task {
    id: string;
    titulo: string;
    descripcion?: string;
    estatus: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    schema_version: number;
}

// DTO para crear una tarea
export interface CreateTaskDto {
    titulo: string;
    descripcion?: string;
}

// DTO para actualizar una tarea
export interface UpdateTaskDto {
    estatus: boolean;
}
