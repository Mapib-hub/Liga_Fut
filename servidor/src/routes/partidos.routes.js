import express from "express";
import { generarCalendario } from "../controller/calendario.controller.js"; // Ruta al controlador
const router = express.Router();

router.post("/generar-calendario", generarCalendario);

export default router;
