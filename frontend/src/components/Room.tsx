import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";

export default function Room() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [status, setStatus] = useState("");
  const [joined, setJoined] = useState(false);
  const [registered, setRegistered] = useState(false); // ✅ track register

  useEffect(() => {
    socket.on("joined-room", (code) => {
      setJoined(true);
      setStatus(`🎉 Joined room: ${code}`);
    });

    socket.on("error", (msg) => {
      setStatus(`❌ ${msg}`);
    });

    return () => {
      socket.off("joined-room");
      socket.off("error");
    };
  }, []);

  const handleRegister = () => {
    if (!name) {
      setStatus("⚠️ Please enter your name");
      return;
    }
    socket.emit("register", { name, role: "user" });
    setRegistered(true); // ✅ mark registered
    setStatus(`✅ Registered as user (${name})`);
  };

  const handleJoinRoom = () => {
    if (!roomCode) {
      setStatus("⚠️ Please enter a room code");
      return;
    }
    console.log(roomCode);
    socket.emit("join-room", roomCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-indigo-600">
          🎯 Quiz Lobby (User)
        </h1>

        {/* Register */}
        {!registered && !joined && (
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
              🚀 Register
            </button>
          </div>
        )}

        {/* Join Room (only after register) */}
        {registered && !joined && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter room code"
              className="w-full border rounded-lg p-3 mb-2 uppercase focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <button
              onClick={handleJoinRoom}
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            >
              🔑 Join Room
            </button>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className="mt-4 text-center text-gray-700 font-medium">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
