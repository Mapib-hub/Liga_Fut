// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\pages\admin\FechasPage.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useFechas } from '../../context/FechaContext';
import FechaModal from '../../components/FechaModal';
import FormatDate from '../../components/FormatDate'; // <--- IMPORTA el nuevo componente

function FechasPage() {
  const { fechas, getFechas, deleteFecha, createFecha, updateFecha } = useFechas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fechaToEdit, setFechaToEdit] = useState(null);

  useEffect(() => {
    getFechas();
  }, []);

  // --- ELIMINA la función formatSpanishDate de aquí ---
  // const formatSpanishDate = (dateString) => { ... };

  const handleDelete = (id) => {
    Swal.fire({
     title: '¿Estás seguro?',
     text: "¡No podrás revertir esto!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6', // Puedes quitar estos si usas customClass consistentemente
     cancelButtonColor: '#d33',    // Puedes quitar estos si usas customClass consistentemente
     confirmButtonText: 'Sí, ¡bórralo!',
     cancelButtonText: 'Cancelar',
     customClass: { // Estilos para el ALERTA DE CONFIRMACIÓN
       confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded', // Botón rojo
       cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-3' // Botón gris
     },
     buttonsStyling: false , // Necesario para que customClass funcione en botones
   }).then((result) => {
     if (result.isConfirmed) {
       deleteFecha(id); // Llama a la función para borrar

       // --- APLICA ESTILOS AL ALERTA DE ÉXITO ---
       Swal.fire({
         title: '¡Borrado!',
         text: 'La fecha ha sido eliminada.',
         icon: 'success',
         confirmButtonText: 'Ok', // O 'Aceptar'
         customClass: {
           confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded' // Botón verde
           // Puedes añadir clases para title, text, etc. si quieres
           // title: 'text-green-700',
         },
         buttonsStyling: false // Necesario para que customClass funcione en botones
       });
       // --- FIN ESTILOS ALERTA DE ÉXITO ---

     }
   });
 };


  const handleCreate = () => {
    // ... (código sin cambios)
     setFechaToEdit(null); // Asegura que no hay datos de edición
    setIsModalOpen(true);
  };

  const handleEdit = (fecha) => {
    // ... (código sin cambios)
     setFechaToEdit(fecha); // Guarda la fecha a editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // ... (código sin cambios)
     setIsModalOpen(false);
    setFechaToEdit(null); // Limpia la fecha en edición al cerrar
  };

  const handleSaveFecha = async (data) => {
    // ... (código sin cambios)
     try {
      if (fechaToEdit) {
        // Estamos editando
        await updateFecha(fechaToEdit._id, data); // Llama a updateFecha del contexto
        Swal.fire({
            title: '¡Actualizado!',
            text: 'La fecha ha sido actualizada.',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded' // Botón verde
            },
            buttonsStyling: false
          });
      } else {
        // Estamos creando
        await createFecha(data); // Llama a createFecha del contexto
        Swal.fire({
            title: '¡Creado!',
            text: 'La nueva fecha ha sido creada.',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded' // Botón verde
            },
            buttonsStyling: false
          });
      }
      handleCloseModal(); // Cierra el modal después de guardar exitosamente
      // getFechas(); // Opcional: Volver a cargar las fechas si el contexto no lo hace automáticamente
    } catch (error) {
      console.error("Error al guardar la fecha:", error);
      // Mostrar un mensaje de error más específico si es posible
      const errorMessage = error?.response?.data?.message || error.message || 'Ocurrió un error al guardar.';
      Swal.fire('Error', errorMessage, 'error');
      // No cerramos el modal si hay error, para que el usuario pueda corregir
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administrar Fechas</h1>
      <button
        onClick={handleCreate}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
        Crear Nueva Fecha
      </button>
        </div>
      

      <FechaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFecha}
        fechaActual={fechaToEdit}
      />

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fechas && fechas.length > 0 ? (
              fechas.map((fecha) => (
                <tr key={fecha._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{fecha.nombre || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {/* USA EL COMPONENTE AQUÍ */}
                    <FormatDate date={fecha.fecha} />
                    {/* Puedes pasar un fallback diferente si quieres: */}
                    {/* <FormatDate date={fecha.fecha} fallback="Fecha no disponible" /> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(fecha)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(fecha._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500 italic">
                  No hay fechas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FechasPage;
