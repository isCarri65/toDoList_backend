const express = require("express");
const router = express.Router();
const backlogController = require("../controllers/backlogController");

router.get("/", backlogController.getBacklog);
router.post("/", backlogController.createBacklog);
router.put("/add-task/:taskId", backlogController.addTaskToBacklog);

module.exports = router;
