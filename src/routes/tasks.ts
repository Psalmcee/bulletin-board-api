import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from "../controller";

export const router = Router()

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)