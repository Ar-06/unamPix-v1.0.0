const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.getPublicationByUser = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Token invalido" });
    }

    const idUsuario = decoded.codigo;
    const getPublicationUserQuery =
      "SELECT * FROM publicacion WHERE idUsuario = ?";
    connection.query(getPublicationUserQuery, [idUsuario], (err, results) => {
      if (err) {
        console.error("Error al obtener los productos del usuario", err);
        return res
          .status(500)
          .json({ message: "Error al obtener los productos del usuario", err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Publicaciones no encontradas" });
      }

      res.status(200).json({ publications: results });
    });
  });
};
