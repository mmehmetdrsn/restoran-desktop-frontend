// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import GarsonPanel from './pages/GarsonPanel';
import AsciPanel from './pages/AsciPanel';
import KuryePanel from './pages/KuryePanel';

// Private Route component - GÜNCELLENDİ
const PrivateRoute = ({ children, allowedRoles }) => {
  // Önce sessionStorage'ı kontrol et, yoksa localStorage'ı kontrol et
  let user = sessionStorage.getItem('user');
  if (!user) {
    user = localStorage.getItem('user');
  }
  
  if (user) {
    try {
      user = JSON.parse(user);
    } catch (error) {
      user = null;
    }
  }
  
  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Role kontrolü
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
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