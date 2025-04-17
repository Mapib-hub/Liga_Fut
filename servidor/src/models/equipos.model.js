import mongoose from "mongoose";

const equipoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    description: { type: String, required: true },
    foto_equipo: { type: String, default: "equipo.jpg" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    estadio: { type: String, default: "Por Confirmar" },
    fundado: { type: Date, default: Date.now },
    partidos_jugados: { type: Number, default: 0 },
    victorias: { type: Number, default: 0 },
    empates: { type: Number, default: 0 },
    derrotas: { type: Number, default: 0 },
    goles_a_favor: { type: Number, default: 0 },
    goles_en_contra: { type: Number, default: 0 },
    diferencia_de_goles: { type: Number, default: 0 },
    puntos: { type: Number, default: 0 },

  },
  {
    timestamps: true,
  }
);

// Virtual para relacionar jugadores
equipoSchema.virtual("jugadores", {
  ref: "Juga", // Modelo de referencia
  localField: "_id", // Campo en el modelo actual
  foreignField: "equip", // Campo en el modelo relacionado
});

// Configuración para incluir virtuals en las respuestas
equipoSchema.set("toJSON", { virtuals: true });
equipoSchema.set("toObject", { virtuals: true });

export default mongoose.model("Equip", equipoSchema);
