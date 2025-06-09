import express from "express";
const router = express.Router();
export default router;
import requireBody from "#middleware/requireBody";

router.route("/").post(requireBody(["title", "done"]), async (req, res) => {
  const { title, done } = req.body;
  const task = await createTask(title, done, req.user.id);
  res.status(201).send(task);
});
