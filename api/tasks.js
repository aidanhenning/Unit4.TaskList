import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import {
  createTask,
  getTaskById,
  getTasksByUserId,
  updateTask,
  deleteTask,
} from "#db/queries/tasks";
import requireUser from "#middleware/requireUser";

router.use(requireUser);

router.post("/", requireBody(["title", "done"]), async (req, res) => {
  const { title, done } = req.body;
  const task = await createTask(title, done, req.user.id);
  res.status(201).send(task);
});

router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);
    res.send(tasks);
  } catch (err) {
    next(err);
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const task = await getTaskById(id);
    if (!task) return res.status(404).send("Task not found");
    if (task.user_id !== req.user.id) {
      return res.status(403).send("This is not your task");
    }
    req.task = task;
    next();
  } catch (err) {
    next(err);
  }
});

router
  .route("/:id")
  .put(requireBody(["title", "done"]), async (req, res, next) => {
    try {
      const updated = await updateTask(req.task.id, req.body);
      res.send(updated);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await deleteTask(req.task.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
