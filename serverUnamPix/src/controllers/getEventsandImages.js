const connection = require("../models/db");

module.exports.getEventsandImage = (req, res) => {
  const { idModerador } = req.query;

  const queryGetEvents =
    "SELECT NumEventosCreados FROM moderador WHERE idModerador = ?";
  const querygetPublications =
    "SELECT COUNT(*) AS TotalPublicaciones FROM publicacion";
  const querygetUsers = "SELECT COUNT(*) AS TotalUsuarios FROM usuario";
  connection.query(queryGetEvents, [idModerador], (err, resultsEvents) => {
    if (err) {
      console.error("Error al obtener el número de eventos", err);
      return res
        .status(500)
        .json({ message: "Error al obtener el número de eventos" });
    }

    connection.query(querygetPublications, (err, resultsPublicacion) => {
      if (err) {
        console.error("Error al obtener la cantidad de publicaciones");
        return res
          .status(500)
          .json({ message: "Error al obtener la cantidad de publicaciones" });
      }

      connection.query(querygetUsers, (err, resultsUser) => {
        if (err) {
          console.error("Error al obtener la cantidad de usuarios");
          return res
            .status(500)
            .json({ message: "Error al obtener la cantidad de usuarios" });
        }
        const numEventos = resultsEvents[0]?.NumEventosCreados || 0;
        const totalImages = resultsPublicacion[0]?.TotalPublicaciones || 0;
        const totalUsers = resultsUser[0]?.TotalUsuarios || 0;

        return res.status(200).json({
          numEventosCreados: numEventos,
          totalPublicaciones: totalImages,
          totalUsuarios: totalUsers,
        });
      });
    });
  });
};
