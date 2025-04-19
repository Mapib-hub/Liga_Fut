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
      console.log("Equipo creado con éxito, llamando a getEquipos..."); // <-- LOG
      getEquipos();
      return res.data;
    } catch (error) {
      console.error("Error en createEquipo (Context):", error); // <-- LOG
      setErrors(error.response?.data?.message || ["Error creating equipo"]);
      throw error;
    }
  };

  // En EquiposContext.jsx
const deleteEquipo = async (id) => {
  console.log("Intentando borrar equipo con ID (Context):", id); // <-- LOG
  try {
    const res = await deleteEquipoRequest(id);
    console.log("Respuesta de deleteEquipoRequest:", res.status); // <-- LOG
    if (res.status === 204 || res.status === 200) {
      console.log("Borrando equipo del estado local..."); // <-- LOG
      setEquipos(prevEquipos => { // Es mejor usar la forma funcional de setState
          const nuevosEquipos = prevEquipos.filter((equipo) => equipo._id !== id);
          console.log("Nuevo estado de equipos:", nuevosEquipos); // <-- LOG
          return nuevosEquipos;
      });
    } else {
       console.warn("Delete request no devolvió 204 o 200:", res.status); // <-- LOG
    }
  } catch (error) {
    console.error("Error en deleteEquipo (Context):", error); // <-- LOG
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
      console.log("Equipo actualizado con éxito, llamando a getEquipos..."); // <-- LOG
      getEquipos();
      return res.data;
    } catch (error) {
      console.error("Error en updateEquipo (Context):", error); // <-- LOG
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
