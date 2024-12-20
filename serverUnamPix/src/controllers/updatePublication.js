const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.updatePublication = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Token inválido" });
    }

    const idUsuario = decoded.codigo;
    const { idPublicacion } = req.params;
    const { titulo, descripcion, categoria, etiquetas } = req.body;

    if (!titulo || !descripcion || !categoria || !etiquetas) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    const etiquetasArray = JSON.parse(etiquetas);
    if (etiquetasArray.length > 3) {
      return res
        .status(400)
        .json({ message: "Solo puedes agregar hasta 3 etiquetas" });
    }

    if (etiquetas.length === 0) {
      return res.status(400).json({
        message: "Debes agregar al menos una etiqueta o etiquetas invalidas",
      });
    }

    const updatePublication = `
      UPDATE publicacion
      SET Titulo = ?, Descripcion = ?, Categoria = ?
      WHERE idPublicacion = ? AND idUsuario = ?
    `;

    const values = [titulo, descripcion, categoria, idPublicacion, idUsuario];

    connection.query(updatePublication, values, (err, results) => {
      if (err) {
        console.error("Error al actualizar la publicación", err);
        return res
          .status(500)
          .json({ message: "Error al actualizar la publicación" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      const deleteTags = "DELETE FROM etiquetas WHERE idPublicacion = ?";

      connection.query(deleteTags, [idPublicacion], (err) => {
        if (err) {
          console.error("Error al eliminar las etiquetas", err);
          return res
            .status(500)
            .json({ message: "Error al eliminar las etiquetas" });
        }

        const insertTags =
          "INSERT INTO etiquetas (nombre, idPublicacion, valido) VALUES ?";

        const tagsValues = etiquetasArray.map((tag) => [tag, idPublicacion, 1]);

        connection.query(insertTags, [tagsValues], (err) => {
          if (err) {
            console.error("Error al insertar las etiquetas", err);
            return res
              .status(500)
              .json({ message: "Error al insertar las etiquetas" });
          }

          res.status(200).json({ message: "Publicación actualizada" });
        });
      });
    });
  });
};
