const connecion = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.insertComments = (token, idPublicacion, texto, callback) => {
  if (!token || !idPublicacion || !texto) {
    return callback({ error: "Faltan datos necesarios" });
  }

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      return callback({ error: "Token invalido" });
    }

    const idUsuario = decoded.codigo;
    const fecha = new Date();

    console.log("Comentario recibido:", {
      idUsuario,
      idPublicacion,
      texto,
      fecha,
    });

    // Consulta para insertar el comentario
    const insertCommentQuery =
      "INSERT INTO comentario (idUsuario, idPublicacion, Texto, Fecha) VALUES (?,?,?,?)";

    const commentsValues = [idUsuario, idPublicacion, texto, fecha];

    // Primero insertamos el comentario
    connecion.query(insertCommentQuery, commentsValues, (err, result) => {
      if (err) {
        console.error("Error al insertar el comentario", err);
        return callback({ error: "Error al insertar el comentario" });
      }

      // Después de insertar el comentario, actualizamos el número de comentarios
      const updateCommentCountQuery =
        "UPDATE publicacion SET NumComentarios = NumComentarios + 1 WHERE idPublicacion = ?";

      connecion.query(updateCommentCountQuery, [idPublicacion], (err) => {
        if (err) {
          console.error("Error al actualizar el número de comentarios", err);
          return callback({
            error: "Error al actualizar el número de comentarios",
          });
        }

        const updateUserCommentQuery =
          "UPDATE usuario SET NumComentarios = NumComentarios + 1 WHERE idUsuario = ?";

        connecion.query(updateUserCommentQuery, [idUsuario], (err) => {
          if (err) {
            console.error(
              "Error al actualizar el número de comentarios del usuario",
              err
            );
            return callback({
              error: "Error al actualizar los comentarios en el usuario",
            });
          }
        });

        console.log(
          `Número de comentarios actualizado para la publicación ${idPublicacion}`
        );

        // Finalmente, respondemos con el nuevo comentario insertado y el número actualizado de comentarios
        callback(null, {
          idUsuario,
          idPublicacion,
          texto,
          fecha,
        });
      });
    });
  });
};
