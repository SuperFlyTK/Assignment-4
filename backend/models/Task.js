const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending"
    },
    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
