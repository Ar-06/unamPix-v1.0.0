const connection = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.participaEvento = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err) {
      console.error("Token inválido", err);
      return res.status(401).json({ message: "Token inválido" }); // Aquí enviamos la respuesta y retornamos
    }

    const idUsuario = decoded.codigo;
    const { idEvento } = req.body;
    const fecha = new Date();

    // Verificar si el usuario ya está participando en el evento
    const checkParticipationQuery =
      "SELECT * FROM participarevento WHERE idUsuario = ? AND idEvento = ?";
    connection.query(
      checkParticipationQuery,
      [idUsuario, idEvento],
      (err, results) => {
        if (err) {
          console.error("Error al verificar la participación del usuario", err);
          return res
            .status(500)
            .json({ message: "Error al verificar la participación" }); // Respuesta enviada
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Ya estás participando en este evento" }); // Respuesta enviada
        }

        // Si no existe participación, insertar el registro
        const userParticipeQuery =
          "INSERT INTO participarevento (idUsuario, idEvento, FechaParticipacion) VALUES (?,?,?)";
        const values = [idUsuario, idEvento, fecha];

        connection.query(userParticipeQuery, values, (err) => {
          if (err) {
            console.error("Error al añadir la participación del usuario", err);
            return res.status(500).json({
              message: "Error al añadir la participación del usuario",
            }); // Respuesta enviada
          }

          // Actualizar el contador de participaciones
          const numParticipacionUserQuery =
            "UPDATE usuario SET NumParticipacionEventos = NumParticipacionEventos + 1 WHERE idUsuario = ?";
          connection.query(numParticipacionUserQuery, [idUsuario], (err) => {
            if (err) {
              console.error(
                "Error al actualizar el número de participaciones del usuario",
                err
              );
              return res.status(500).json({
                message: "Error al actualizar el número de participaciones",
              }); // Respuesta enviada
            }

            // Respuesta exitosa final
            res.status(200).json({
              message: "Participación añadida correctamente",
            });
          });
        });
      }
    );
  });
};
