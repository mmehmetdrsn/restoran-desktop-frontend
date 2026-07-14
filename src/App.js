// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login/Login';
import AdminPanel from './Admin/AdminPanel';
import GarsonPanel from './Garson/GarsonPanel';
import AsciPanel from './Asci/AsciPanel';
import KuryePanel from './Kurye/KuryePanel';

function App() {
  // Kullanıcı kontrolü
  const getUser = () => {
    try {
      let userData = localStorage.getItem('user');
      if (!userData) {
        userData = sessionStorage.getItem('user');
      }
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Kullanıcı okuma hatası:', error);
    }
    return null;
  };

  const user = getUser();
  const userRole = user?.role?.toLowerCase();

  console.log('👤 Kullanıcı:', user);
  console.log('🎯 Rol:', userRole);

  // Role göre ana sayfa
  const getHomeRoute = () => {
    if (!user) return '/login';
    switch(userRole) {
      case 'admin': return '/admin';
      case 'garson': return '/garson';
      case 'asci': return '/asci';
      case 'kurye': return '/kurye';
      default: return '/login';
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={userRole === 'admin' ? <AdminPanel /> : <Navigate to={getHomeRoute()} />} />
        <Route path="/garson" element={userRole === 'garson' ? <GarsonPanel /> : <Navigate to={getHomeRoute()} />} />
        <Route path="/asci" element={userRole === 'asci' ? <AsciPanel /> : <Navigate to={getHomeRoute()} />} />
        <Route path="/kurye" element={userRole === 'kurye' ? <KuryePanel /> : <Navigate to={getHomeRoute()} />} />
        <Route path="/" element={<Navigate to={getHomeRoute()} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;