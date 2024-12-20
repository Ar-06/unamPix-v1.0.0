const connection = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.login = (req, res) => {
  const { idUsuario, contraseña } = req.body;

  if (!idUsuario || !contraseña) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const loginQuery =
    "SELECT idUsuario, Nombres, Contraseña FROM usuario WHERE idUsuario = ?";

  try {
    connection.query(loginQuery, [idUsuario], (error, results) => {
      if (error) {
        console.error("Error al buscar usuario en la base de datos");
        return res
          .status(500)
          .json({ message: "Error al buscar usuario en la base de datos" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const { Contraseña: storedHash, idUsuario, Nombres } = results[0];

      bcrypt.compare(contraseña, storedHash, (err, isMatch) => {
        if (err) {
          console.error("Error al comparar contraseñas", err);
          return res
            .status(500)
            .json({ message: "Error al comparar contraseñas" });
        }

        if (isMatch) {
          try {
            const token = jwt.sign(
              { codigo: idUsuario, nombre: Nombres },
              process.env.JWT_SECRET || "Stack",
              {
                expiresIn: "3h",
              }
            );

            res.status(200).json({ message: "Bienvenido", token: token });
          } catch (tokenError) {
            console.error("Error al general el token", tokenError);
            return res
              .status(500)
              .json({ message: "Error al generar el token de autenticación" });
          }
        } else {
          res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
      });
    });
  } catch (e) {
    console.error("Error en el controlador de login", e);
    res
      .status(500)
      .json({ message: "Error en el servidor al procesar la solicitud" });
  }
};
