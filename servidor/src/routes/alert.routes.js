// servidor/src/routes/alert.routes.js
import { Router } from "express";
// 1. Asegúrate que el nombre es 'updateAlert' (sin 'd')
import { updateAlert } from "../controllers/public.controller.js";
// 2. Asegúrate que la carpeta es 'middleware' (singular) y el nombre de función es el correcto (usando 'authRequire' como en tu archivo)
import { authRequire } from "../middleware/validateToken.js"; // Verifica si es authRequire o authRequired en validateToken.js

const router = Router();

// Ruta PUT para actualizar/crear la alerta (protegida)
router.put(
    "/alert",        // El endpoint
    authRequire,     // Middleware de protección (verifica el nombre exportado)
    updateAlert      // Controlador (nombre sin 'd')
);

export default router;
