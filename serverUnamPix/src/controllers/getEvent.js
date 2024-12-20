const connection = require("../models/db");

module.exports.getEvents = (req, res) => {
  const getEventQuery = "SELECT * FROM evento";

  connection.query(getEventQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los eventos", err);
      return res.status(400).json({ message: "Error al obtener los eventos" });
    }

    const eventoFormateado = results.map((evento) => ({
      ...evento,
      FechaInicio: evento.FechaInicio,
      FechaFinal: evento.FechaFinal,
    }));

    res.status(200).json({ eventos: eventoFormateado });
  });
};
