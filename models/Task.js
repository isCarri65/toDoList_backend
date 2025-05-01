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

taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Task", taskSchema);
