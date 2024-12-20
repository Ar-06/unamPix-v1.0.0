const connection = require("../models/db");

module.exports.getPublicationCategory = (req, res) => {
  const { categoria } = req.params;

  if (!categoria) {
    return res.status(400).json({ message: "Falta específicar la categoría" });
  }
  const queryPublicationCategory =
    "SELECT * FROM publicacion WHERE Categoria = ?";
  connection.query(queryPublicationCategory, [categoria], (err, results) => {
    if (err) {
      console.error("Error al obtener las publicaciones de la categoria", err);
      return res
        .status(500)
        .json({
          message: "Error al obtener las publicaciones de la categoria",
        })
    }
    if (results.length === 0) {
      console.error("Publicaciones de la categoria no encontrada");
      return res
        .status(404)
        .json({ message: "Publicaciones de la categoria no encontrada" });
    }
    res.status(200).json({ publicacionCategoria: results });
  });
};
