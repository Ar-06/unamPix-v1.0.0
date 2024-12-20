const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.deleteImageUser = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token", err);
      return res.status(401).json({ message: "Token inválido" });
    }

    const idUsuario = decoded.codigo;
    const { idPublicacion } = req.params;

    const getCountsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM comentario WHERE idPublicacion = ?) AS totalComentarios,
        (SELECT COUNT(*) FROM reaccion WHERE idPublicacion = ?) AS totalReacciones
    `;

    connection.query(
      getCountsQuery,
      [idPublicacion, idPublicacion],
      (err, counts) => {
        if (err) {
          console.error("Error al obtener comentarios y reacciones:", err);
          return res
            .status(500)
            .json({ message: "Error al obtener comentarios y reacciones" });
        }

        const totalComentarios = counts[0].totalComentarios;
        const totalReacciones = counts[0].totalReacciones;

        const updateUserStatsQuery = `
            UPDATE usuario 
            SET 
                NumComentarios = NumComentarios - ?,
                NumReacciones = NumReacciones - ?
            WHERE idUsuario = ?
        `;

        connection.query(
          updateUserStatsQuery,
          [totalComentarios, totalReacciones, idUsuario],
          (err) => {
            if (err) {
              console.error(
                "Error al actualizar el número de comentarios y reacciones del usuario",
                err
              );
              return res.status(500).json({
                message:
                  "Error al actualizar comentarios y reacciones del usuario",
              });
            }

            const deleteImageQuery =
              "DELETE FROM publicacion WHERE idPublicacion = ?";
            connection.query(deleteImageQuery, [idPublicacion], (err) => {
              if (err) {
                console.error("Error al eliminar la publicación", err);
                return res
                  .status(500)
                  .json({ message: "Error al eliminar la publicación" });
              }

              const updateUserPublicationsQuery = `
                    UPDATE usuario
                    SET NumPublicaciones = NumPublicaciones - 1
                    WHERE idUsuario = ?
                `;
              connection.query(
                updateUserPublicationsQuery,
                [idUsuario],
                (err) => {
                  if (err) {
                    console.error(
                      "Error al actualizar el número de publicaciones del usuario",
                      err
                    );
                    return res
                      .status(500)
                      .json({
                        message:
                          "Error al actualizar el número de publicaciones del usuario",
                      });
                  }

                  res.status(200).json({ message: "Publicación eliminada" });
                }
              );
            });
          }
        );
      }
    );
  });
};
