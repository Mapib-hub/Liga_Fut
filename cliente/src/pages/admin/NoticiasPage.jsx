// src/pages/admin/NoticiasPage.jsx
import React, { useEffect, useState } from "react";
import { useNotis } from "../../context/NotisContext.jsx";
import ModalNoticia from "../../components/ModalNoticia.jsx";
import Swal from "sweetalert2";
import { BACKEND_ORIGIN } from "../../config"; // Asegúrate que esta ruta es correcta

function NoticiasPage() {
  const { getNotis, notis, deleteNoti } = useNotis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticiaToEdit, setNoticiaToEdit] = useState(null);

  useEffect(() => {
    getNotis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setNoticiaToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (noticia) => {
    setNoticiaToEdit(noticia);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoticiaToEdit(null);
    getNotis();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡bórrala!",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-3'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNoti(id)
          .then(() => {
            Swal.fire({
              title: '¡Borrado!',
              text: 'La noticia ha sido eliminada.',
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: { confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded' },
              buttonsStyling: false
            });
          })
          .catch(error => {
            console.error("Error al eliminar noticia:", error);
            Swal.fire('Error', 'Hubo un problema al eliminar la noticia.', 'error');
          });
      }
    });
  };

  // --- Función renderImagenNoticia ELIMINADA ;console.log(notis) ---
  
  return (
    // Contenedor principal (clase seleccionada por el usuario)
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado y Botón Crear */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Administrar Noticias
        </h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Nueva Noticia
        </button>
      </div>

      {/* Tabla de Noticias */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Imagen</th>
              <th scope="col" className="px-6 py-3">Titulo</th>
              <th scope="col" className="px-6 py-3">description</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notis && notis.length > 0 ? (
              notis.map((noti) => (
                <tr key={noti._id} className="bg-white border-b hover:bg-gray-50">
                  {/* --- Celda de Imagen Simplificada --- */}
                  <td className="px-6 py-4">
                    {noti.foto_noti ? ( // Comprueba si hay nombre de imagen
                      <img
                        // Usa BACKEND_ORIGIN o la URL base directamente
                        src={`${BACKEND_ORIGIN}/uploads/noticias/${noti.foto_noti}`}
                        alt={`Imagen de ${noti.titulo}`} // Alt text descriptivo
                        className="h-12 w-16 object-cover rounded" // Clases de estilo
                      />
                    ) : (
                      <span className="text-gray-400 italic">Sin imagen</span> // Mensaje si no hay imagen
                    )}
                  </td>
                  {/* --- Fin Celda de Imagen Simplificada --- */}

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {noti.tittle}
                  </td>
                  <td className="px-6 py-4">
                    {noti.description.length > 100 ? `${noti.description.substring(0, 100)}...` : noti.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(noti)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition duration-200"
                      title="Editar noticia"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(noti._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition duration-200"
                      title="Eliminar noticia"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                  No hay noticias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Renderizar el Modal */}
      <ModalNoticia
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        noticiaActual={noticiaToEdit}
      />
    </div>
  );
}

export default NoticiasPage;
