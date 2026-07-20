// src/Admin/components/Ortak/Buton.js
import React from 'react';

const Buton = ({ icon, label, onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick || (() => {})}
      className={`flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-all border border-white/5 hover:border-white/20 w-full ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Buton;