import express, { Request, Response } from 'express'
import { authRouter, passwordResetRouter, taskRouter } from './routes'
export const app = express()
import cors from 'cors'
import { connectDB } from './db'
import dotenv from 'dotenv'
import { authenticationMiddleware, errorHandlerMiddleware, notFoundMiddleware } from './middlewares'

dotenv.config()

const port: string | number = process.env.PORT || 5555

app.use(express.static('./public'))

app.use(express.urlencoded({ extended: false}))
app.use(express.json());
app.use(cors())

import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })
})



app.get('/', (req: Request, res: Response) => {
    res.json({message: `Connected to server 👍`})
})

app.use('/auth', authRouter);
app.use('/tasks', authenticationMiddleware, taskRouter);
app.use('/account', passwordResetRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    await connectDB(process.env.MONGO_URI!)
    server.listen(port, () => {
    console.log(`server is running on port ${port}...
🚀@ http://localhost:${port}`)})
}
start()