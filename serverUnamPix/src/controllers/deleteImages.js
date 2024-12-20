const connection = require("../models/db");

module.exports.deleteImage = (req, res) => {
  const idPublicacion = req.params.idPublicacion;
  const { idModerador } = req.body; // El id del moderador enviado desde el frontend

  // Primero, obtener el idUsuario asociado a la publicación
  const getUserQuery =
    "SELECT idUsuario FROM publicacion WHERE idPublicacion = ?";

  connection.query(getUserQuery, [idPublicacion], (err, results) => {
    if (err) {
      console.error("Error al obtener el usuario de la publicación:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener el usuario de la publicación" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const idUsuario = results[0].idUsuario;

    // Consultar cuántos comentarios y reacciones tiene esta publicación
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

        // Actualizar el número de comentarios y reacciones del usuario
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
                "Error al actualizar las estadísticas del usuario:",
                err
              );
              return res.status(500).json({
                message: "Error al actualizar las estadísticas del usuario",
              });
            }

            // Eliminar la publicación
            const deleteImageQuery =
              "DELETE FROM publicacion WHERE idPublicacion = ?";
            connection.query(deleteImageQuery, [idPublicacion], (err) => {
              if (err) {
                console.error("Error al eliminar la publicación:", err);
                return res
                  .status(500)
                  .json({ message: "Error al eliminar la publicación" });
              }

              // Actualizar el número de publicaciones eliminadas del moderador
              const updateDeleteModQuery =
                "UPDATE moderador SET NumPublicacionesEliminadas = NumPublicacionesEliminadas + 1 WHERE idModerador = ?";

              connection.query(updateDeleteModQuery, [idModerador], (err) => {
                if (err) {
                  console.error(
                    "Error al actualizar el número de publicaciones eliminadas del moderador:",
                    err
                  );
                  return res.status(500).json({
                    message:
                      "Error al actualizar el número de publicaciones eliminadas del moderador",
                  });
                }

                // Actualizar el número de publicaciones del usuario
                const updateUserPublicationsQuery =
                  "UPDATE usuario SET NumPublicaciones = NumPublicaciones - 1 WHERE idUsuario = ?";

                connection.query(
                  updateUserPublicationsQuery,
                  [idUsuario],
                  (err) => {
                    if (err) {
                      console.error(
                        "Error al actualizar el número de publicaciones del usuario:",
                        err
                      );
                      return res.status(500).json({
                        message:
                          "Error al actualizar el número de publicaciones del usuario",
                      });
                    }

                    // Responder éxito
                    res.status(200).json({
                      message: "Imagen eliminada y estadísticas actualizadas",
                    });
                  }
                );
              });
            });
          }
        );
      }
    );
  });
};
