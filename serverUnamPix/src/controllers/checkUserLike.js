const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.checkUserLike = (req, res) => {
  const { idPublicacion } = req.params;

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Invalido" });
    }
    const idUsuario = decoded.codigo;
    
    const queryCheck =
      "SELECT COUNT (*) AS liked FROM reaccion WHERE idUsuario = ? AND idPublicacion = ?";

    connection.query(queryCheck, [idUsuario, idPublicacion], (err, results) => {
      if (err) {
        console.error("Error al verificar el like del usuario:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }

      res.status(200).json({ liked: results[0].liked > 0 });
    });
  });
};
