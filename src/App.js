// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    </BrowserRouter>
  );
}

export default App;