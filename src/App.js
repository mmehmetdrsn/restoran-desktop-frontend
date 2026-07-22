// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login/Login';
import AdminPanel from './Admin/AdminPanel';
import GarsonPanel from './Garson/GarsonPanel';
import AsciPanel from './Asci/AsciPanel';
import KuryePanel from './Kurye/KuryePanel';
import SiparisTakip from './components/SiparisTakip'; // 👈 1. SignalR Bileşeni Eklendi

// ============ PROTECTED ROUTE ============
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!user.role) {
    return <Navigate to="/" replace />;
  }
  
  // Rol yetkisi kontrolü
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  // 👈 2. Giriş yapan kullanıcının ID'sini çekiyoruz
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const activeUyeId = user.uyeId || user.id || user.userId;

  return (
    <BrowserRouter>
      {/* 🚀 3. Giriş yapılmışsa arka planda SignalR Canlı Bildirim Dinleyicisi Çalışır */}
      {activeUyeId && <SiparisTakip uyeId={activeUyeId} />}

      <ToastContainer 
        position="top-right"
        autoClose={4000}
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
        {/* Login Sayfası */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Paneli */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        {/* Garson Paneli */}
        <Route path="/garson" element={
          <ProtectedRoute allowedRoles={['garson']}>
            <GarsonPanel />
          </ProtectedRoute>
        } />
        
        {/* Aşçı Paneli */}
        <Route path="/asci" element={
          <ProtectedRoute allowedRoles={['asci']}>
            <AsciPanel />
          </ProtectedRoute>
        } />
        
        {/* Kurye Paneli */}
        <Route path="/kurye" element={
          <ProtectedRoute allowedRoles={['kurye']}>
            <KuryePanel />
          </ProtectedRoute>
        } />
        
        {/* Tanımsız route'lar login'e yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;