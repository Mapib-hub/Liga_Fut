import { Router } from "express";
import { authRequire } from "../middleware/validateToken.js";
import { getNotis, createNoti, getNoti, updateNoti, deleteNoti } from "../controllers/noti.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";

import { upload } from "../middleware/multerNoti.js";
 // Asegúrate de que el nombre del campo es 'imagen'
 import multer from "multer";


const router = Router();

router.get('/notis', authRequire, getNotis);

router.get('/notis/:id', authRequire, getNoti);

router.post(
      "/notis",
      authRequire,
      upload.single("foto_noti"), // <-- Asegúrate de separar los middlewares con comas
      (req, res, next) => {
        ///console.log(req.body);
        try {
          ///console.log("Datos recibidos:", req.body);
          console.log("Archivo subido:", req.file);
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
      
      createNoti // Finalmente, el controlador para crear el jugador
    );
 
router.put('/notis/:id', authRequire,
    upload.single("foto_noti"), // <-- Asegúrate de separar los middlewares con comas
  (req, res, next) => {
    try {
     console.log("Archivo subido:", req.file);
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
  }, updateNoti);

router.delete('/notis/:id', authRequire, deleteNoti);

export default router;