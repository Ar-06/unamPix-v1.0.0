const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.publication = (req, res) => {
  const { titulo, descripcion, categoria, etiquetas } = req.body;

  //validación de imágen
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Falta la imagen de la publicacion" });
  }

  //obtengo la imágen del request
  const URL = req.file.filename;

  //validación de etiquetas (no más de 3)

  const etiquetasArray = JSON.parse(etiquetas);

  if (etiquetasArray.length > 3) {
    return res
      .status(400)
      .json({ message: "Solo puedes agregar hasta 3 etiquetas" });
  }

  const token = req.headers.authorization.split(" ")[1];

  //verificar token
  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Invalido" });
    }

    const idUsuario = decoded.codigo;
    const fechaSubida = new Date();

    //insertar la publicación en la db
    const publicationQuery =
      "INSERT INTO publicacion (idUsuario,URL,titulo,FechaSubida,NumReacciones,NumComentarios,Descripcion,Categoria,EstadoVisual) VALUES (?,?,?,?,0,0,?,?,1)";

    const publicationValues = [
      idUsuario,
      URL,
      titulo,
      fechaSubida,
      descripcion,
      categoria,
      etiquetas,
    ];

    connection.query(publicationQuery, publicationValues, (err, result) => {
      if (err) {
        console.error("Error al insertar la publicación", err);
        return res
          .status(500)
          .json({ message: "Error al insertar la publicación" });
      }

      const idPublicacion = result.insertId;

      //insertamos las etiquetas

      const tagPromises = etiquetasArray.map((etiqueta) => {
        const tagQuery =
          "INSERT INTO etiquetas (nombre,valido,idPublicacion) VALUES (?,?,?)";
        const tagValues = [etiqueta, 1, idPublicacion];

        return new Promise((resolve, reject) => {
          connection.query(tagQuery, tagValues, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(tagPromises)
        .then(() => {
          const updateUserQuery =
            "UPDATE usuario SET NumPublicaciones = NumPublicaciones + 1  WHERE idUsuario = ?";
          connection.query(updateUserQuery, [idUsuario], (err) => {
            if (err) {
              console.error(
                "Error al actualizar el numero de publicaciones",
                err
              );
              return res.status(500).json({
                message: "Error al actualizar el número de publicaciones",
              });
            }
            return res
              .status(201)
              .json({ message: "Publicación creada correctamente" });
          });
        })
        .catch((err) => {
          console.error("Error al insertar uno o más etiquetas", err);
          return res
            .status(500)
            .json({ message: "Error al insertar las etiquetas" });
        });
    });
  });
};
