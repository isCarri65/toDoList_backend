const Backlog = require("../models/Backlog");
const Task = require("../models/Task");

exports.getBacklog = async (req, res, next) => {
  try {
    const backlog = await Backlog.findOne().populate("tareas");
    res.json(backlog);
  } catch (err) {
    next(err);
  }
};

exports.createBacklog = async (req, res, next) => {
  try {
    const newBacklog = new Backlog(req.body);
    const savedBacklog = await newBacklog.save();
    res.status(201).json(savedBacklog);
  } catch (err) {
    next(err);
  }
};

exports.addTaskToBacklog = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const taskExist = await Task.findById(taskId);
    if (!taskExist) {
      const error = new Error(
        "No se encontró la tarea para agregar al backlog"
      );
      error.statusCode = 404; // Not Found
      throw error;
    }
    const updatedBacklog = await Backlog.findOneAndUpdate(
      {},
      { $push: { tareas: taskId } },
      { new: true }
    );
    if (!updatedBacklog) {
      const error = new Error("El backlog a actualizar no fue encontrado.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.json(updatedBacklog);
  } catch (error) {
    next(error);
  }
};
