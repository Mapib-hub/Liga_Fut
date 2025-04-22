// src/components/ModalNoticia.jsx
import React, { useState, useEffect } from 'react';
import { useNotis } from '../context/NotisContext';
import Swal from 'sweetalert2';
// Asegúrate de importar BACKEND_ORIGIN o definir la URL base
import { BACKEND_ORIGIN } from "../config";

function ModalNoticia({ isOpen, onClose, noticiaActual }) {
  const { createNoti, updateNoti } = useNotis();

  // Estado usando los nombres del MODELO backend (tittle, description)
  const [formData, setFormData] = useState({
    tittle: '',      // <--- CORREGIDO
    description: '', // <--- CORREGIDO
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (noticiaActual) {
        // Leer usando los nombres del MODELO backend (tittle, description, foto_noti)
        setFormData({
          tittle: noticiaActual.tittle || '',        // <--- CORREGIDO
          description: noticiaActual.description || '', // <--- CORREGIDO
        });
        // Usar 'foto_noti' para la imagen actual, según el modelo
        if (noticiaActual.foto_noti) {               // <--- CORREGIDO
          setCurrentImageUrl(`${BACKEND_ORIGIN}/uploads/noticias/${noticiaActual.foto_noti}`); // <--- CORREGIDO
        } else {
          setCurrentImageUrl(null);
        }
        setImageFile(null);
        setPreviewUrl(null);
      } else {
        // Resetear usando los nombres del MODELO backend
        setFormData({ tittle: '', description: '' }); // <--- CORREGIDO
        setImageFile(null);
        setPreviewUrl(null);
        setCurrentImageUrl(null);
      }
    }
  }, [isOpen, noticiaActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setCurrentImageUrl(null);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      // Usar 'foto_noti' al restaurar la imagen actual
      if (noticiaActual?.foto_noti) {                 // <--- CORREGIDO
         setCurrentImageUrl(`${BACKEND_ORIGIN}/uploads/noticias/${noticiaActual.foto_noti}`); // <--- CORREGIDO
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    dataToSubmit.append('tittle', formData.tittle);
    dataToSubmit.append('description', formData.description);

    if (imageFile) {
      // CORRECCIÓN AQUÍ: Usa 'foto_noti' para que coincida con upload.single()
      dataToSubmit.append('foto_noti', imageFile);
    }

    try {
      if (noticiaActual) {
        await updateNoti(noticiaActual._id, dataToSubmit);
        Swal.fire('¡Actualizado!', 'La noticia ha sido actualizada.', 'success');
      } else {
        // Para crear, también debe coincidir con upload.single('foto_noti')
        await createNoti(dataToSubmit);
        Swal.fire('¡Creado!', 'La noticia ha sido creada.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      Swal.fire('Error', 'Hubo un problema al guardar la noticia.', 'error');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          {/* Cabecera */}
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="text-xl font-medium text-gray-900">
              {noticiaActual ? 'Editar Noticia' : 'Crear Nueva Noticia'}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Cuerpo del Formulario */}
          <div className="modal-body pt-4 space-y-4">
            <div>
              {/* La etiqueta puede seguir en español para el usuario */}
              <label htmlFor="tittle" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                id="tittle" // <-- CORREGIDO
                name="tittle" // <-- CORREGIDO
                value={formData.tittle} // <-- CORREGIDO
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              {/* La etiqueta puede seguir en español para el usuario */}
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="description" // <-- CORREGIDO
                name="description" // <-- CORREGIDO
                rows="4"
                value={formData.description} // <-- CORREGIDO
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <input
                type="file"
                id="imagen"
                name="imagen" // Este 'name' es para el input, no afecta el estado directamente
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {noticiaActual ? 'Sube una nueva imagen para reemplazar la actual.' : 'Sube una imagen para la noticia.'}
              </p>
            </div>

            {/* Previsualización de imagen (usa currentImageUrl que ya lee foto_noti) */}
            {(previewUrl || currentImageUrl) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {previewUrl ? 'Nueva Imagen:' : 'Imagen Actual:'}
                </p>
                <img
                  src={previewUrl || currentImageUrl}
                  alt="Previsualización"
                  className="max-h-40 w-auto rounded border"
                />
              </div>
            )}
          </div>

          {/* Pie (Botones) */}
          <div className="modal-footer flex justify-end pt-4 border-t mt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-200"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              {noticiaActual ? 'Guardar Cambios' : 'Crear Noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNoticia;
