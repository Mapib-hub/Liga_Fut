import React from 'react';
import EquipoForm from './EquipoForm'; // Importa el formulario

// Recibe:
// - isOpen: boolean para mostrar/ocultar
// - onClose: función para cerrar el modal
// - onSave: función para guardar (se pasará al EquipoForm)
// - equipoToEdit: los datos del equipo a editar (null si es para crear)
function EquipoModal({ isOpen, onClose, onSave, equipoToEdit }) {
  if (!isOpen) return null; // No renderizar nada si no está abierto

  const handleFormSubmit = (formData) => {
    // Llama a la función onSave pasada desde EquiposPage
    // Pasa los datos del formulario y el ID (si estamos editando)
    onSave(formData, equipoToEdit ? equipoToEdit._id : null);
  };

  return (
    // Fondo oscuro semi-transparente (overlay)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {equipoToEdit ? 'Editar Equipo' : 'Añadir Nuevo Equipo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Cerrar modal"
          >
            &times; {/* Es una 'X' */}
          </button>
        </div>

        {/* Cuerpo del Modal (aquí va el formulario) */}
        <div className="p-6">
          <EquipoForm
            initialData={equipoToEdit}
            onSubmit={handleFormSubmit}
            onCancel={onClose} // <--- ¡Aquí está! Pasa la función onClose como prop llamada onCancel
          />
        </div>
      </div>
    </div>
  );
}

export default EquipoModal;
