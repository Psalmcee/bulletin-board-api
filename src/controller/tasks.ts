import { Request, Response } from "express";
import { TaskDocument } from "../types/task-interface";
import Task from "../model/Task";
import { StatusCodes } from "http-status-codes";

declare module 'express-serve-static-core' {
    export interface Request {
        task: String;
        description: String;
        completed: Boolean;
        createdBy: String;  
        user?: any
    }
  }

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks: TaskDocument[] = await Task.find({ createdBy: req.user.userId })
    
    return res.status(StatusCodes.OK).json({msg: tasks, nbHits: tasks.length})
    
}

export const createTask = async (req:Request, res: Response) => {
    req.body.createdBy = req.user.userId
        const task: TaskDocument = await Task.create(req.body)

        return res.status(StatusCodes.CREATED).json(task)
}

export const getTask  = async (req:Request, res: Response) => {
        const {
            user: {userId},
            params: {id: taskId}
        } = req;
        const task: TaskDocument | null = await Task.findById({_id: taskId, createdBy: userId })
    
        res.status(200).json({msg: task})
}

export const updateTask  = async (req:Request, res: Response) => {
        const {
            user: {userId},
            body: { description, completed },
            params: {id: taskId}
        } = req;

        if (description === '' || completed === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg: 'Please provide description and completed'})
            return
        }

        const task: TaskDocument | null = await Task.findByIdAndUpdate({createdBy: userId, _id: taskId}, req.body, {
            new: true,
            runValidators: true
        })
    
        res.status(202).json(task)
}

export const deleteTask  = async (req:Request, res: Response) => {
    const {
        user: {userId},
        params: {id: taskId}
    } = req;
     const task = await Task.findByIdAndDelete({createdBy: userId, _id: taskId})
    const allTasks = await Task.find({})

     res.status(202).json({deletedTask: task, remainingTasks: allTasks, nbRemainingTasks: allTasks.length})
}
