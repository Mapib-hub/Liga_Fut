// servidor/src/app.js
import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// --- Importaciones de Rutas ---
import authRoutes from './routes/auth.routes.js';
import taskRoutes from "./routes/tasks.routes.js";
import equiposRoutes from "./routes/equipos.routes.js";
import notiRoutes from "./routes/noti.routes.js";
import jugadorRoutes from "./routes/jugador.routes.js";
import fechaRoutes from "./routes/fecha.routes.js";
import publicRoutes from "./routes/public.routes.js";
import partidoRoutes from "./routes/partido.routes.js";
// --- 1. Importar las rutas de alerta ---
import alertRoutes from "./routes/alert.routes.js"; // Asegúrate que el nombre del archivo sea correcto
/*import imegesRoutes from "./routes/imeges.routes.js"; // Corregido: imagesRoutes
*/

const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Servir archivos estáticos (imágenes subidas)
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Configuración CORS
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log(">>> CORS habilitado para:", FRONTEND_URL); // Muestra el origen permitido
    app.use(cors({
        origin: FRONTEND_URL,
        credentials: true
    }));

// Middlewares generales
app.use(morgan('dev')); // Log de peticiones
app.use(express.json()); // Parsear JSON bodies
app.use(cookieParser()); // Parsear cookies

// --- Montaje de Rutas ---
// Rutas de Autenticación y API general (probablemente protegidas internamente o con authRequired)
app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', equiposRoutes);
app.use('/api', notiRoutes);
app.use('/api', jugadorRoutes);
app.use("/api", fechaRoutes);
app.use("/api", partidoRoutes);

// Rutas Públicas (sin prefijo /api usualmente, o con uno específico como /public)
app.use("/public", publicRoutes); // Mantiene las rutas públicas como estaban

// --- 2. Montar las rutas de alerta bajo un prefijo de admin ---
// Usaremos '/api/admin' para agrupar las rutas específicas de administración
app.use("/api", alertRoutes); // Monta alert.routes.js bajo /api/admin

// Rutas de imágenes (si las usas)
// app.use('/api', imegesRoutes);

export default app;
