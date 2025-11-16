import { Router } from 'express';
import { taskRoutes } from './taskRoutes';

// Router principal de la API
const routes = Router();

// Montar rutas de los módulos
routes.use('/tasks', taskRoutes);

export { routes };
