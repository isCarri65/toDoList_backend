const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("../routes/tasks");
const sprintRoutes = require("../routes/sprints");
const backlogRoutes = require("../routes/backlog");

const createServer = (options) => {
  const app = express();
  // Middleware para parsear JSON
  app.use(express.json());

  mongoose
    .connect(options.mongoUrl)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error de conexión:", err));

  app.use("/tasks", taskRoutes);
  app.use("/sprints", sprintRoutes);
  app.use("/backlog", backlogRoutes);

  app.listen(options.port, () => {
    console.log("escuchando en el puerto: ", options.port);
  });
};

module.exports = {
  createServer,
};
