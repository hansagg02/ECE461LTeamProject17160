import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Projects from './Components/Project';
import HardwareSet from './Components/HardwareSet';

function App() {
  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/projects" element={ <Projects/>}></Route>
            <Route path="/hardware" element={ <HardwareSet/>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
