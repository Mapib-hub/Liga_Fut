// servidor/src/routes/public.routes.js
import { Router } from "express";
// 1. Importar el controlador (¡AÑADIR getAlert AQUÍ!)
import {
    getEquipos, getJugadoresById, getCarrusel,
    getJugadores, getEquipoById,
    getNotis, getNotisById, getNotis3,
    obtenerFechas, obtenerFecha,
    obtenerPartido, obtenerPartidos, obtenerFechayPartido,
    getAlert, getGoleadores
} from "../controllers/public.controller.js";


const router = Router();

// Rutas existentes
router.get("/equipos", getEquipos);
router.get("/jugadores", getJugadores);
router.get("/goleadores", getGoleadores);
router.get("/noticias/", getNotis);
router.get("/fechas/", obtenerFechayPartido);
router.get("/partidos", obtenerPartidos);
router.get("/carrusel/", getCarrusel);
router.get("/notis_3/", getNotis3);


router.get("/equipos/:id", getEquipoById);
router.get("/jugadores/:id", getJugadoresById);
router.get("/noticias/:id", getNotisById);
router.get("/fechas/:id", obtenerFecha);
router.get("/partidos/:id", obtenerPartido);

// --- Ruta para la alerta (Ahora debería funcionar) ---
router.get("/alert", getAlert); // <--- Esta línea ahora encontrará getAlert

export default router;
