// src/context/AlertContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// Importaremos las funciones API específicas para el admin (aún por crear)
import { getAlertRequest, updateAlertRequest } from '../api/alert.js'; // Ajusta la ruta si es necesario

// 1. Crear el Contexto
export const AlertContext = createContext();

// 2. Crear el Hook personalizado para usar el contexto
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de un AlertProvider");
  }
  return context;
};

// 3. Crear el Componente Provider
export const AlertProvider = ({ children }) => {
  // Estado para almacenar la información de la alerta
  const [alertData, setAlertData] = useState(null); // Empezamos con null hasta cargar
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true); // Empezamos cargando
  // Estado para almacenar errores
  const [error, setError] = useState(null);
  // Estado opcional para mensajes de éxito breves
  const [successMessage, setSuccessMessage] = useState('');

  // Función para obtener el estado actual de la alerta desde el backend
  const getAlertStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAlertRequest(); // Llama a la API del admin
      // Si la API devuelve datos, los usamos. Si no (o devuelve null/undefined),
      // establecemos un estado inactivo por defecto.
      setAlertData(res.data || { isActive: false, message: '', type: 'info' });
    } catch (err) {
      console.error("Error al obtener estado de alerta:", err.response?.data?.message || err.message);
      setError("No se pudo cargar la configuración de la alerta.");
      setAlertData({ isActive: false, message: '', type: 'info' }); // Estado seguro en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de la alerta en el backend
  const updateAlertStatus = async (newAlertData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(''); // Limpiar mensaje de éxito anterior
    try {
      // Llama a la API del admin para actualizar/crear la alerta
      const res = await updateAlertRequest(newAlertData);
      // Actualizamos el estado local con los datos guardados (o la respuesta del backend)
      setAlertData(res.data); // Asumimos que el backend devuelve el estado actualizado
      setSuccessMessage('¡Configuración de alerta guardada con éxito!');
      // Limpiar mensaje de éxito después de unos segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error al actualizar estado de alerta:", err.response?.data?.message || err.message);
      setError("Error al guardar la configuración de la alerta. Intenta de nuevo.");
      // Opcional: podrías intentar recargar el estado anterior si falla la actualización
      // getAlertStatus();
    } finally {
      setLoading(false);
    }
  };

  // Cargar el estado inicial de la alerta cuando el provider se monta
  useEffect(() => {
    getAlertStatus();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // 4. Proveer el estado y las funciones a los componentes hijos
  return (
    <AlertContext.Provider
      value={{
        alertData,
        loading,
        error,
        successMessage,
        getAlertStatus, // Función para recargar si es necesario
        updateAlertStatus, // Función para guardar cambios
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
