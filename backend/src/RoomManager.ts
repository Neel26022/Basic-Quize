import type { Room } from "./models/Room.js";

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
            return null
        }

        const room: Room =  {id: roomId, createdBy: adminId, members: []}
        this.rooms.set(roomId, room)
        return room;
    }

    joinRoom(userId: string, roomId: string): boolean {
        const room = this.rooms.get(roomId)
        if(!room) return false 
        if(!room.members.includes(userId)) {
            room.members.push(userId)
            return true
        } 
        return false
    }

    getRooms(): Room[] {
        return Array.from(this.rooms.values())
    }

}