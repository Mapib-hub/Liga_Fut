
import React, { useEffect, useState } from 'react';

import { useEquipos } from '../../context/EquiposContext';
import EquipoModal from '../../components/EquipoModal'; // Ajusta la ruta si es necesario
import { BACKEND_ORIGIN } from '../../config'; // <--- IMPORTA AQUÍ


function EquiposPage() {
  const { equipos, getEquipos, deleteEquipo, createEquipo, updateEquipo } = useEquipos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipoParaEditar, setEquipoParaEditar] = useState(null);

  useEffect(() => {
    getEquipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Funciones de manejo (sin cambios) ---
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      deleteEquipo(id);
    }
  };

  const handleOpenModalParaCrear = () => {
    setEquipoParaEditar(null);
    setIsModalOpen(true);
  };

  const handleOpenModalParaEditar = (equipo) => {
    setEquipoParaEditar(equipo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEquipoParaEditar(null);
  };

  const handleSaveEquipo = async (formData, equipoId) => {
    try {
      // IMPORTANTE: Si el formulario ahora incluye un campo de archivo para la imagen,
      // necesitarás manejarlo de forma diferente (FormData) tanto aquí como en el contexto/API.
      // Por ahora, asumimos que la imagen se maneja por separado o ya está en formData.
      if (equipoId) {
        await updateEquipo(equipoId, formData);
        console.log('Equipo actualizado con éxito');
      } else {
        await createEquipo(formData);
        console.log('Equipo creado con éxito');
      }
      handleCloseModal();
      // Podrías llamar a getEquipos() aquí si el contexto no actualiza automáticamente la lista
      // getEquipos();
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
    }
  };
  // --- Fin Funciones de manejo ---

  return (
    <div className="container mx-auto px-4 py-6">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Equipos</h1>
        <button
          onClick={handleOpenModalParaCrear}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Añadir Equipo
        </button>
      </div>

       {equipos.length === 0 && (
         <div className="bg-white p-4 rounded shadow text-center text-gray-500">
           No hay equipos registrados todavía.
         </div>
       )}

      {equipos.length > 0 && (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          {/* Ajusta los anchos si es necesario con la nueva columna */}
          <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* Ajusta los anchos (ej: w-1/4, w-1/6, w-1/3, w-1/4) */}
                <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                {/* Nueva columna para la imagen */}
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escudo</th>
                {/* Asumiendo que ahora usas 'description' */}
                <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="w-1/4 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipos.map((equipo) => {

                return (
                  <tr className="equipo-fila hover:bg-gray-50 transition-colors duration-150" key={equipo._id}>
                    <td className="px-6 py-4 whitespace-normal break-words align-top"> {/* align-top puede ayudar */}
                      <div className="text-sm font-medium text-gray-900">{equipo.nombre}</div>
                    </td>
                    {/* Celda para la imagen */}
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                     <img
                                           src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
                                            alt={`Escudo de ${equipo.nombre}`}
                                            className="h-auto max-w-full rounded" 
                                          />
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words align-top">
                    <div className="text-sm text-gray-500">
                      {/* Verifica si existe descripción y si es más larga de 200 caracteres */}
                      {(equipo.description && equipo.description.length > 200)
                        // Si es larga, corta a 200 y añade '...'
                        ? `${equipo.description.substring(0, 200)}...`
                        // Si no es larga o no existe, muestra la descripción o el texto por defecto
                        : (equipo.description || 'Sin Descripción')
                      }
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                      <button
                        onClick={() => handleOpenModalParaEditar(equipo)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(equipo._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

       <EquipoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEquipo}
        equipoToEdit={equipoParaEditar}
      />
    </div>
  );
}

export default EquiposPage;
