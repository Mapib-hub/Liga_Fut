// src/pages/admin/JugadoresPage.jsx
import React, { useEffect, useState } from 'react';
import { useJugador } from '../../context/JugadorContext';
// Cambia la importación para usar el nuevo ModalJuga
import ModalJuga from '../../components/ModalJuga.jsx';
import Swal from 'sweetalert2';
import { BACKEND_ORIGIN } from '../../config';
import FormatDate from '../../components/FormatDate';

function JugadoresPage() {
  const { juga, getJugadores, deleteJuga } = useJugador(); // Usa deleteJuga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jugadorToEdit, setJugadorToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getJugadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers Modal
  const handleCreate = () => {
    setJugadorToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (jugador) => {
    setJugadorToEdit(jugador);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setJugadorToEdit(null);
    getJugadores(); // Refrescar lista
  };

  // Handler Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-3'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Usa deleteJuga del contexto
        deleteJuga(id)
          .then(() => {
            Swal.fire({
              title: '¡Borrado!', text: 'El jugador ha sido eliminado.', icon: 'success',
              confirmButtonText: 'Ok',
              customClass: { confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded' },
              buttonsStyling: false
            });
            // getJugadores(); // Ya se llama en handleCloseModal si es necesario, o aquí si no cierra modal
          })
          .catch(error => {
            console.error("Error al eliminar jugador:", error);
            Swal.fire('Error', 'Hubo un problema al eliminar el jugador.', 'error');
          });
      }
    });
  };

  // Handler Búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar jugadores
  const filteredJugadores = (juga || []).filter(jugador =>
    (jugador.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (jugador.apellido?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Administrar Jugadores</h1>
        <button onClick={handleCreate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
          Crear Nuevo Jugador
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar jugador por nombre o apellido..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {/* Añadidas clases responsivas */}
              <th scope="col" className="px-6 py-3 elim400">Foto</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Apellido</th>
              <th scope="col" className="px-6 py-3">Equipo</th>
              <th scope="col" className="px-6 py-3 elim1000">Posición</th>
              <th scope="col" className="px-6 py-3 elim600">Nacimiento</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredJugadores && filteredJugadores.length > 0 ? (
              filteredJugadores.map((jugador) => (
                <tr key={jugador._id} className="bg-white border-b hover:bg-gray-50">
                  {/* Añadidas clases responsivas */}
                  <td className="px-6 py-4 elim400">
                    {jugador.foto_jug ? (
                      <img
                        src={`${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug}`}
                        alt={`${jugador.nombre} ${jugador.apellido}`}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">Sin Foto</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{jugador.nombre}</td>
                  <td className="px-6 py-4">{jugador.apellido}</td>
                  <td className="px-6 py-4">{jugador.equip?.nombre || <span className="italic text-gray-500">Sin equipo</span>}</td>
                  {/* Añadidas clases responsivas */}
                  <td className="px-6 py-4 elim1000">{jugador.posicion || 'N/A'}</td>
                  {/* Añadidas clases responsivas */}
                  <td className="px-6 py-4 elim600">
                    <FormatDate date={jugador.fecha_nac} fallback="N/A" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleEdit(jugador)} className="mr-2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition duration-200" title="Editar jugador">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(jugador._id)} className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition duration-200" title="Eliminar jugador">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500 italic">
                  {searchTerm ? 'No se encontraron jugadores con ese criterio.' : 'No hay jugadores registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Usa el nuevo ModalJuga */}
      <ModalJuga
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jugadorActual={jugadorToEdit}
      />
    </div>
  );
}

export default JugadoresPage;
