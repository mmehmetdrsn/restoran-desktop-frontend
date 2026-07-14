// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import GarsonPanel from './pages/GarsonPanel';
import AsciPanel from './pages/AsciPanel';
import KuryePanel from './pages/KuryePanel';

const PrivateRoute = ({ children, allowedRoles }) => {
  // Kullanıcı bilgisini al - ÖNCE sessionStorage, sonra localStorage
  let userData = sessionStorage.getItem('user');
  if (!userData) {
    userData = localStorage.getItem('user');
  }
  
  console.log('🔍 PrivateRoute Kontrolü Başladı');
  console.log('  - userData (ham):', userData);
  console.log('  - allowedRoles:', allowedRoles);
  console.log('  - path:', window.location.pathname);
  
  if (!userData) {
    console.log('❌ Kullanıcı verisi yok! Login\'e yönlendiriliyor.');
    return <Navigate to="/" replace />;
  }
  
  try {
    const user = JSON.parse(userData);
    console.log('  - parsed user:', user);
    console.log('  - user.role:', user.role);
    
    // Role kontrolü - case insensitive (büyük/küçük harf duyarsız)
    const userRole = user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    console.log('  - normalized userRole:', userRole);
    console.log('  - normalized allowedRoles:', normalizedAllowedRoles);
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      console.log(`❌ Yetkisiz erişim! Rol: ${userRole}, İzin verilenler: ${normalizedAllowedRoles}`);
      // Yetkisiz erişimde login'e yönlendir ve hata mesajı göster
      return <Navigate to="/" state={{ error: 'Bu sayfaya erişim yetkiniz yok!' }} replace />;
    }
    
    console.log('✅ Yetkili erişim onaylandı!');
    return children;
    
  } catch (error) {
    console.error('❌ Kullanıcı verisi parse hatası:', error);
    // Hatalı veriyi temizle
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/garson" element={
          <PrivateRoute allowedRoles={['garson']}>
            <GarsonPanel />
          </PrivateRoute>
        } />
        <Route path="/asci" element={
          <PrivateRoute allowedRoles={['asci']}>
            <AsciPanel />
          </PrivateRoute>
        } />
        <Route path="/kurye" element={
          <PrivateRoute allowedRoles={['kurye']}>
            <KuryePanel />
          </PrivateRoute>
        } />
        {/* 404 - Tanımlanmamış route'lar login'e yönlendirsin */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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

export default App;