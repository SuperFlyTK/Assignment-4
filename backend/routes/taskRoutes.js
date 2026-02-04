const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const isAuth = require("../middleware/authMiddleware");

router.get("/", getTasks);
router.post("/", isAuth, createTask);
router.put("/:id", isAuth, updateTask);
router.delete("/:id", isAuth, deleteTask);

module.exports = router;
