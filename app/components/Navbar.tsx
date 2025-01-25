"use client"
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-black w-full p-4">
      <div className="w-full mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <a href="/">Home</a>
        </div>
        <div className="space-x-4">
          <a href="/input" className="text-white hover:text-gray-300">Input</a>
          <a href="/dashboard" className="text-white hover:text-gray-300">Dashboard</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 