import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div>Login Sayfası</div>} />
        <Route path="/admin" element={<div>Admin Paneli</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;