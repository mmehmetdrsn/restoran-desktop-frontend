// src/Admin/components/Ortak/BolumBasligi.js
import React from 'react';

const BolumBasligi = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl text-yellow-500">{icon}</div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
    </div>
  );
};

export default BolumBasligi;