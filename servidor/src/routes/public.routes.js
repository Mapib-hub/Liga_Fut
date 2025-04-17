import { Router } from "express";
import { getEquipos, getJugadoresById, getCarrusel, 
        getJugadores, getEquipoById,
        getNotis, getNotisById, getNotis3,
        obtenerFechas, obtenerFecha,
        obtenerPartido, obtenerPartidos, obtenerFechayPartido } from "../controllers/public.controller.js";


const router = Router();

router.get("/equipos", getEquipos); // Devuelve todos los equipos
router.get("/jugadores", getJugadores);// Devuelve todos los jugadores
router.get("/noticias/", getNotis);
router.get("/fechas/", obtenerFechayPartido);
router.get("/partidos", obtenerPartidos);
router.get("/carrusel/", getCarrusel);
router.get("/notis_3/", getNotis3);

router.get("/equipos/:id", getEquipoById); // Devuelve un equipo específico por ID
router.get("/jugadores/:id", getJugadoresById);
router.get("/noticias/:id", getNotisById);
router.get("/fechas/:id", obtenerFecha);
router.get("/partidos/:id", obtenerPartido);


export default router;