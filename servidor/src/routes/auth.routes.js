import { Router } from "express";
import { login , register, logout, profile, verifyToken } from "../controllers/auth.controller.js";
import { authRequire } from "../middleware/validateToken.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import {registerSchema, loginSchema } from  "../schemas/auth.schema.js";

const router = Router()

router.post('/login',validateSchema(loginSchema), login);

router.post('/register',validateSchema(registerSchema), register);

router.post('/logout', logout);

router.get('/verify', verifyToken);

router.get('/profile', authRequire, profile);

export default router