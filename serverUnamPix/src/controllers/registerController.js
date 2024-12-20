const connection = require("../models/db");
const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
  const { idUsuario, nombres, apellidos, contraseña } = req.body;

  const saltRounds = 10;

  bcrypt.hash(contraseña, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error al hashear la contraseña", err);
      return res
        .status(500)
        .json({ message: "Error al hashear la contraseña" });
    }

    const FechaRegistro = new Date();

    const insertQuery =
      "INSERT INTO usuario (idUsuario,Nombres,Apellidos,Contraseña,NumPublicaciones,FechaRegistro,NumReacciones,NumComentarios,NumParticipacionEventos) VALUES (?,?,?,?,0,?,0,0,0)";

    const values = [idUsuario, nombres, apellidos, hash, FechaRegistro];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error al registrar el usuario", err);
        return res
          .status(500)
          .json({ message: "Error al registrar el usuario" });
      }

      res.status(201).json({ message: "Usuario registrado exitosamente" });
    });
  });
};
