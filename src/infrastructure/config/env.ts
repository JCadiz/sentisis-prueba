import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración centralizada de variables de entorno
export const config = {
    // Servidor
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // Base de datos
    mongoUri: process.env.MONGO_URI || '',

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || '*',

    // Logs
    logLevel: process.env.LOG_LEVEL || 'info',
} as const;

// Validar que las variables requeridas estén configuradas
export const validateEnv = (): void => {
    const requiredEnvVars = ['MONGO_URI'];

    const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
        throw new Error(
            `Variables de entorno faltantes: ${missingEnvVars.join(', ')}`
        );
    }
};
