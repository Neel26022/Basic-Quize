import type { Server, Socket } from "socket.io";

export function ioServer(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("User Connected ", socket.id)
    })
}