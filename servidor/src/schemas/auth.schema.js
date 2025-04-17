import { z } from "zod";

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Invalid email",
    }),
    password: z.string({
        required_error: "Password is required",
    }).min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
    }),
}); 

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Email no valido",
    }),
    password: z.string({
        required_error: "Password is required",
    }).min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
    }),
}); 