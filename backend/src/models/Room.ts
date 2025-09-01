export interface Room {
  id: string;     // room name
  createdBy: string; // admin id
  members: string[]; // socket ids
}