import { useEffect, useState } from 'react'
import './App.css'
import { socket } from "./utils/socket"
import { Route, Routes } from "react-router-dom"
import Room from './components/room'
import AdminPanel from './components/Admin'

function App() {

  useEffect(() => {
      socket.on('connect', () => {
          console.log("socket connected to the server", socket.id)
      })
  })

  return (
    <>
      <Routes>
        <Route path='/room' element={<Room />}></Route>
        <Route path='/admin' element={<AdminPanel />}></Route>
      </Routes>
    </>
  )
}

export default App
