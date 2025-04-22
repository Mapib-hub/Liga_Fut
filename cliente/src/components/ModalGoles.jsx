// src/components/ModalGoles.jsx

import React, { useEffect, useState } from "react";
import { useCalen } from "../context/CalendarioContext.jsx";
import Swal from "sweetalert2";

// Recibe id, isOpen y onClose como props desde CalendarioPage
function ModalGoles({ id, isOpen, onClose }) {
  const { getPartido, editarGoles } = useCalen(); // Usamos getPartido y editarGoles

  // Estado para almacenar los datos completos del partido (incluyendo equipos)
  const [partidoData, setPartidoData] = useState(null);
  // Estado para los inputs del formulario (solo los goles)
  const [formData, setFormData] = useState({
    marcador_local: "",
    marcador_visitante: "",
  });
  // Estado para indicar si se están cargando los datos
  const [isLoading, setIsLoading] = useState(false);
  // Estado para manejar errores de carga
  const [error, setError] = useState(null);

  // useEffect para cargar los datos del partido cuando el modal se abre y tiene un ID
  useEffect(() => {
    const fetchPartidoData = async () => {
      if (isOpen && id) {
        setIsLoading(true);
        setError(null);
        try {
          const res = await getPartido(id);
          setPartidoData(res);
          // Inicializa el formData con los goles existentes o 0 si no existen
          setFormData({
            marcador_local: res.marcador_local !== undefined && res.marcador_local !== null ? String(res.marcador_local) : "0",
            marcador_visitante: res.marcador_visitante !== undefined && res.marcador_visitante !== null ? String(res.marcador_visitante) : "0",
          });
        } catch (err) {
          console.error("Error fetching partido data:", err);
          setError("No se pudieron cargar los datos del partido.");
          // Opcional: Mostrar un Swal de error y cerrar
          // Swal.fire("Error", "No se pudieron cargar los datos del partido.", "error");
          // onClose();
        } finally {
          setIsLoading(false);
        }
      } else {
        // Resetea los estados si el modal se cierra o no hay ID
        setPartidoData(null);
        setFormData({ marcador_local: "", marcador_visitante: "" });
        setError(null);
        setIsLoading(false);
      }
    };

    fetchPartidoData();
    // Dependencias: se ejecuta si cambia el id, el estado isOpen o la función getPartido
  }, [id, isOpen, getPartido]);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Permite solo números enteros no negativos
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Manejador del envío del formulario
  const handleSubmit = async () => {
    // Validación simple: asegurarse de que no estén vacíos (ya que usamos type="number", serán numéricos o string vacío)
    if (formData.marcador_local === "" || formData.marcador_visitante === "") {
      Swal.fire("Error", "Debes ingresar ambos marcadores.", "warning");
      return;
    }

    // Prepara los datos a enviar (solo los marcadores como números)
    const golesData = {
      marcador_local: Number(formData.marcador_local),
      marcador_visitante: Number(formData.marcador_visitante),
    };

    try {
      // Llama a la función del contexto para actualizar los goles
      await editarGoles(id, golesData);
      Swal.fire({
        title: "¡Actualizado!",
        text: "Los goles han sido actualizados correctamente.",
        icon: "success",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton:
            "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
        },
        buttonsStyling: false,
      });
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error updating goles:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al actualizar los goles.",
        "error"
      );
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // --- Renderizado del Modal ---
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" tabIndex="-1" role="dialog">
      <div className="relative p-5 border w-auto max-w-md shadow-lg rounded-md bg-white" role="document">
        <div className="modal-content">
          {/* Cabecera del Modal */}
          <div className="modal-header flex justify-between items-center pb-3 border-b">
            <h5 className="text-xl font-medium text-gray-900">Actualizar Goles</h5>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cuerpo del Modal */}
          <div className="modal-body pt-4">
            {isLoading && <p className="text-center text-gray-500">Cargando datos del partido...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Mostrar formulario solo si no está cargando y no hay error */}
            {!isLoading && !error && partidoData && (
              <form onSubmit={(e) => e.preventDefault()}> {/* Evita recarga de página */}
                <div className="grid grid-cols-2 gap-4 items-center mb-4">
                  {/* Columna Equipo Local */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={`http://localhost:4000/uploads/equipos/${partidoData.equipo_local?.foto_equipo}`}
                      alt={partidoData.equipo_local?.nombre}
                      className="h-16 w-16 object-contain mb-2" // Ajusta tamaño según necesites
                      onError={(e) => e.target.src = '/path/to/default/image.png'} // Imagen por defecto si falla la carga
                    />
                    <label htmlFor="marcador_local" className="block text-sm font-medium text-gray-700 mb-1">
                      {partidoData.equipo_local?.nombre || "Equipo Local"}
                    </label>
                    <input
                      type="number"
                      id="marcador_local"
                      name="marcador_local"
                      value={formData.marcador_local}
                      onChange={handleChange}
                      min="0"
                      className="form-input shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center" // Input centrado y más pequeño
                      required
                    />
                  </div>

                  {/* Columna Equipo Visitante */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={`http://localhost:4000/uploads/equipos/${partidoData.equipo_visitante?.foto_equipo}`}
                      alt={partidoData.equipo_visitante?.nombre}
                      className="h-16 w-16 object-contain mb-2"
                      onError={(e) => e.target.src = '/path/to/default/image.png'}
                    />
                    <label htmlFor="marcador_visitante" className="block text-sm font-medium text-gray-700 mb-1">
                      {partidoData.equipo_visitante?.nombre || "Equipo Visitante"}
                    </label>
                    <input
                      type="number"
                      id="marcador_visitante"
                      name="marcador_visitante"
                      value={formData.marcador_visitante}
                      onChange={handleChange}
                      min="0"
                      className="form-input shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                      required
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Pie del Modal */}
          <div className="modal-footer flex justify-end pt-4 border-t">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-200"
              onClick={onClose}
            >
              Cancelar
            </button>
            {/* Habilitar guardar solo si no está cargando y no hay error */}
            <button
              type="button"
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${isLoading || error ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading || !!error} // Deshabilitar si está cargando o hay error
            >
              Guardar Goles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalGoles;
