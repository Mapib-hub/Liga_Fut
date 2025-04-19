// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\pages\admin\EquiposPage.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useEquipos } from '../../context/EquiposContext';
import EquipoModal from '../../components/EquipoModal';
import { BACKEND_ORIGIN } from '../../config';

function EquiposPage() {
  const { equipos, getEquipos, deleteEquipo, createEquipo, updateEquipo } = useEquipos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipoParaEditar, setEquipoParaEditar] = useState(null);

  useEffect(() => {
    getEquipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOpenModalParaCrear = () => {
    setEquipoParaEditar(null); // Asegura que el modal esté en modo "crear"
    setIsModalOpen(true);
  };

  const handleOpenModalParaEditar = (equipo) => {
    setEquipoParaEditar(equipo); // Pasa los datos del equipo a editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEquipoParaEditar(null); // Limpia el estado de edición al cerrar
  };

  const handleDelete = async (id) => {
    console.log(id);
    Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded', // Estilo para el botón de confirmar (rojo peligro)
        cancelButton: 'bg-blue-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-3' // Estilo para el botón de cancelar (gris) y un margen izquierdo
      },
      buttonsStyling: false // <--- IMPORTANTE: Desactiva los estilos por defecto de Swal para que las clases tomen control total
      // --- FIN DE LO AÑADIDO ---

    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEquipo(id);
          Swal.fire(
            '¡Eliminado!',
            'El equipo ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar equipo:", error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el equipo.',
            'error'
          );
        }
      }
    });
  };

  const handleSaveEquipo = async (equipoData) => {
    try {
      if (equipoParaEditar) {
        // Modo Editar
        await updateEquipo(equipoParaEditar._id, equipoData);
        // Opcional: mostrar notificación de éxito
      } else {
        // Modo Crear
        await createEquipo(equipoData);
        // Opcional: mostrar notificación de éxito
      }
      handleCloseModal(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      // Opcional: mostrar notificación de error (quizás dentro del modal)
    }
  };

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

      {/* --- USANDO OPERADOR TERNARIO Y Array.isArray --- */}
      { !Array.isArray(equipos) || equipos.length === 0 ? (
        // --- Caso: No es array o está vacío ---
        <div className="bg-white p-4 rounded shadow text-center text-gray-500">
          No hay equipos registrados todavía.
          {/* Podrías añadir aquí un indicador de carga si tuvieras ese estado */}
        </div>
      ) : (
        // --- Caso: Es un array y tiene elementos ---
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escudo</th>
                <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="w-1/4 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Ahora el .map es más seguro porque ya comprobamos Array.isArray arriba */}
              {equipos.map((equipo) => (
                 <tr className="equipo-fila hover:bg-gray-50 transition-colors duration-150" key={equipo._id}>
                   {/* ... celdas td como las tenías ... */}
                   <td className="px-6 py-4 whitespace-normal break-words align-top">
                     <div className="text-sm font-medium text-gray-900">{equipo.nombre}</div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap align-top">
                    <img
                       src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
                       alt={`Escudo de ${equipo.nombre}`}
                       className="object-contain rounded" // Ajusta tamaño si es necesario
                     />
                   </td>
                   <td className="px-6 py-4 whitespace-normal break-words align-top">
                     <div className="text-sm text-gray-500">
                       {(equipo.description && equipo.description.length > 200)
                         ? `${equipo.description.substring(0, 200)}...`
                         : (equipo.description || 'Sin Descripción')
                       }
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                     <button onClick={() => handleOpenModalParaEditar(equipo)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                     <button onClick={() => handleDelete(equipo._id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* --- FIN DEL TERNARIO --- */}

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
