import mongoose from "mongoose";

// 1. Lee la variable de entorno 'DATABASE_URL'.
// 2. Si no existe, usa 'mongodb://localhost/prueba' como valor por defecto (para desarrollo local).
const MONGO_URI = process.env.DATABASE_URL ;

export const conectDB = async () =>{
    try {
        // 3. Usa la variable MONGO_URI para conectar.
        await mongoose.connect(MONGO_URI);
        console.log(">>> Base de datos conectada a:", MONGO_URI); // Muestra a qué URL se conectó
    } catch (error) {
        console.error("Error conectando a la base de datos:", error);
        process.exit(1); // Salir si no se puede conectar a la DB es una buena práctica
    }
};
