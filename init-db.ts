import 'dotenv/config';
import mongoose from 'mongoose';
import { TaskModel } from './src/infrastructure/database/schemas/TaskSchema';

// Script para cargar datos iniciales en la base de datos

const initialTasks = [
    {
        titulo: 'Configurar proyecto',
        descripcion: 'Instalar dependencias y configurar el entorno de desarrollo',
        estatus: true,
    },
    {
        titulo: 'Diseñar arquitectura',
        descripcion: 'Definir estructura de carpetas y patrones a utilizar',
        estatus: true,
    },
    {
        titulo: 'Implementar modelos de datos',
        descripcion: 'Crear schemas de Mongoose para las entidades',
        estatus: true,
    },
    {
        titulo: 'Crear endpoints de API',
        descripcion: 'Desarrollar los 3 endpoints requeridos: crear tarea, marcar como completada, listar tareas',
        estatus: true,
    },
    {
        titulo: 'Documentar API con Swagger',
        descripcion: 'Agregar documentación OpenAPI para todos los endpoints',
        estatus: true,
    },
    {
        titulo: 'Escribir tests unitarios',
        descripcion: 'Implementar tests para casos de uso y controladores',
        estatus: false,
    },
    {
        titulo: 'Crear Dockerfile',
        descripcion: 'Configurar Docker para ejecutar la aplicación en contenedores',
        estatus: false,
    },
    {
        titulo: 'Configurar Terraform',
        descripcion: 'Crear infraestructura como código para desplegar en AWS EC2',
        estatus: false,
    },
    {
        titulo: 'Setup CI/CD',
        descripcion: 'Configurar pipeline de despliegue con GitHub Actions',
        estatus: false,
    },
    {
        titulo: 'Preparar README',
        descripcion: 'Documentar instrucciones de instalación, uso y decisiones técnicas',
        estatus: false,
    },
    {
        titulo: 'Implementar validaciones',
        descripcion: 'Agregar validaciones de entrada en todos los endpoints',
        estatus: false,
    },
    {
        titulo: 'Configurar variables de entorno',
        descripcion: 'Definir configuración mediante variables de entorno',
        estatus: true,
    },
    {
        titulo: 'Optimizar queries de base de datos',
        descripcion: 'Agregar índices y optimizar consultas de MongoDB',
        estatus: false,
    },
    {
        titulo: 'Implementar logging',
        descripcion: 'Configurar Winston para el registro de eventos y errores',
        estatus: true,
    },
    {
        titulo: 'Agregar manejo de errores',
        descripcion: 'Implementar middleware centralizado para manejo de errores',
        estatus: true,
    },
    {
        titulo: 'Configurar CORS',
        descripcion: 'Establecer políticas de CORS para la API',
        estatus: true,
    },
    {
        titulo: 'Implementar rate limiting',
        descripcion: 'Agregar limitación de peticiones para prevenir abuso',
        estatus: false,
    },
    {
        titulo: 'Documentar decisiones técnicas',
        descripcion: 'Crear documento con justificación de tecnologías y patrones utilizados',
        estatus: false,
    },
    {
        titulo: 'Configurar Health Check',
        descripcion: 'Implementar endpoint de salud del sistema',
        estatus: true,
    },
    {
        titulo: 'Preparar deployment',
        descripcion: 'Configurar scripts y procesos para despliegue en producción',
        estatus: false,
    },
    {
        titulo: 'Code review final',
        descripcion: 'Revisar código completo y aplicar mejores prácticas',
        estatus: false,
    },
    {
        titulo: 'Pruebas de integración',
        descripcion: 'Crear tests de integración para flujos completos',
        estatus: false,
    },
    {
        titulo: 'Configurar monitoreo',
        descripcion: 'Implementar herramientas de monitoreo y alertas',
        estatus: false,
    },
    {
        titulo: 'Optimizar rendimiento',
        descripcion: 'Analizar y mejorar tiempos de respuesta de la API',
        estatus: false,
    },
    {
        titulo: 'Implementar cache',
        descripcion: 'Agregar capa de caché para consultas frecuentes',
        estatus: false,
    },
];

async function initializeDatabase() {
    try {
        console.log('🚀 Iniciando carga de datos...');

        // Conectar a MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI no está definido en las variables de entorno');
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Conectado a MongoDB');

        // Limpiar colección existente
        const count = await TaskModel.countDocuments();
        if (count > 0) {
            console.log(`⚠️  Encontradas ${count} tareas existentes. Limpiando...`);
            await TaskModel.deleteMany({});
            console.log('✅ Colección limpiada');
        }

        // Insertar datos iniciales
        console.log(`📝 Insertando ${initialTasks.length} tareas de ejemplo...`);

        // Agregar completedAt a las tareas completadas
        const tasksWithDates = initialTasks.map(task => ({
            ...task,
            completedAt: task.estatus ? new Date() : null,
        }));

        const tasks = await TaskModel.insertMany(tasksWithDates);
        console.log(`✅ ${tasks.length} tareas insertadas correctamente`);

        // Mostrar estadísticas
        const totalTasks = await TaskModel.countDocuments();
        const completedTasks = await TaskModel.countDocuments({ estatus: true });
        const pendingTasks = totalTasks - completedTasks;

        console.log('\n📊 Estadísticas:');
        console.log(`   Total de tareas: ${totalTasks}`);
        console.log(`   Completadas: ${completedTasks}`);
        console.log(`   Pendientes: ${pendingTasks}`);

        // Mostrar tareas insertadas
        console.log('\n📋 Tareas cargadas:');
        tasks.forEach((task, index) => {
            const status = task.estatus ? '✓' : '○';
            console.log(`   ${index + 1}. [${status}] ${task.titulo}`);
        });

        console.log('\n✅ Datos iniciales cargados exitosamente');

    } catch (error) {
        console.error('❌ Error al cargar datos iniciales:', error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('\n👋 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar script
initializeDatabase();
