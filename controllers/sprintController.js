const Backlog = require("../models/Backlog");
const Sprint = require("../models/Sprint");
const Task = require("../models/Task");
const { addTaskToBacklog } = require("./backlogController");
const { getTaskById } = require("./taskController");

exports.getAllSprints = async (req, res, next) => {
  try {
    const sprints = await Sprint.find().populate("tareas");
    res.json(sprints);
  } catch (err) {
    next(err);
  }
};

exports.getSprintById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sprint = await Sprint.findById(id).populate("tareas");
    if (!sprint) {
      const error = new Error(`El sprint con el id ${id} no fue encontrad0.`);
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.json(sprint);
  } catch (error) {
    next(error);
  }
};

exports.createSprint = async (req, res, next) => {
  const colorR =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  try {
    const newSprint = new Sprint({ ...req.body, color: colorR });
    const savedSprint = await newSprint.save();
    res.status(201).json(savedSprint);
  } catch (err) {
    next(err);
  }
};
exports.updateSprint = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, fechaInicio, fechaCierre, tareas, color } = req.body;
  const tareasParse = tareas.map((tarea) => {
    tarea.id;
  });
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { nombre, fechaInicio, fechaCierre, tareas: tareasParse, color },
      { new: true } // devuelve el documento actualizado
    );

    if (!updatedSprint) {
      const error = new Error("El Sprint a actualizar no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.json(updatedSprint);
  } catch (error) {
    next(error);
  }
};
exports.deleteSprint = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Sprint.findByIdAndDelete(id);
    if (!deleted) {
      const error = new Error("El Sprint a eliminar no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "El sprint fue eliminado exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};

exports.addTaskToSprint = async (req, res, next) => {
  const { id, taskId } = req.params;
  try {
    const taskExist = Task.findById(taskId);
    if (!taskExist) {
      const error = new Error(
        "La tarea no fue encontrada para agregarla al sprint."
      );
      error.statusCode = 404; // Not Found
      throw error;
    }
    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { $push: { tareas: taskId } },
      { new: true }
    );
    if (!updatedSprint) {
      const error = new Error("El Sprint a actualizar no fue encontrada.");
      error.statusCode = 404; // Not Found
      throw error;
    }

    await Backlog.findOneAndUpdate({}, { $pull: { tareas: taskId } });
    res.json(updatedSprint);
  } catch (error) {
    next(error);
  }
};

exports.moveTaskToBacklog = async (req, res, next) => {
  const { id, taskId } = req.params;
  try {
    const sprint = await Sprint.findById(id).populate("tareas");
    if (!sprint) {
      const error = new Error("Sprint no encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const tareaExiste = sprint.tareas.some((t) => t._id.toString() === taskId);
    if (!tareaExiste) {
      const error = new Error("La tarea no se encuentra en el sprint.");
      error.statusCode = 404;
      throw error;
    }
    // Eliminar del sprint
    sprint.tareas.pull(taskId);
    await sprint.save();
    // Cambiar el estado de la tarea a pendiente y agregarla al backlog

    const result = await Task.updateOne(
      { _id: taskId },
      { $set: { estado: "pendiente" } }
    );
    if (result.acknowledged === false) {
      const error = new Error("Error al actualizar el estado de la tarea.");
      error.statusCode = 500;
      throw error;
    }
    const result2 = await Backlog.updateOne(
      {},
      { $addToSet: { tareas: taskId } }
    );
    if (result2.acknowledged === false) {
      const error = new Error("Error al agregar la tarea al backlog.");
      error.statusCode = 500;
      throw error;
    }
    res.json(sprint);
  } catch (error) {
    next(error);
  }
};
