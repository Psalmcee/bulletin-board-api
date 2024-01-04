import mongoose from "mongoose";
import { TaskDocument } from "../types/task-interface";


export const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        //enum: ['TODO', 'INPROGRESS', 'DONE'],
        default: false
      },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide a user']
    }
})

taskSchema.set('timestamps', true);

export default mongoose.model<TaskDocument>('Task', taskSchema);
