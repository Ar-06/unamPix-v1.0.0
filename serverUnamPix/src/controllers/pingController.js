const connection = require("../models/db");

module.exports.ping = (req, res) => {
  const query = "SELECT * FROM usuario";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener los usuarios", error);
      return res.status(500).json({ message: "Error al obtener los usuarios" });
    }
    res.status(200).json({ usuarios: results });
  });
};
