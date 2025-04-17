import mongoose from 'mongoose';

const fechaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    total_partidos: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Relación virtual para los partidos relacionados
fechaSchema.virtual("partidos", {
  ref: "Partido",           // El modelo de referencia (Partido)
  localField: "_id",        // El campo en el modelo actual (Fecha) que se usará para buscar los partidos
  foreignField: "fecha",    // El campo en el modelo Partido que hace referencia a la Fecha (asumiendo que en Partido hay un campo 'fecha' que es un ObjectId que apunta a Fecha)
});

// Configuración para incluir virtuals en las respuestas
fechaSchema.set("toJSON", { virtuals: true });
fechaSchema.set("toObject", { virtuals: true });

export default mongoose.model("Fecha", fechaSchema);
