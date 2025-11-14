import 'dotenv/config';
import App from './app';

// Punto de entrada de la aplicación
const app = new App();

// Inicializar y arrancar el servidor
app.initialize()
    .then(() => {
        app.listen();
    })
    .catch((error) => {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    });
