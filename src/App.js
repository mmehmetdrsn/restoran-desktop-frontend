// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sayfaları import et
import Login from './Login/Login';
import AdminPanel from './Admin/AdminPanel';
import GarsonPanel from './Garson/GarsonPanel';
import AsciPanel from './Asci/AsciPanel';
import KuryePanel from './Kurye/KuryePanel';

function App() {
  // Kullanıcıyı al - daha güvenli
  const getUser = () => {
    try {
      // Önce localStorage'ı kontrol et
      let userData = localStorage.getItem('user');
      
      // localStorage'da yoksa sessionStorage'ı kontrol et
      if (!userData) {
        userData = sessionStorage.getItem('user');
      }
      
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('✅ Kullanıcı bulundu:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Kullanıcı okuma hatası:', error);
      // Hatalı veriyi temizle
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
    
    console.log('❌ Kullanıcı bulunamadı');
    return null;
  };

  const user = getUser();
  console.log('👤 Mevcut kullanıcı:', user);

  // Kullanıcının rolünü al (güvenli)
  const userRole = user?.role?.toLowerCase() || null;
  console.log('🎯 Kullanıcı rolü:', userRole);

  // Role göre yönlendirme
  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    switch(userRole) {
      case 'admin': return '/admin';
      case 'garson': return '/garson';
      case 'asci': return '/asci';
      case 'kurye': return '/kurye';
      default: return '/login';
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    // Kullanıcı yoksa login'e yönlendir
    if (!user) {
      console.log('🔴 Kullanıcı yok, login\'e yönlendiriliyor');
      return <Navigate to="/login" replace />;
    }

    // Rol kontrolü
    if (userRole !== allowedRole) {
      console.log(`⛔ Yetkisiz erişim! ${userRole} kullanıcısı ${allowedRole} sayfasına erişemez`);
      // Ana sayfaya yönlendir (kendi rolünün sayfasına)
      return <Navigate to={getDefaultRoute()} replace />;
    }

    console.log(`✅ Erişim izni verildi: ${userRole} -> ${allowedRole}`);
    return children;
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
        {/* Login sayfası - her zaman erişilebilir */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Paneli - sadece admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Garson Paneli - sadece garson */}
        <Route 
          path="/garson" 
          element={
            <ProtectedRoute allowedRole="garson">
              <GarsonPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Aşçı Paneli - sadece aşçı */}
        <Route 
          path="/asci" 
          element={
            <ProtectedRoute allowedRole="asci">
              <AsciPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Kurye Paneli - sadece kurye */}
        <Route 
          path="/kurye" 
          element={
            <ProtectedRoute allowedRole="kurye">
              <KuryePanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Ana sayfa - role göre yönlendir */}
        <Route 
          path="/" 
          element={<Navigate to={getDefaultRoute()} replace />} 
        />
        
        {/* Tanımsız route - ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;