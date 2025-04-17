import { Router } from "express";
import { authRequire } from "../middleware/validateToken.js";
import { 
  crearFecha, 
  obtenerFechas, 
  obtenerFecha, 
  actualizarFecha, 
  eliminarFecha 
} from "../controllers/fecha.controller.js";

const router = Router();

// Crear una nueva fecha
router.post("/fechas", authRequire, crearFecha);

// Obtener todas las fechas
router.get("/fechas", authRequire, obtenerFechas);

// Obtener una fecha específica
router.get("/fechas/:id", authRequire, obtenerFecha);

// Actualizar una fecha
router.put("/fechas/:id", authRequire, actualizarFecha);

// Eliminar una fecha
router.delete("/fechas/:id", authRequire, eliminarFecha);

export default router;
