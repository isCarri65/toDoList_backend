const Sprint = require("../models/Sprint");
const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const idTask = req.body;
    const task = await Task.findById(idTask);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener una tarea por su id" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error al crear tarea", detalle: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado, fechaLimite, color } = req.body;

  try {
    const tareaActualizada = await Task.findByIdAndUpdate(
      id,
      { titulo, descripcion, estado, fechaLimite, color },
      { new: true } // devuelve el documento actualizado
    );

    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar tarea", error });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskSprint = await Sprint.findOne({ $in: { tareas: [id] } });
  const taskBacklog = await Backlog.findOne({ $in: { tareas: [id] } });
  if (taskSprint || taskBacklog)
    res
      .status(500)
      .json({
        message:
          "Error, acción no valida, la tarea se encuentra en un sprint o en el backlog ",
      });
  try {
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Error, tarea no encontrada" });
    }
    res.status(200);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar una tarea" }, error);
  }
};
