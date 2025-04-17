import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from './routes/auth.routes.js';
import taskRoutes from "./routes/tasks.routes.js";
import equiposRoutes from "./routes/equipos.routes.js";
import notiRoutes from "./routes/noti.routes.js";
import jugadorRoutes from "./routes/jugador.routes.js";
import fechaRoutes from "./routes/fecha.routes.js";
import publicRoutes from "./routes/public.routes.js";
import partidoRoutes from "./routes/partido.routes.js";
/*import imegesRoutes from "./routes/imeges.routes.js"; // Corregido: imagesRoutes

*/

const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log(">>> CORS habilitado para:", FRONTEND_URL); // Muestra el origen permitido

app.use(cors({
    origin: FRONTEND_URL, // 3. Usa la variable aquí.
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api',authRoutes);
app.use('/api',taskRoutes);
app.use('/api',equiposRoutes);
app.use('/api',notiRoutes);
app.use('/api',jugadorRoutes);
app.use("/api", fechaRoutes);
app.use("/public", publicRoutes);
app.use("/api", partidoRoutes);

export default app;
