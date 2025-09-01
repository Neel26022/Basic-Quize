export interface User{
    socketId: string,
    name: string,
    role: "user" | "admin"
}