const Sprint = require("../models/Sprint");
const { getTaskById } = require("./taskController");

exports.getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find().populate("tareas");
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sprints" });
  }
};

exports.getSprintById = async (req, res) => {
  const { id } = req.params;
  try {
    const sprint = await Sprint.findById(id);
    res.json(sprint);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar un sprint por su id",
      detalle: error.message,
    });
  }
};

exports.createSprint = async (req, res) => {
  try {
    const newSprint = new Sprint(req.body);
    const savedSprint = await newSprint.save();
    res.status(201).json(savedSprint);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error al crear sprint", detalle: err.message });
  }
};

exports.updateSprint = async (req, res) => {
  const { id } = req.params;
  const { nombre, fechaInicio, fechaCierre, tareas, color } = req.body;

  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { nombre, fechaInicio, fechaCierre, tareas, color },
      { new: true } // devuelve el documento actualizado
    );

    if (!updatedSprint) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(updatedSprint);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar tarea", detalle: error.message });
  }
};
exports.deleteSprint = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Sprint.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Error, sprint no encontrado" });
    }
    res.json({ message: "Sprint Eliminado con exito" });
  } catch (error) {
    res.status(500).json({
      message: "Error del sevidor a la hora de borrar el sprint",
      detall: error.message,
    });
  }
};

exports.addTaskToSprint = async (req, res) => {
  const { id, taskId } = req.params;
  try {
    const taskExist = Task.findById(taskId);
    if (!taskExist)
      res
        .status(404)
        .json({ message: "Error, la tarea que se intenta agregar no existe" });
    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { $push: { tareas: taskId } },
      { new: true }
    );
    if (!updatedSprint) {
      res.status(404).json({ message: "Sprint no encontrado por su id" });
    }
    res.json(updatedSprint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al intentar agregar una tarea a un sprint" });
  }
};
