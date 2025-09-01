import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ioServer } from './socket.js'

const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

ioServer(io)

app.use(express.json());

app.get('/',(req, res) => {
    res.send("Hello from server")
})

server.listen(process.env.PORT || 3000,() => {
    console.log("Server Started at", process.env.PORT || 3000)
})