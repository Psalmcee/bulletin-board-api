import mongoose from "mongoose";
import { TaskDocument } from "../types/task-interface";

//schema provides the structure of each data that is going to be stored in the database
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
        default: false
      },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide a user']
    }
})

//timestamps provide times at each data schema is created
taskSchema.set('timestamps', true);

export default mongoose.model<TaskDocument>('Task', taskSchema);
