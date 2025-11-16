import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para el documento de MongoDB
export interface ITaskDocument extends Document {
    titulo: string;
    descripcion?: string;
    estatus: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    schema_version: number;
}

// Schema de Mongoose para Task
const TaskSchema = new Schema<ITaskDocument>(
    {
        titulo: {
            type: String,
            required: [true, 'El título es requerido'],
            trim: true,
            maxlength: [200, 'El título no puede exceder 200 caracteres'],
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
        },
        estatus: {
            type: Boolean,
            default: false,
            index: true, // Índice para búsquedas rápidas por estado
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Crea automáticamente createdAt y updatedAt
        collection: 'tasks',
        versionKey: 'schema_version', 
    }
);

// Middleware pre-save para actualizar completedAt cuando estatus cambia a true
TaskSchema.pre('save', function(next) {
    if (this.isModified('estatus')) {
        if (this.estatus === true && !this.completedAt) {
            this.completedAt = new Date();
        } else if (this.estatus === false) {
            this.completedAt = undefined;
        }
    }
    next();
});

// Middleware para findOneAndUpdate
TaskSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate() as any;

    if (update.estatus !== undefined) {
        if (update.estatus === true) {
            update.completedAt = new Date();
        } else if (update.estatus === false) {
            update.$unset = { completedAt: 1 };
        }
    }

    next();
});

// Índices para mejorar rendimiento
TaskSchema.index({ createdAt: -1 }); // Para ordenar por fecha de creación
TaskSchema.index({ estatus: 1, createdAt: -1 }); // Para filtrar y ordenar

// Modelo de Mongoose
export const TaskModel: Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', TaskSchema);
