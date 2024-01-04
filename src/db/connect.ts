import mongoose from "mongoose"

export const connectDB = (url: string) => {
    return mongoose.connect(url)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err))
}