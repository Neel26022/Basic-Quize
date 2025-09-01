import { Socket } from "socket.io";
import type { Room } from "./models/Room.js";
import { generateRoomCode } from "./utils/roomGen.js";

export class RoomManager {
    private rooms: Map<string, Room> = new Map()
    private static _instance: RoomManager

    static getInstance() {
        if(!this._instance) {
            this._instance = new RoomManager()
            return this._instance
        }
        return this._instance
    }

    createRoom(roomId: string, adminId: string): Room | null {
        if(this.rooms.has(roomId)) {
            console.log("null")
            return null
        }
        const genreatedRoomCode = generateRoomCode()
        const room: Room =  {id: roomId, createdBy: adminId, members: [],roomCode: genreatedRoomCode}
        this.rooms.set(genreatedRoomCode, room)
        console.log("room;;;;;;; ",this.rooms)
        return room;
    }

    joinRoom(roomCode: string,userId: string): boolean {

        const room = this.rooms.get(String(roomCode))
        console.log("dd", room)
        if (!room) return false;

        if (!room.members.includes(userId)) {
            room.members.push(userId);
            return true;
        }
        return false;
    }


    getRooms(): Room[] {
        return Array.from(this.rooms.values())
    }

    getUsersInRoom(roomCode: string) {
        const room = this.rooms.get(roomCode)
        if(!room) {
            return false
        }
        return room.members || []
    }

}