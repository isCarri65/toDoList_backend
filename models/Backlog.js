const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema({
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

backlogSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});
module.exports = mongoose.model("Backlog", backlogSchema);
