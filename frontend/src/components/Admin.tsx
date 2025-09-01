import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    socket.on("room-created", (room) => {
      console.log("Room created:", room.roomCode);
      setRoomCode(room.roomCode);
    });

    socket.on("room-users", (userList) => {
      setUsers(userList);
    });

    socket.on("rooms", (rooms) => {
      console.log("Available rooms:", rooms);
      setRooms(rooms);
    });

    socket.on("error", (msg) => {
      setStatus(`❌ ${msg}`);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-users");
      socket.off("rooms");
      socket.off("error");
    };
  }, []);

  const handleRegister = () => {
    if (!name) {
      setStatus("⚠️ Please enter your name");
      return;
    }
    socket.emit("register", { name, role: "admin" });
    setRegistered(true);
    setStatus(`✅ Registered as admin (${name})`);
  };

  const handleCreateRoom = () => {
    if (!registered) {
      setStatus("⚠️ Please register first");
      return;
    }
    socket.emit("create-room", roomName);
  };

  const handleGetRooms = () => {
    socket.emit("get-rooms");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          👨‍🏫 Admin Panel
        </h1>

        {/* Register */}
        {!registered && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleRegister}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              🚀 Register as Admin
            </button>
          </div>
        )}

        {/* Create Room */}
        {registered && (
          <>
            <input
              type="text"
              placeholder="Enter Room name"
              className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button
              onClick={handleCreateRoom}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mb-6"
            >
              ➕ Create Room
            </button>
          </>
        )}

        {/* Room Code */}
        {roomCode && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">Share this code with users:</p>
            <div className="text-4xl font-mono font-bold text-indigo-600 bg-indigo-50 py-3 px-6 rounded-lg inline-block shadow-md">
              {roomCode}
            </div>
          </div>
        )}

        {/* User List */}
        {registered && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">👥 Users in Room</h2>
            <ul className="border rounded-lg divide-y shadow-sm">
              {users.length > 0 ? (
                users.map((u, i) => (
                  <li
                    key={i}
                    className="p-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-medium">{u.name}</span>
                    <span className="text-sm text-gray-500">{u.role}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm p-3">No users yet...</p>
              )}
            </ul>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className="mt-4 text-center text-gray-700 font-medium">
            {status}
          </div>
        )}

        {/* Show All Rooms */}
        {registered && (
          <div className="mt-6">
            <button
              onClick={handleGetRooms}
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            >
              📋 Show All Rooms
            </button>
            <ul className="mt-4 border rounded-lg divide-y shadow-sm">
              {rooms.length > 0 ? (
                rooms.map((r: any, i) => (
                  <li key={i} className="p-3">
                    <p>
                      <span className="font-bold">Room ID:</span> {r.id}
                    </p>
                    <p>
                      <span className="font-bold">Code:</span> {r.roomCode}
                    </p>
                    <p>
                      <span className="font-bold">Created By:</span>{" "}
                      {r.createdBy}
                    </p>
                    <p>
                      <span className="font-bold">Members:</span>{" "}
                      {r.members.length > 0
                        ? r.members.join(", ")
                        : "No members yet"}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm p-3">
                  No rooms created yet...
                </p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
