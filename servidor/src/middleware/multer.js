import path from 'path';
import multer from "multer";
import { fileURLToPath } from 'url';

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../uploads/jugadores'),
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
 
});

export const upload = multer({
    storage: storage, // Usar la variable storage aquí
    limits: {fileSize: 2000000},
    fileFilter: (req, file, cb)=> {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetypes = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetypes && extname) {
            return cb(null, true);
        }
        cb(new Error("El archivo no es válido. Solo se permiten formatos JPEG, JPG, PNG o GIF."));

    }

});