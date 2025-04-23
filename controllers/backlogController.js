const Backlog = require("../models/Backlog");

exports.getBacklog = async (req, res) => {
  try {
    const backlog = await Backlog.find().populate("tareas");
    res.json(backlog);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener backlog" });
  }
};

exports.createBacklog = async (req, res) => {
  try {
    const newBacklog = new Backlog(req.body);
    const savedBacklog = await newBacklog.save();
    res.status(201).json(savedBacklog);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error al crear backlog", detalle: err.message });
  }
};

exports.addTaskToBacklog = async (req, res) => {
  const { taskId } = req.params;

  try {
    const taskExist = await Task.findById(taskId);
    if (!taskExist)
      res
        .status(404)
        .json({ message: "Error, la tarea que se intenta agregar no existe" });
    const updatedBacklog = await Backlog.findOneAndUpdate(
      {},
      { $push: { tareas: taskId } },
      { new: true }
    );
    if (updatedBacklog) {
      res.status(404).json({ message: "Error, backlog no encontrado" });
    }
    res.json(updatedBacklog);
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar una tarea al backlog",
      detalle: error.message,
    });
  }
};
