import mongoose from 'mongoose';

// Clase para manejar la conexión a MongoDB
export class MongoDBConnection {
    private static instance: MongoDBConnection;
    private isConnected: boolean = false;

    private constructor() {}

    static getInstance(): MongoDBConnection {
        if (!MongoDBConnection.instance) {
            MongoDBConnection.instance = new MongoDBConnection();
        }
        return MongoDBConnection.instance;
    }

    async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('📦 MongoDB: Conexión ya establecida');
            return;
        }

        try {
            const mongoUri = process.env.MONGO_URI;

            if (!mongoUri) {
                throw new Error('MONGO_URI no definido en variables de entorno');
            }

            await mongoose.connect(mongoUri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            this.isConnected = true;
            console.log('✅ MongoDB conectado exitosamente');

            // Listeners de eventos de conexión
            mongoose.connection.on('error', (error) => {
                console.error('❌ Error en conexión MongoDB:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB desconectado');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconectado');
                this.isConnected = true;
            });

        } catch (error) {
            console.error('❌ Error al conectar con MongoDB:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('👋 MongoDB desconectado correctamente');
        } catch (error) {
            console.error('❌ Error al desconectar MongoDB:', error);
            throw error;
        }
    }

    getConnection(): typeof mongoose {
        return mongoose;
    }

    isConnectedStatus(): boolean {
        return this.isConnected;
    }
}

// Funciones auxiliares para facilitar el uso
export const connectDatabase = async (): Promise<void> => {
    const mongoConnection = MongoDBConnection.getInstance();
    await mongoConnection.connect();
};

export const disconnectDatabase = async (): Promise<void> => {
    const mongoConnection = MongoDBConnection.getInstance();
    await mongoConnection.disconnect();
};

export default MongoDBConnection;
