  const connection = require("../models/db");

  module.exports.getPublicationById = (req, res) => {
    const { idPublicacion } = req.params;

    const queryPublicationId =
      "SELECT * FROM publicacion WHERE idPublicacion = ?";

    connection.query(queryPublicationId, [idPublicacion], (err, result) => {
      if (err) {
        console.error("Error al obtener la publicación", err);
        return res
          .status(500)
          .json({ message: "Error al obtener la publicacion" });
      }

      if (result.length === 0) {
        console.error("Publicacion no encontrado");
        return res.status(404).json({ message: "Publicacion no encontrada" });
      }

      res.status(200).json({ publication: result[0] });
    });
  };
