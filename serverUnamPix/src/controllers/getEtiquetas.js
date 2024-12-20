const connection = require("../models/db");

module.exports.getEtiquetas = (req, res) => {
  const { idPublicacion } = req.params;

  const queryEtiquetas = "SELECT nombre FROM etiquetas WHERE idPublicacion = ?";

  connection.query(queryEtiquetas, [idPublicacion], (err, results) => {
    if (err) {
      console.error("Error al obtener las etiquetas:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener las etiquetas" });
    }

    // Devuelve un arreglo vacío si no hay etiquetas
    const etiquetas = results.map((row) => row.nombre);
    res.status(200).json({ etiquetas });
  });
};
