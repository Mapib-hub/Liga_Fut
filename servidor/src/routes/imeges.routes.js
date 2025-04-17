import { Router } from "express";
import multer, { MulterError } from "multer";
import { error } from "node:console";
import fs from "node:fs";
//import { useNavigate, Link } from "react-router-dom";

const MIMETYPES = ['image/jpeg', 'image/png'];

const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) cb(null, true);
      else cb(new Error(`Solo ${MIMETYPES.join(' ')} archivos permitidos`), false);
    },
    limits:{fileSize:2000000},
    
}).single('imagenPerfil');

const router = Router();

router.post('/images/single', function (req, res) {
   // console.log(req.body);
   // console.log(req.file);
   upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json( "El Archivo es mayor a 2 MB"); 
        return (error);
        
      } else if (err) {
        console.log(err);
        res.status(400).json( `Solo ${MIMETYPES.join(' ')}son archivos permitidos`);
        //res.send(err)
        return (error);
      }
      var subida = saveImage(req.file);
      //navigate("/imagenes");
      res.send(subida);
    })
    
  });
  

  function saveImage(file){
    const newPath = `./uploads/${Date.now()}${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
};

/*router.post('/images/single', upload, (req, res,)=> {
    //console.log(file);
    //saveImage(req.file);
    res.send("Terminado");
});*/

/*router.post('/images/multi', upload.array('photos', 10), (req, res)=> {
    //console.log(req.file);
    req.files.map(saveImage);
    res.send("multi Terminado");
});*/





export default router;