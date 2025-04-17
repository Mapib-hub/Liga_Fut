import { UploadImag } from "../api/img";
import { useForm } from "react-hook-form";

function ImagenPage() {
   
    const {register, handleSubmit, setValue} = useForm();
    
    const signup = async (data)=> {
      console.log(signup);
      try {
          const res = await UploadImag(data);
          console.log(res.data);
          /*setUser(res.data);
          setIsAuthenticated(true);*/      
      } catch (error) {
          console.log(error.response);
          //setErrors(error.response.data); 
      }
  };
    const onSubmit = handleSubmit(async ($_File)=>{
     // console.log(values);
     signup($_File);
      
  }); 

    return (
        
        <form action={"http://localhost:4000/api/images/single"} method={"post"} encType={"multipart/form-data"}  >
            <input
              {...register("titulo", {
                required: "Titulo is required",
              })}
              type="text"
              id="titulo"
            /><br /><br />
            <textarea {
             ...register("description",{
              required:"description is required",
             })}
             id="description">

            </textarea><br /><br />
            <input
              {...register("imagenPerfil", {
                required: "Recipe picture is required",
              })}
              type="file"
              id="imagenPerfil"
            />
            <button type="submit">Enviar</button>
        </form>
    );
}

export default ImagenPage;
