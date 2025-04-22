// src/pages/admin/CalendarioPage.jsx

import React, { useEffect, useState } from "react";
import ModalPartido from "../../components/ModalPartido.jsx";
import Swal from "sweetalert2";
import { useCalen } from "../../context/CalendarioContext.jsx";
import ModalGoles from "../../components/ModalGoles.jsx";

function CalendarioPage() {
  const [load, setLoad] = useState(null);
  const [isModalPartidoOpen, setIsModalPartidoOpen] = useState(false);
  const [isModalGolesOpen, setIsModalGolesOpen] = useState(false);
  const [partidoToEdit, setPartidoToEdit] = useState(null);
  const { calendario, getCalendario, deletePartido } = useCalen();

  useEffect(() => {
    getCalendario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePartido = () => {
    setPartidoToEdit(null);
    setLoad(null);
    setIsModalPartidoOpen(true);
  };

  const handleEditPartido = (partido) => {
    setPartidoToEdit(partido);
    setLoad(partido._id);
    setIsModalPartidoOpen(true);
  };

  const handleCloseModalPartido = () => {
    setIsModalPartidoOpen(false);
    setPartidoToEdit(null);
    setLoad(null);
  };

  const handleOpenModalGoles = (partido) => {
    setLoad(partido._id);
    setIsModalGolesOpen(true);
  };

  const handleCloseModalGoles = () => {
    setIsModalGolesOpen(false);
    setLoad(null);
    getCalendario();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡bórralo!",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
        cancelButton:
          "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-3",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePartido(id)
          .then(() => {
            Swal.fire({
              title: "¡Borrado!",
              text: "El partido ha sido eliminado.",
              icon: "success",
              confirmButtonText: "Ok",
              customClass: {
                confirmButton:
                  "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
              },
              buttonsStyling: false,
            });
            getCalendario();
          })
          .catch(() => {
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el partido.",
              "error"
            );
          });
      }
    });
  };

  const renderInsignia = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return null;
    return (
        <img
            className="h-10 w-10 object-contain inline-block mr-2"
            src={`http://localhost:4000/uploads/equipos/${equipo.foto_equipo}`}
            alt={equipo.nombre}
            style={{ verticalAlign: 'middle' }}
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Administrar Calendario
        </h1>
        <button
          onClick={handleCreatePartido}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Nuevo Partido
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {/* MODIFICADO: Se quitó la columna Marcador */}
              <th scope="col" className="px-6 py-3">Equipo Local</th>
              <th scope="col" className="px-6 py-3">Equipo Visitante</th>
              <th scope="col" className="px-6 py-3 elim1000">Fecha</th>
              <th scope="col" className="px-6 py-3 elim600">Estadio</th>
              <th scope="col" className="px-6 py-3 elim400">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {calendario && calendario.length > 0 ? (
              calendario.map((partido) => (
                <tr
                  key={partido._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  {/* MODIFICADO: Equipo Local con su marcador */}
                  <td className="px-6 py-4">
                    {renderInsignia(partido.equipo_local)}
                    <span className="align-middle">{partido.equipo_local?.nombre || "N/A"}</span><br />
                    {/* Mostrar marcador local si existe */}
                    <span className="align-middle font-semibold ml-2">
                      {partido.marcador_local !== undefined && partido.marcador_local !== null
                        ? partido.marcador_local
                        : '-'}
                    </span>
                  </td>

                  {/* MODIFICADO: Equipo Visitante con su marcador */}
                  <td className="px-6 py-4">
                     {/* Mostrar marcador visitante si existe */}
                     {renderInsignia(partido.equipo_visitante)}
                     <span className="align-middle">{partido.equipo_visitante?.nombre || "N/A"}</span><br />
                     <span className="align-middle font-semibold mr-2">
                      {partido.marcador_visitante !== undefined && partido.marcador_visitante !== null
                        ? partido.marcador_visitante
                        : '-'}
                    </span>
                    
                    
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 elim1000">
                    {partido.fecha?.nombre || "N/A"}
                  </td>
                  {/* Estadio */}
                  <td className="px-6 py-4 elim600">{partido.lugar || "N/A"}</td>
                  {/* Estado */}
                  <td className="px-6 py-4 elim400">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partido.estado === 'Finalizado' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {partido.estado || "Pendiente"}
                    </span>
                  </td>
                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                  {partido.estado === "Pendiente" && (
                       <button
                          onClick={() => handleOpenModalGoles(partido)}
                          className="mr-2 px-3 py-1 bg-yellow-500  text-white text-xs font-medium rounded hover:bg-yellow-600 transition duration-200"
                          title="Editar marcador del partido"
                       >
                          Editar Goles
                       </button>
                    )}<br />
                    {partido.estado !== "Finalizado" && (
                      <button
                        onClick={() => handleEditPartido(partido)}
                        className="mr-2 px-3 py-1 bg-blue-500  text-white text-xs font-medium rounded hover:bg-blue-600 transition duration-200"
                        title="Editar datos del partido"
                      >
                        Editar Partido
                      </button>
                    )}<br />
                    
                    <button
                      onClick={() => handleDelete(partido._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition duration-200"
                      title="Eliminar partido"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                {/* MODIFICADO: Ajustado colSpan a 6 */}
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No hay partidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Renderizado de Modales */}
      <ModalPartido
        id={load}
        isOpen={isModalPartidoOpen}
        onClose={handleCloseModalPartido}
        partidoActual={partidoToEdit}
      />
      <ModalGoles
        id={load}
        isOpen={isModalGolesOpen}
        onClose={handleCloseModalGoles}
      />
    </div>
  );
}

export default CalendarioPage;
