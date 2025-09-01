import type { Server, Socket } from "socket.io";
import  { type User } from "./models/User.js";
import { RoomManager } from "./RoomManager.js";
export function ioServer(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("User Connected ", socket.id)

        let currentUser: User | null = null

        socket.on('register', (data: {name: string, role: 'admin' | 'user'}) => {
            currentUser = {socketId: socket.id, ...data}
            console.log(currentUser)
        })

        socket.on('create-room', (roomId: string) => {
            console.log("create room", currentUser)
            if(!currentUser || currentUser.role !== "admin") {
                socket.emit("error", "Only Admin Create Room")
                return
            }
            const room = RoomManager.getInstance().createRoom(roomId, currentUser.socketId)
            if(!room) {
                socket.emit('error', 'Room already exists')
            }
            socket.join(roomId)
            socket.emit("room-created", room);
        })

        socket.on("join-room", (roomCode: string) => {
            if (!currentUser) return;
            console.log("server",roomCode)
            const success = RoomManager.getInstance().joinRoom(roomCode, currentUser.socketId);
            console.log("jjj", success)
            if (success) {
                console.log("success",success)
                socket.join(roomCode);

                // Notify the user
                socket.emit("joined-room", roomCode);

                // Broadcast updated user list to everyone in the room
                const users = RoomManager.getInstance().getUsersInRoom(roomCode);
                io.to(roomCode).emit("room-users", users);
            } else {
                socket.emit("error", "Room not found");
            }
        })

        socket.on('get-rooms', () => {
            const rooms = RoomManager.getInstance().getRooms()
            socket.emit('rooms', rooms)
        })

        socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        })
    })
}