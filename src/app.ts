import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { routes } from '@interfaces/http/routes';
import logger from '@infrastructure/logger/logger';
import { config } from '@infrastructure/config/env';
import { swaggerSpecs } from '@infrastructure/config/swagger';
import express, { Application, Request, Response } from 'express';
import { connectDatabase } from '@infrastructure/database/mongodb';
import { errorHandler, requestLogger } from '@infrastructure/middlewares';

// Clase principal de la aplicación
class App {
    public app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = config.port;
    }

    // Configuración de middlewares globales
    private initializeMiddlewares(): void {
        // Seguridad con Helmet (CSP desactivado para permitir Swagger UI)
        this.app.use(helmet({
            contentSecurityPolicy: false, // Desactiva CSP para permitir Swagger
            hsts: false, // Desactiva HSTS porque no tenemos SSL
            crossOriginOpenerPolicy: false, // Desactiva COOP para HTTP
        }));

        // CORS para permitir peticiones desde otros dominios
        this.app.use(cors({
            origin: config.corsOrigin,
            methods: 'GET,HEAD,PUT,PATCH,POST',
            preflightContinue: false,
            optionsSuccessStatus: 200,
            credentials: true,
        }));

        // Logger de peticiones HTTP
        this.app.use(requestLogger);

        // Parser del body de las peticiones
        this.app.use(express.json({ limit: '20mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '20mb' }));
    }

    // Configuración de las rutas de la aplicación
    private initializeRoutes(): void {
        // Ruta de bienvenida
        this.app.get('/', (_req: Request, res: Response) => {
            res.status(200).json({
                message: 'Bienvenido a Sentisis Test API Prueba Tecnica',
                version: '1.0.0',
                environment: config.nodeEnv,
                documentation: '/api-docs',
            });
        });

        // Documentación de Swagger (no requiere autenticación)
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'Sentisis Test API - Documentación',
        }));

        this.app.use('/api', routes);

        // Manejador de rutas no encontradas
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({
                error: 'Ruta no encontrada',
                message: `No existe ${req.method} ${req.url}`,
            });
        });

        // Manejador global de errores (debe ser el último)
        this.app.use(errorHandler);
    }

    // Inicializa la aplicación completa
    public async initialize(): Promise<void> {
        try {
            logger.info('🚀 Iniciando aplicación...');

            // Conectar a la base de datos
            await connectDatabase();

            // Configurar middlewares
            this.initializeMiddlewares();

            // Configurar rutas
            this.initializeRoutes();

            logger.info('✅ Aplicación iniciada correctamente');
        } catch (error) {
            logger.error('❌ Error al iniciar la aplicación:', error);
            throw error;
        }
    }

    // Inicia el servidor en el puerto configurado
    public listen(): void {
        this.app.listen(this.port, () => {
            logger.info(`🚀 Servidor corriendo en http://localhost:${this.port}`);
            logger.info(`📝 Ambiente: ${config.nodeEnv}`);
            logger.info(`📊 MongoDB: ${config.mongoUri ? 'Conectado' : 'No configurado'}`);
            logger.info(`📚 Documentación: http://localhost:${this.port}/api-docs`);
        });
    }

    // Retorna la instancia de Express
    public getApp(): Application {
        return this.app;
    }
}

export default App;
