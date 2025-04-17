import { Router } from "express";
import { authRequire } from "../middleware/validateToken.js";
import { getJugadores, createMultipleJugadores, createJugador, getJugador, updateJugador, deleteJugador, updateGoles } from "../controllers/jugador.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createJugaShema } from "../schemas/jugador.schema.js";
import path from 'path';
import multer from "multer";
import { fileURLToPath } from 'url';
import { upload } from "../middleware/multer.js";


const router = Router();

router.get('/players', authRequire, getJugadores);

router.get('/players/:id', authRequire, getJugador);

router.put("/goles/:id", updateGoles);

  router.post(
      "/players",
      authRequire,
      upload.single("foto_jug"), // <-- Asegúrate de separar los middlewares con comas
      (req, res, next) => {
        ///console.log(req.body);
        try {
          ///console.log("Datos recibidos:", req.body);
          //console.log("Archivo subido:", req.file);
          next(); // Continúa hacia el controlador createJugador
        }  catch (error) {
          next(error);
        }
      },
      (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "El archivo es demasiado grande. Límite: 5MB." });
          }
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      },
      
      createJugador // Finalmente, el controlador para crear el jugador
    );
  

router.put('/players/:id', authRequire,
  upload.single("foto_jug"), // <-- Asegúrate de separar los middlewares con comas
  (req, res, next) => {
    try {
     // console.log("Archivo subido:", req.file);
      next();
    } catch (error) {
      next(error);
    }
  },
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "El archivo es demasiado grande. Límite: 5MB." });
      }
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  }, updateJugador);

router.delete('/players/:id', authRequire, deleteJugador);

router.post('/players/multiples', authRequire, createMultipleJugadores);

export default router;