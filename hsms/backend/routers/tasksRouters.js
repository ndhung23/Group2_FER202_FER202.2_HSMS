import express from 'express';
import { createTasks, deleteTasks, getAllTasks, updateTasks } from '../src/controllers/tasksControllers.js';
const router = express.Router();

//Read
router.get("/",getAllTasks);
//Create
router.post("/",createTasks);
//Update
router.put("/:id",updateTasks);
//Delete
router.delete("/:id",deleteTasks);

export default router;