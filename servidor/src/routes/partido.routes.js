import { Router } from "express";
import { 
  crearPartido, 
  obtenerPartidos, 
  obtenerPartido, 
  actualizarPartido,
  actualizarGoles,
  eliminarPartido 
} from "../controllers/partido.controller.js";

const router = Router();
 
// Crear un nuevo partido
router.post("/partidos", crearPartido);

// Obtener todos los partidos
router.get("/partidos", obtenerPartidos);

// Obtener un partido específico
router.get("/partidos/:id", obtenerPartido);

// Actualizar un partido
router.put("/partidos/:id", actualizarPartido);

router.put("/goles_partido/:id", actualizarGoles);

// Eliminar un partido
router.delete("/partidos/:id", eliminarPartido);


export default router;
