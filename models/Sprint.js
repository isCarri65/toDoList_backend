const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
  fechaInicio: { type: String, required: true },
  fechaCierre: { type: String, required: true },
  nombre: { type: String, required: true },
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  color: { type: String, required: true },
});

sprintSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Sprint", sprintSchema);
