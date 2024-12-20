const connection = require("../models/db");
const path = require("path");
const fs = require("fs");

module.exports.getUrlImage = (req, res) => {
  const { idPublicacion } = req.params;

  const queryGetUrl = "SELECT URL FROM publicacion WHERE idPublicacion = ?";

  connection.query(queryGetUrl, [idPublicacion], (err, results) => {
    if (err) {
      console.error("Error al obtener la URL de la imagen", err);
      return res
        .status(500)
        .json({ message: "Error al obtener la URL de la imágen" });
    }
    if (results.length === 0) {
      console.error("URL no encontrada");
      return res.status(404).json({ message: "URL no encontrada" });
    }

    const imagePath = path.join(
      __dirname,
      "../../public/images",
      results[0].URL
    );

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("El archivo no existe o no es accesible", imagePath);
        return res.status(404).json({ message: "Archivo no encontrado" });
      }
    });

    res.download(imagePath, "imagen_publicacion.jpg", (err) => {
      if (err) {
        console.error("Error al descargar la imagen", err);
        if (!res.headerSent) {
          res.status(500).json({ message: "Error al descargar la imagen" });
        }
      }
    });
  });
};
