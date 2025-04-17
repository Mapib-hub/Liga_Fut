import { Router } from "express";
import Equip from "../models/equipos.model.js";
import { authRequire } from "../middleware/validateToken.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createEquipoShema } from "../schemas/equipo.schema.js";
import { createEquip, getEquipos, updateEquip, getEqui, deleteEquip } from "../controllers/equipo.controller.js";

import {upload} from '../middleware/multerConfig.js'; // TU CONFIG DE MULTER


const router = Router();

router.get('/equipos', authRequire, getEquipos);

router.get('/equipos/:id', authRequire, getEqui);

router.post('/equipos',authRequire, (req, res, next) => 
    {
        upload(req, res, (err) => {
        // console.log(req.file)
         //console.log(req.body)
        if (err) {
            if (err instanceof multer.MulterError) {
                // Manejo de errores específicos de Multer
                return res.status(500).json({ error: err.message });
            } else {
                // Manejo de errores desconocidos
                return res.status(500).json({ err });
            }
        }
        validateSchema(createEquipoShema)(req, res, next);
        try {
            const { nombre, description, estadio, fundado} = req.body;
            const foto_equipo = req.file.filename;
            ////console.log(foto_equipo)
            const newEqui = new Equip({
                nombre,
                description,
                foto_equipo,
                estadio,
                fundado,
                user: req.user.id,
            });
            const saveEqui = newEqui.save();
            ///console.log (saveEqui);
           return res.json(saveEqui);
        } catch (error) {
           // console.log(error)
            return res.status(500).json({ message: "Algo salio Mal" });
        }
       //console.log(req.file.filename)
        res.status(200).json({ message: 'Archivo subido con éxito.' });    
    });
    next();
}, );
router.put(
    '/equipos/:id',
    authRequire, // O el middleware de autenticación que uses
    upload.single('foto_equipo'), // Middleware de Multer para UN archivo llamado 'foto_equipo'
    updateEquip
  );

router.delete('/equipos/:id', authRequire, deleteEquip);

export default router;