const connection = require("../models/db");

module.exports.insertEvent = (req, res) => {
  const { nombre, fechaInicio, fechaFinal, descripcion, idModerador } = req.body;

  const insertEvent =
    "INSERT INTO evento (Nombre, FechaInicio, FechaFinal, Descripcion, idModerador) VALUES (?,?,?,?,?)";

  const values = [nombre, fechaInicio, fechaFinal, descripcion, idModerador];

  connection.query(insertEvent, values, (err, results) => {
    if (err) {
      console.error("Error al registrar el evento", err);
      return res.status(500).json({ message: "Error al registrar el evento" });
    }
    const updateEventMod =
      "UPDATE moderador SET NumEventosCreados = NumEventosCreados + 1 WHERE idModerador = ?";

    connection.query(updateEventMod, [idModerador], (err) => {
      if (err) {
        console.error("Error al actualizar el número de eventos creados", err);
        return res
          .status(500)
          .json({ message: "Error al actualizar el número de eventos" });
      }
    });
    res.status(200).json({message: "Evento creado correctamente"})
  });
};
