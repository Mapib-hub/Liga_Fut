import { z } from "zod";

export const createTaskSchema = z.object({
    tittle: z.string({
        required_error: "El Titulo es requerido",
    }),
    description: z.string({
        required_error: "La descripcion es requerida",
    }),
    date: z.string().datetime().optional(),
});