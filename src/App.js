// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login/Login';
import AdminPanel from './Admin/AdminPanel';
import GarsonPanel from './Garson/GarsonPanel';
import AsciPanel from './Asci/AsciPanel';
import KuryePanel from './Kurye/KuryePanel';

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