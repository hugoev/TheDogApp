// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SingleDog from './pages/SingleDog'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:name" element={<SingleDog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App