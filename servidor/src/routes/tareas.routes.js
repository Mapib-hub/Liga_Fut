import { Router } from "express";

import { getTask, getTasks, getTareas } from "../controllers/tasks.contrller.js";

const router = Router();

router.get('/', getTareas );

router.get('/tarea/:id', getTask);

export default router;