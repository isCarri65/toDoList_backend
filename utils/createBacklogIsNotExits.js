const Backlog = require("../models/Backlog");

exports.createBacklogIsNotExist = async () => {
  const existing = await Backlog.findOne();
  if (!existing) {
    const newBacklog = new Backlog({ tareas: [] });
    await newBacklog.save();
    console.log("Backlog por defecto creado");
  } else {
    console.log("Ya existe un backlog");
  }
};
