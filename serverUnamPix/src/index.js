const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");
const jwt = require("jsonwebtoken");
const routes = require("./api/endPoint");
const PORT = 3001;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
app.use(morgan("dev"));
app.use("/", routes);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//manejo de conexiones
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Usuario se une al room de la imagen
  socket.on("joinImageRoom", ({ idPublicacion }) => {
    if (idPublicacion) {
      socket.join(idPublicacion);
      console.log(`Usuario unido al room de la imagen: ${idPublicacion}`);
    }
  });

  // Usuario envía un comentario
  socket.on("sendComment", ({ token, idPublicacion, comentario }) => {
    if (!token || !idPublicacion || !comentario) {
      console.error("ID de imagen o comentario faltante");
      return socket.emit("error", { mensaje: "Faltan datos necesarios" });
    }

    // Verifica y transmite el comentario al room correspondiente
    jwt.verify(token, "Stack", (err, decoded) => {
      if (err) {
        console.error("Token inválido");
        return socket.emit("error", { mensaje: "Token inválido" });
      }

      const userName = decoded.nombre; // Nombre de usuario desde el token
      const nuevoComentario = { idPublicacion, userName, comentario };

      // Emite el comentario a todos los usuarios en el mismo room
      io.to(idPublicacion).emit("receiveComment", nuevoComentario);

      console.log(
        `Comentario enviado al room ${idPublicacion}:`,
        nuevoComentario
      );
    });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
