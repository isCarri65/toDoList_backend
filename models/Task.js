const mongoose = require("mongoose");
const estado = {
  PENDIENTE: "pendiente",
  ENPROGRESO: "en progreso",
  TERMINDAO: "terminado",
};

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "en progreso", "terminada"],
    required: true,
  },
  fechaLimite: { type: String, required: true },
  color: { type: String, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
