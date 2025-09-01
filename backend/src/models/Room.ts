export interface Room {
  id: string;     // room name
  roomCode: string //room code
  createdBy: string; // admin id
  members: string[]; // socket ids
}