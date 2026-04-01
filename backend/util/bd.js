import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;
    let uri = 'mongodb://localhost:27017/demoMongo';
    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('Connexion MongoDB réussie');
    } catch (err) {
        console.error('Erreur de connexion MongoDB :', err.message);
        process.exit(1); // Arrête le serveur en cas d’échec
    }
};
