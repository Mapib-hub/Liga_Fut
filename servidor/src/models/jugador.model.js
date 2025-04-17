import mongoose from "mongoose";

const jugadorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Si es opcional
      unique: true,
    },
    fecha_nac: {
      type: Date,
      required: true, // Es mejor hacerla obligatoria y sin valor por defecto
    },
    posicion: {
      type: String,
      enum: ["Portero", "Defensa", "Mediocampista", "Delantero"], // Valores válidos
      required: false,
    },
    foto_jug: {
      type: String,
      default: "player.jpg",
    },
    goles: {
      type: Number, 
      default: 0 
    },
    tarjetas_amarillas: {
      type: Number, 
      default: 0 
    },
    tarjetas_rojas: {
      type: Number, 
      default: 0 
    },
    equip: { // Nombre más descriptivo
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equip",
      required: true,
    },
    user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Juga", jugadorSchema);
