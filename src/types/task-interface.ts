import { Document } from "mongoose";

export interface TaskDocument extends Document {
    task: String;
    description: String;
    completed: Boolean;
    createdBy: String;
  }
