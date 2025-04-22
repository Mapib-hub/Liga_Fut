import { Router } from "express";
import Equip from "../models/equipos.model.js";
import { authRequire } from "../middleware/validateToken.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createEquipoShema } from "../schemas/equipo.schema.js";
import { createEquip, getEquipos, updateEquip, getEqui, deleteEquip } from "../controllers/equipo.controller.js"
import {upload} from '../middleware/multerConfig.js'; // TU CONFIG DE MULTER


const router = Router();

router.get('/equipos', authRequire, getEquipos);

router.get('/equipos/:id', authRequire, getEqui);

router.post(
    '/equipos', 
    authRequire, // O el middleware de autenticación que uses
    upload.single('foto_equipo'), // Middleware de Multer para UN archivo llamado 'foto_equipo'
    createEquip
  );

router.put(
    '/equipos/:id',
    authRequire, // O el middleware de autenticación que uses
    upload.single('foto_equipo'), // Middleware de Multer para UN archivo llamado 'foto_equipo'
    updateEquip
  );

router.delete('/equipos/:id', authRequire, deleteEquip);

export default router;