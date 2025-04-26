// servidor/src/models/alert.model.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    required: true,
    default: false, // Por defecto, la alerta está inactiva
  },
  message: {
    type: String,
    trim: true,
    default: '', // Mensaje vacío por defecto
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error'], // Solo permite estos valores
    default: 'info', // Tipo 'info' por defecto
  },
}, {
  // timestamps: true // Opcional: si quieres saber cuándo se creó/actualizó
});

// Creamos un índice único para asegurar que solo haya un documento.
// Usaremos un campo 'singleton' con un valor fijo.
// Esto es un truco común para asegurar que solo haya una fila/documento
// que represente una configuración global.
alertSchema.add({
  singleton: {
    type: String,
    default: 'global_alert_config', // Valor fijo
    unique: true, // Asegura que solo haya un documento con este valor
    required: true,
  }
});


export default mongoose.model('Alert', alertSchema);
