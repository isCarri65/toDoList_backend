const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("../routes/tasks");
const sprintRoutes = require("../routes/sprints");
const backlogRoutes = require("../routes/backlog");
const errorHandler = require("../middlewares/errorHandler");
const { createBacklogIsNotExist } = require("../utils/createBacklogIsNotExits");
const cors = require("cors");

const createServer = (options) => {
  const app = express();
  // Middleware para parsear JSON
  app.use(express.json());

  mongoose
    .connect(options.mongoUrl)
    .then(async () => {
      console.log("Conectado a MongoDB");
      await createBacklogIsNotExist();
      app.listen(options.port, () => {
        console.log("escuchando en el puerto: ", options.port);
      });
    })
    .catch((err) => console.error("Error de conexión:", err));

  app.use(cors());
  app.use("/tasks", taskRoutes);
  app.use("/sprints", sprintRoutes);
  app.use("/backlog", backlogRoutes);

  app.use(errorHandler);
};

module.exports = {
  createServer,
};
