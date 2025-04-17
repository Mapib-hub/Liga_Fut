import { Router } from "express";
import { authRequire } from "../middleware/validateToken.js";
import { getTask, getTasks, createTask, updateTask, deleteTask, getTareas } from "../controllers/tasks.contrller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";

const router = Router();

router.get('/taskz', getTareas );

router.get('/tasks', authRequire, getTasks );

router.get('/tasks/:id', authRequire, getTask);

router.post('/tasks', authRequire, validateSchema(createTaskSchema), createTask);

router.delete('/tasks/:id', authRequire, deleteTask);

router.put('/tasks/:id', authRequire, updateTask);

export default router;