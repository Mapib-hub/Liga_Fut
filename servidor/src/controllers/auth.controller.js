import { json, response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {createAccessToken} from "../libs/jwt.js"; 
import { token } from "morgan";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req , res) => {
    const {email, password, username } = req.body;

    try {
      const userFound = await User.findOne({ email });
      if (userFound) return res.status(400).json(["El email ya esta en uso"]);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          email,
          password: passwordHash,  
        });
        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved._id});

        res.cookie('token', token);
        res.json({
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        });
    } catch (error) {
       res.status(500).json( { message: error.message });  
    }

};

export const login = async (req , res) => {
  const {email, password } = req.body;

  try {
      const userFound = await User.findOne ({ email });
      if (!userFound) return res.status(400).json(["Usuario no encontrado"]);
      
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) return res.status(400).json( ["Password icorrecta"]);

      const token = await createAccessToken({id: userFound._id});

      res.cookie('token', token);
      res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      });
  } catch (error) {
     res.status(500).json( { message: error.message });  
  }

};

export const logout = (req, res) => {
  res.cookie("token", " ", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  //console.log(req.user);
  const userFound = await User.findById(req.user.id)
  if(!userFound) return res.status(400).json({ message: "User not found"});

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  })
  
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        // Si no hay token, envía 401 Unauthorized
        return res.status(401).json({ message: "No Autorizado: Token no proporcionado" });
    }

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) {
            // Si el token es inválido o expirado, envía 401 Unauthorized
            // Puedes ser más específico si quieres, ej. diferenciar entre expirado e inválido
            console.error("Error verificando token:", err.message); // Loguear el error puede ser útil
            return res.status(401).json({ message: "No Autorizado: Token inválido o expirado" });
        }

        try {
            // 'user' aquí es el payload decodificado del token (que debería tener el id)
            const userFound = await User.findById(user.id);

            if (!userFound) {
                // Si el usuario asociado al token ya no existe, envía 401 Unauthorized
                return res.status(401).json({ message: "No Autorizado: Usuario no encontrado" });
            }

            // Si el token es válido y el usuario existe, devuelve los datos del usuario
            return res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
            });
        } catch (error) {
            // Manejar errores inesperados durante la búsqueda en la BD
            console.error("Error buscando usuario durante verificación de token:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    });
};
