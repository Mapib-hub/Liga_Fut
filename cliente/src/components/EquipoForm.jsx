import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEquipos } from '../context/EquiposContext'; 
import { BACKEND_ORIGIN } from '../config'; // <--- IMPORTA AQUÍ


function EquipoForm({ initialData, onSubmit: onSubmitProp, onCancel }) {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const { createEquipo, getEquipo, updateEquipo } = useEquipos(); // Funciones del contexto/API
  const navigate = useNavigate();
  const params = useParams(); // Para obtener el ID de la URL (:id)

  const [equipoData, setEquipoData] = useState(null); // Para guardar datos originales
  const [imagePreview, setImagePreview] = useState(null); // Vista previa nueva imagen
  const [currentImage, setCurrentImage] = useState(null); // Imagen actual del equipo
  const [selectedFile, setSelectedFile] = useState(null); // Archivo seleccionado

  // En EquipoForm.jsx
// En EquipoForm.jsx
useEffect(() => {
  if (initialData) {
    console.log("Datos iniciales recibidos:", initialData);
    setValue('nombre', initialData.nombre);
    setValue('description', initialData.description);
    setValue('estadio', initialData.estadio);
    if (initialData.fundado) {
      setValue('fundado', new Date(initialData.fundado).toISOString().split('T')[0]);
    }
    // CORRECTO: Limpiar la vista previa y el archivo seleccionado al cargar datos existentes
    setImagePreview(null);
    setSelectedFile(null);
  } else {
    console.log("Modo creación.");
    // CORRECTO: También limpiar aquí al entrar en modo creación
    setImagePreview(null);
    setSelectedFile(null);
    // Opcional: resetear campos del formulario si es necesario
    // reset({ nombre: '', description: '', estadio: '', fundado: ''});
  }
  // Asegúrate que las dependencias sean correctas. Si usas 'reset', añádelo.
}, [initialData, setValue]);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardar el archivo para el envío
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null); // Quitar vista previa si se deselecciona
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('description', data.description);
    formData.append('estadio', data.estadio);
    formData.append('fundado', data.fundado);

    if (selectedFile) {
      formData.append('foto_equipo', selectedFile);
    }

    // Llama a la función onSubmit que recibiste por props
    // Esta función (definida en EquipoModal o EquiposPage) se encargará
    // de llamar a createEquipo/updateEquipo y cerrar el modal.
    try {
      await onSubmitProp(formData); // Llama a la función del padre
      // No necesitas navegar aquí, el padre (modal/página) lo hará si es necesario
    } catch (error) {
      console.error("Error en el submit del formulario:", error);
      // Podrías mostrar un error específico del formulario si la prop onSubmit lanza uno
    }

  });

  return (

    <form onSubmit={onSubmit} encType="multipart/form-data"> {/* Necesario para archivos */}
      {/* Nombre */}
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo</label>
        <input
          type="text"
          id="nombre"
          {...register("nombre", { required: "El nombre es obligatorio" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nombre del Equipo"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          id="description"
          rows="3"
          {...register("description", { required: "La descripción es obligatoria" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Breve descripción del equipo"
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Estadio */}
      <div className="mb-4">
        <label htmlFor="estadio" className="block text-sm font-medium text-gray-700 mb-1">Estadio</label>
        <input
          type="text"
          id="estadio"
          {...register("estadio")} // Puede no ser obligatorio
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nombre del Estadio"
        />
        {/* No hay error obligatorio aquí, ajustar si es necesario */}
      </div>

      {/* Fundado */}
      <div className="mb-4">
        <label htmlFor="fundado" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fundación</label>
        <input
          type="date"
          id="fundado"
          {...register("fundado")} // Puede no ser obligatorio
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {/* No hay error obligatorio aquí, ajustar si es necesario */}
      </div>

      {/* Foto del Equipo */}
      <div className="mb-4">
        <label htmlFor="foto_equipo" className="block text-sm font-medium text-gray-700 mb-1">Escudo / Foto del Equipo</label>
        <div className="mt-1 flex items-center space-x-4">
          {/* Muestra la vista previa de la NUEVA imagen o la imagen ACTUAL */}
          <img
           src={
            imagePreview || // 1. Si hay una vista previa (data URL), úsala.
            (initialData?.foto_equipo // 2. Si no, ¿hay datos iniciales y tienen foto_equipo?
              ? `${BACKEND_ORIGIN}/uploads/equipos/${initialData.foto_equipo}` // 3. Sí -> Construye la URL completa del backend (¡OJO con la ruta!)
              : '/default-equipo.jpg') // 4. No -> Usa la imagen por defecto del frontend
          }
            alt="Vista previa"
            className="h-20 w-20 object-cover rounded-md bg-gray-100" // Ajusta tamaño/estilo
          />
          <input
            type="file"
            id="foto_equipo"
            accept="image/*" // Aceptar solo imágenes
            onChange={handleFileChange} // Usar el manejador personalizado
            className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
          />
          {/* No usamos register directamente para el file input aquí */}
        </div>
        {/* Podrías añadir validación de tamaño/tipo de archivo si es necesario */}
      </div>


      {/* Botón de Envío */}
      <div className="mt-6">
        <div className="mt-6 flex justify-end space-x-3"> 
          <button
            type="button" // ¡Importante! Para que no envíe el formulario
            onClick={onCancel} // Llama a la función onCancel recibida por props
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar {/* O puedes poner "Volver" */}
          </button>

          {/* Botón de Envío (Existente) */}
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          // disabled={isSubmitting} // Opcional: deshabilitar mientras se envía
          >
            {/* El texto cambia si es edición o creación */}
            {initialData ? 'Actualizar Equipo' : 'Guardar Equipo'}
          </button>

        </div>
      </div>
    </form>

  );
}

export default EquipoForm;
