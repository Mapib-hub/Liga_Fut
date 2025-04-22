import React, { useEffect, useState } from "react";
import { useEquipos } from "../context/EquiposContext.jsx";
import { useFechas } from "../context/FechaContext.jsx";
import { useCalen } from "../context/CalendarioContext.jsx";
import Swal from "sweetalert2";

function ModalPartido({ id, isOpen, onClose, partidoActual }) {
  const { getPartido, crearPartido, editarPartido } = useCalen();
  const { getEquipos, equipos = [] } = useEquipos();
  const { getFechas, fechas = [] } = useFechas();

  useEffect(() => {
    if (isOpen) {
      getFechas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      getEquipos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Estado inicial SIN lugar y estado
  const [formData, setFormData] = useState({
    equipo_local: "",
    equipo_visitante: "",
    fecha: "",
    // lugar: "", // Eliminado
    // estado: "Pendiente", // Eliminado
  });

  useEffect(() => {
    if (isOpen) {
      if (partidoActual) {
        // Actualiza formData SIN lugar y estado
        setFormData({
          equipo_local: partidoActual.equipo_local?._id || "",
          equipo_visitante: partidoActual.equipo_visitante?._id || "",
          fecha: partidoActual.fecha?._id || "",
          // lugar: partidoActual.lugar || "", // Eliminado
          // estado: partidoActual.estado || "Pendiente", // Eliminado
        });
      } else {
        // Resetea SIN lugar y estado
        setFormData({
          equipo_local: "",
          equipo_visitante: "",
          fecha: "",
          // lugar: "", // Eliminado
          // estado: "Pendiente", // Eliminado
        });
      }
    }
  }, [partidoActual, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // El formData ya no incluye lugar ni estado, así que se enviará correctamente
    try {
      if (id) {
        await editarPartido(id, formData);
        Swal.fire({
          title: "¡Actualizado!",
          text: "El partido ha sido Actualizado.",
          icon: "success",
          confirmButtonText: "Ok",
          customClass: {
            confirmButton:
              "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
          },
          buttonsStyling: false,
        });
      } else {
        await crearPartido(formData);
        Swal.fire({
          title: "¡Creado!",
          text: "El partido ha sido creado.",
          icon: "success",
          confirmButtonText: "Ok",
          customClass: {
            confirmButton:
              "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
          },
          buttonsStyling: false,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Swal.fire("Error", `Hubo un problema al ${id ? 'Actualizar' : 'Crear'} el partido.`, "error");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" tabIndex="-1" role="dialog">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white" role="document">
        <div className="modal-content">
          <div className="modal-header flex justify-between items-center pb-3 border-b">
            <h5 className="text-xl font-medium text-gray-900">
              {partidoActual ? "Editar Partido" : "Crear Partido"}
            </h5>
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
          <div className="modal-body pt-4">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Equipo Local */}
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Equipo Local</label>
                <select
                  className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="equipo_local"
                  value={formData.equipo_local}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seleccione un equipo</option>
                  {equipos.map((equipo) => (
                    <option key={equipo._id} value={equipo._id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* Equipo Visitante */}
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Equipo Visitante</label>
                <select
                  className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="equipo_visitante"
                  value={formData.equipo_visitante}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seleccione un equipo</option>
                  {equipos.map((equipo) => (
                    <option key={equipo._id} value={equipo._id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* Fecha */}
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                <select
                  className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seleccione una Fecha</option>
                  {fechas.map((fech) => (
                    <option key={fech._id} value={fech._id}>
                      {fech.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo Estado ELIMINADO */}
              {/*
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                <select ... > ... </select>
              </div>
              */}

              {/* Campo Estadio ELIMINADO */}
              {/*
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estadio</label>
                <input ... />
              </div>
              */}
            </form>
          </div>
          <div className="modal-footer flex justify-end pt-4 border-t">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-200"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              onClick={handleSubmit}
            >
              {partidoActual ? "Guardar Cambios" : "Crear Partido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPartido;
