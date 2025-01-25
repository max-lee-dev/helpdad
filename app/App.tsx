import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './page'; // Assuming Home is your main page
import Input from './input/page';
import Dashboard from './dashboard/page';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<Input />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App; 