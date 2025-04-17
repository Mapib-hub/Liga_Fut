// src/context/EquiposContext.jsx
import { createContext, useState, useContext } from "react";
// Asumiendo que tienes un archivo api.js configurado con axios, como en los otros contextos
import {
  getEquiposRequest,
  createEquipoRequest,
  deleteEquipoRequest,
  getEquipoRequest,
  updateEquipoRequest,
} from "../api/equipos"; // Necesitarás crear este archivo api/equipos.js

const EquiposContext = createContext();

export const useEquipos = () => {
  const context = useContext(EquiposContext);
  if (!context) {
    throw new Error("useEquipos must be used within an EquiposProvider");
  }
  return context;
};

export function EquiposProvider({ children }) {
  const [equipos, setEquipos] = useState([]);
  const [errors, setErrors] = useState([]); // Para manejar errores de API

  const getEquipos = async () => {
    try {
      const res = await getEquiposRequest();
      setEquipos(res.data);
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error fetching equipos"]);
    }
  };

  const createEquipo = async (equipo) => {
    try {
      const res = await createEquipoRequest(equipo);
      // Podrías añadir el nuevo equipo al estado directamente o recargar la lista
      // setEquipos([...equipos, res.data]);
      getEquipos(); // Recargar la lista es más simple por ahora
      return res.data; // Devuelve el equipo creado por si es útil
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error creating equipo"]);
      // Propagar el error para que el formulario sepa que falló
      throw error;
    }
  };

  const deleteEquipo = async (id) => {
    try {
      const res = await deleteEquipoRequest(id);
      if (res.status === 204 || res.status === 200) { // 204 No Content es común para DELETE exitoso
        setEquipos(equipos.filter((equipo) => equipo._id !== id));
      }
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error deleting equipo"]);
    }
  };

  const getEquipo = async (id) => {
    try {
      const res = await getEquipoRequest(id);
      return res.data; // Devuelve el equipo encontrado
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error fetching equipo"]);
    }
  };

  const updateEquipo = async (id, equipo) => {
    try {
      const res = await updateEquipoRequest(id, equipo);
      // Actualizar el estado local o recargar
      getEquipos(); // Recargar es más simple
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error updating equipo"]);
      throw error;
    }
  };

  // Limpiar errores después de un tiempo (opcional)
  /*
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);
  */

  return (
    <EquiposContext.Provider
      value={{
        equipos,
        getEquipos,
        createEquipo,
        deleteEquipo,
        getEquipo,
        updateEquipo,
        errors, // Exponer errores si quieres mostrarlos en la UI
      }}
    >
      {children}
    </EquiposContext.Provider>
  );
}
