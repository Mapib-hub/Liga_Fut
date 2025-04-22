// src/components/FechaModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Helper para formatear la fecha a YYYY-MM-DD (necesario para input type="date")
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    // Intentamos crear una fecha. Si viene como ISO string, funciona.
    const date = new Date(dateString);
    // getFullYear, getMonth (0-indexed), getDate
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es 0-indexed, padStart para '05'
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return ''; // Devuelve vacío si hay error
  }
};

function FechaModal({ isOpen, onClose, onSave, fechaActual }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const isEditing = Boolean(fechaActual);

  useEffect(() => {
    if (isEditing && fechaActual) {
      // Llenar campos del modelo Fecha
      setValue('nombre', fechaActual.nombre || ''); // Campo 'nombre' del modelo
      setValue('fecha', formatDateForInput(fechaActual.fecha)); // Campo 'fecha' del modelo, formateado
      // No hay 'numero' ni 'estado' en el modelo
      // 'total_partidos' usualmente no se edita manualmente
    } else {
      // Resetear a valores por defecto para creación
      reset({
        nombre: '',
        fecha: '', // Fecha vacía por defecto
      });
    }
  }, [isEditing, fechaActual, setValue, reset]);

  const onSubmit = (data) => {
    // Asegurarse de que la fecha se envíe en un formato adecuado si es necesario
    // React Hook Form con valueAsDate debería manejarlo bien, pero verifica en backend
    console.log('Datos a guardar:', data);
    onSave(data);
    // onClose(); // Opcional: cerrar modal
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Fecha' : 'Crear Nueva Fecha'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition duration-150"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="p-5 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Campo Nombre (del modelo) */}
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                {...register('nombre', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' } // Ejemplo validación extra
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.nombre ? "true" : "false"}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Campo Fecha (del modelo) */}
            <div className="mb-4">
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date" // Input de tipo calendario
                id="fecha"
                {...register('fecha', {
                  required: 'La fecha es obligatoria',
                  valueAsDate: true, // Intenta convertir el valor a objeto Date
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.fecha ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.fecha ? "true" : "false"}
              />
              {errors.fecha && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.fecha.message}
                </p>
              )}
            </div>

            {/* Campo total_partidos no se incluye para edición manual */}

            {/* Pie del Modal */}
            <div className="flex justify-end items-center pt-4 mt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 text-sm font-medium"
              >
                {isEditing ? 'Actualizar Fecha' : 'Crear Fecha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FechaModal;
