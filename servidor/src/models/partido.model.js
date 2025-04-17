import mongoose from "mongoose";

const partidoSchema = new mongoose.Schema({
  equipo_local: { type: mongoose.Schema.Types.ObjectId, ref: "Equip", required: true },
  equipo_visitante: { type: mongoose.Schema.Types.ObjectId, ref: "Equip", required: true },
  marcador_local: { type: Number, default: null },
  marcador_visitante: { type: Number, default: null },
  lugar: { type: String, required: true },
  fecha: { type: mongoose.Schema.Types.ObjectId, ref: "Fecha", required: true  },
  estado: { type: String, enum: ["pendiente", "en juego", "finalizado"], default: "pendiente" },
});

// Virtual para obtener "equipo_local vs equipo_visitante"
partidoSchema.virtual("descripcion_partido").get(function () {
  return `${this.equipo_local} vs ${this.equipo_visitante}`;
});

// Habilitar los virtuales para JSON y objetos
partidoSchema.set("toJSON", { virtuals: true });
partidoSchema.set("toObject", { virtuals: true });

const Partido = mongoose.model("Partido", partidoSchema);

export default Partido;




