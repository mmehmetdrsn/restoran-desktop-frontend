// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ✅ Tüm import'lar EN ÜSTTE
import 'react-toastify/dist/ReactToastify.css';   // ✅ Tüm import'lar EN ÜSTTE
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import GarsonPanel from './pages/GarsonPanel';
import AsciPanel from './pages/AsciPanel';
import KuryePanel from './pages/KuryePanel';

// Private Route component - giriş yapmamış kullanıcıları korur
const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Role kontrolü - eğer allowedRoles varsa ve kullanıcının rolü uygun değilse
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Yetkisiz erişim - ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Paneli - Sadece admin girebilir */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />
        
        {/* Garson Paneli - Sadece garson girebilir */}
        <Route path="/garson" element={
          <PrivateRoute allowedRoles={['garson']}>
            <GarsonPanel />
          </PrivateRoute>
        } />
        
        {/* Aşçı Paneli - Sadece aşçı girebilir */}
        <Route path="/asci" element={
          <PrivateRoute allowedRoles={['asci']}>
            <AsciPanel />
          </PrivateRoute>
        } />
        
        {/* Kurye Paneli - Sadece kurye girebilir */}
        <Route path="/kurye" element={
          <PrivateRoute allowedRoles={['kurye']}>
            <KuryePanel />
          </PrivateRoute>
        } />
      </Routes>
      
      {/* ✅ ToastContainer BURADA olmalı - import'lardan sonra, return içinde */}
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
    </BrowserRouter>
  );
}

export default App; // ✅ Burada bitmeli, import'lardan sonra