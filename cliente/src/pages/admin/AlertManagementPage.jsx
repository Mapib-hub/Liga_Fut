// src/pages/admin/AlertManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext'; // Importa el hook del contexto

function AlertManagementPage() {
  // 1. Obtener datos y funciones del contexto
  const {
    alertData,
    loading,
    error,
    successMessage,
    updateAlertStatus,
    getAlertStatus, // Podríamos usarlo para recargar si es necesario
  } = useAlert();

  // 2. Estado local para manejar el formulario
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  // 3. Efecto para inicializar/actualizar el estado local cuando alertData cambie
  useEffect(() => {
    if (alertData) {
      setIsActive(alertData.isActive);
      setMessage(alertData.message || ''); // Asegura que sea string
      setType(alertData.type || 'info');   // Asegura que tenga un valor
    } else {
      // Si alertData es null (estado inicial antes de cargar), reseteamos
      setIsActive(false);
      setMessage('');
      setType('info');
    }
  }, [alertData]); // Se ejecuta cada vez que alertData del contexto cambia

  // 4. Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Llama a la función del contexto para guardar los cambios
    updateAlertStatus({
      isActive,
      message,
      type,
    });
  };

  // 5. Renderizado del componente
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestionar Alerta del Sitio</h1>

      {/* Indicador de Carga */}
      {loading && !alertData && ( // Mostrar solo en la carga inicial
        <div className="text-center p-4 bg-blue-100 text-blue-700 rounded-md">
          Cargando configuración de alerta...
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Mensaje de Éxito */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
          {successMessage}
        </div>
      )}

      {/* Formulario (solo se muestra si no hay error y tenemos datos o estamos listos para crear) */}
      {!error && alertData && ( // Aseguramos tener datos antes de mostrar el form
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">

          {/* Campo Activar/Desactivar */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700">
              Activar Alerta en el Sitio Público
            </label>
          </div>

          {/* Campo Mensaje (solo visible si está activa) */}
          {isActive && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de la Alerta
              </label>
              <textarea
                id="message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Ej: Partidos suspendidos por lluvia este fin de semana."
                required // Hacer obligatorio si la alerta está activa
              ></textarea>
            </div>
          )}

          {/* Campo Tipo (solo visible si está activa) */}
          {isActive && (
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Alerta (Color)
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
              >
                <option value="info">Información (Azul)</option>
                <option value="warning">Advertencia (Amarillo)</option>
                <option value="error">Error (Rojo)</option>
              </select>
            </div>
          )}

          {/* Botón Guardar */}
          <div>
            <button
              type="submit"
              disabled={loading} // Deshabilitar mientras se guarda
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                         ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}

export default AlertManagementPage;
