const connection = require("../models/db");

module.exports.getLikes = (req, res) => {
  const { idPublicacion } = req.params;

  const getLikesQuery =
    "SELECT NumReacciones FROM publicacion WHERE idPublicacion = ?";

  connection.query(getLikesQuery, [idPublicacion], (err, results) => {
    if (err) {
      console.error("Error al obtener el número de reacciones", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor" });
    }

    if(results.length === 0) {
        return res.status(500).json({message: "Publicación no encontrada"})
    }

    res.status(200).json({likes:results[0].NumReacciones})
  });
};
