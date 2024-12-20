const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.updateLike = (req, res) => {
  const { idPublicacion } = req.params;
  const { action } = req.body;

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Invalido" });
    }

    const idUsuario = decoded.codigo;

    if (action === "like") {
      const fecha = new Date();
      const insertLikeQuery =
        "INSERT INTO reaccion (idUsuario, idPublicacion, Fecha) VALUES (?,?,?) ON DUPLICATE KEY UPDATE idReaccion = idReaccion";

      connection.query(
        insertLikeQuery,
        [idUsuario, idPublicacion, fecha],
        (err, results) => {
          if (err) {
            console.error("Error al insertar el like: ", err);
            return res
              .status(500)
              .json({ message: "Error al registrar el like" });
          }
          const updateReactionQuery =
            "UPDATE publicacion SET NumReacciones = NumReacciones + 1 WHERE idPublicacion = ?";

          connection.query(updateReactionQuery, [idPublicacion], (err) => {
            if (err) {
              console.error("Error al actualizar el número de likes", err);
              return res.status(500).json({
                message: "Error al actualizar likes en la publicación",
              });
            }

            const updateUserReactionQuery =
              "UPDATE usuario SET NumReacciones = NumReacciones + 1 WHERE idUsuario = ?";

            connection.query(updateUserReactionQuery, [idUsuario], (err) => {
              if (err) {
                console.error(
                  "Error al actualizar el número de reacciones del usuario",
                  err
                );
                return res.status(500).json({
                  message: "Error al actualizar reacciones en el usuario",
                });
              }
            });

            res.status(200).json({ message: "Like registrado" });
          });
        }
      );
    } else if (action === "dislike") {
      const deleteLikeQuery =
        "DELETE FROM reaccion WHERE idUsuario = ? AND idPublicacion = ?";

      connection.query(
        deleteLikeQuery,
        [idUsuario, idPublicacion],
        (err, results) => {
          if (err) {
            console.error("Error al eliminar el like: ", err);
            return res
              .status(500)
              .json({ message: "Error al eliminar el like" });
          }

          const updateReactionQuery =
            "UPDATE publicacion SET NumReacciones = NumReacciones - 1 WHERE idPublicacion = ?";

          connection.query(updateReactionQuery, [idPublicacion], (err) => {
            if (err) {
              console.error("Error al actualizar el número de likes", err);
              return res
                .status(500)
                .json({ message: "Error al actualizar likes en publicación" });
            }
            const updateUserReactionQuery =
              "UPDATE usuario SET NumReacciones = NumReacciones - 1 WHERE idUsuario = ?";

            connection.query(updateUserReactionQuery, [idUsuario], (err) => {
              if (err) {
                console.error(
                  "Error al actualizar el número de reacciones del usuario",
                  err
                );
                return res
                  .status(500)
                  .json({
                    message: "Error al actualizar reacciones en el usuario",
                  });
              }
            });
            res.status(200).json({ message: "Like eliminado" });
          });
        }
      );
    } else {
      res.status(400).json({ message: "Acción inválida" });
    }
  });
};
