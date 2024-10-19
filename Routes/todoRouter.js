import express from "express";

import {
  createtodo,
  getTodo,
  removetodo,
  updateTodo,
} from "../Controller/TodoController.js";
import { authication } from "../Middleware/Auth.js";

const router = express.Router();

router.post("/todocreate",authication, createtodo);
router.get("/gettodos",authication, getTodo);
router.put("/updatetodo/:id", authication, updateTodo);
router.delete("/removetodo/:id",authication, removetodo);

export default router;
