import { createContext, useState, useContext } from "react";
// Asumiendo que tienes un archivo api.js configurado con axios, como en los otros contextos
import {
  getFechasRequest,
  createFechaRequest,
  deleteFechaRequest,
  getFechaRequest,
  updateFechaRequest,
} from "../api/fechas"; // Necesitarás crear este archivo api/Fechas.js

const FechaContext = createContext();

export const useFechas = () => {
  const context = useContext(FechaContext);
  if (!context) {
    throw new Error("useFechas must be used within an FechasProvider");
  }
  return context;
};

export function FechasProvider({ children }) {
  const [fechas, setFechas] = useState([]);
  const [errors, setErrors] = useState([]); // Para manejar errores de API

  const getFechas = async () => {
    try {
      const res = await getFechasRequest();
      setFechas(res.data);
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error fetching Fechas"]);
    }
  };

  const createFecha = async (Fecha) => {
    try {
      const res = await createFechaRequest(Fecha);
      console.log("Fecha creado con éxito, llamando a getFechas..."); // <-- LOG
      getFechas();
      return res.data;
    } catch (error) {
      console.error("Error en createFecha (Context):", error); // <-- LOG
      setErrors(error.response?.data?.message || ["Error creating Fecha"]);
      throw error;
    }
  };

  // En FechasContext.jsx
const deleteFecha = async (id) => {
  console.log("Intentando borrar Fecha con ID (Context):", id); // <-- LOG
  try {
    const res = await deleteFechaRequest(id);
    console.log("Respuesta de deleteFechaRequest:", res.status); // <-- LOG
    if (res.status === 204 || res.status === 200) {
      console.log("Borrando Fecha del estado local..."); // <-- LOG
      setFechas(prevFechas => { // Es mejor usar la forma funcional de setState
          const nuevosFechas = prevFechas.filter((Fecha) => Fecha._id !== id);
          console.log("Nuevo estado de Fechas:", nuevosFechas); // <-- LOG
          return nuevosFechas;
      });
    } else {
       console.warn("Delete request no devolvió 204 o 200:", res.status); // <-- LOG
    }
  } catch (error) {
    console.error("Error en deleteFecha (Context):", error); // <-- LOG
    setErrors(error.response?.data?.message || ["Error deleting Fecha"]);
  }
};


  const getFecha = async (id) => {
    try {
      const res = await getFechaRequest(id);
      return res.data; // Devuelve el Fecha encontrado
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || ["Error fetching Fecha"]);
    }
  };

  const updateFecha = async (id, Fecha) => {
    try {
      const res = await updateFechaRequest(id, Fecha);
      console.log("Fecha actualizado con éxito, llamando a getFechas..."); // <-- LOG
      getFechas();
      return res.data;
    } catch (error) {
      console.error("Error en updateFecha (Context):", error); // <-- LOG
      setErrors(error.response?.data?.message || ["Error updating Fecha"]);
      throw error;
    }
  };


  return (
    <FechaContext.Provider
      value={{
        fechas,
        getFechas,
        createFecha,
        deleteFecha,
        getFecha,
        updateFecha,
        errors, // Exponer errores si quieres mostrarlos en la UI
      }}
    >
      {children}
    </FechaContext.Provider>
  );
}
