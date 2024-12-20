const connection = require("../models/db");

module.exports.loginMod = (req, res) => {
  const { idModerador, contraseña } = req.body;

  if (!idModerador || !contraseña) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const loginModQuery =
    "SELECT idModerador, Nombres, Contraseña FROM moderador WHERE idModerador = ?";

  try {
    connection.query(loginModQuery, [idModerador], (err, results) => {
      if (err) {
        console.error("Error al buscar moderador en la base de datos");
        return res
          .status(400)
          .json({ message: "Error al buscar moderador en la base de datos" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const moderador = results[0];

      if (contraseña !== moderador.Contraseña) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      return res.status(200).json({
        message: "Bienvenido",
        idModerador: moderador.idModerador,
        nombre: moderador.nombre,
      });
    });
  } catch (error) {
    console.error("Error en el controlador de login", error);
    res
      .status(500)
      .json({ message: "Error en el servidor al procesar la solicitud" });
  }
};
