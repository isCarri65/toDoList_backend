const Sprint = require("../models/Sprint");
const Task = require("../models/Task");

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error("La tarea no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  const estado = "pendiente";
  const colorR =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  try {
    const newTask = { ...req.body, color: colorR, estado: estado };
    const newTask2 = new Task(newTask);
    const savedTask = await newTask2.save();

    res.status(201).json(savedTask);
  } catch (err) {
    next(err);
  }
};
exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { titulo, descripcion, estado, fechaLimite, color } = req.body;

  try {
    const tareaActualizada = await Task.findByIdAndUpdate(
      id,
      { titulo, descripcion, estado, fechaLimite, color },
      { new: true } // devuelve el documento actualizado
    );
    if (!tareaActualizada) {
      const error = new Error("La tarea a actualizar no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.json(tareaActualizada);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Buscar si la tarea está en un sprint
    const taskSprint = await Sprint.findOne({ tareas: { $in: [id] } });

    if (taskSprint) {
      const error = new Error(
        "Error, acción no válida: la tarea todavía se encuentra en un sprint"
      );
      error.statusCode = 400; // Not Found
      throw error;
    }

    // Intentar eliminar la tarea
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("La tarea a eliminar no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Tarea eliminada exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};
