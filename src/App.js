// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login/Login';
import AdminPanel from './Admin/AdminPanel';
import GarsonPanel from './Garson/GarsonPanel';
import AsciPanel from './Asci/AsciPanel';
import KuryePanel from './Kurye/KuryePanel';
import SiparisTakip from './components/SiparisTakip';
import QrRedirect from './pages/QrRedirect';  
import QrMenuScreen from './pages/QrMenuScreen';  
import QrSepetScreen from './pages/QrSepetScreen';
import { AppDialogProvider } from './components/dialog/AppDialogProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.role) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const activeUyeId = user.uyeId || user.id || user.userId;

  return (
    <BrowserRouter>
      <AppDialogProvider>
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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* ✅ QR Redirect Route - EKLENDİ */}
          <Route path="/qr/masa/:masaId" element={<QrRedirect />} />
          <Route path="/qr/menu" element={<QrMenuScreen />} />
          <Route path="/qr/sepet" element={<QrSepetScreen />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/garson" element={
            <ProtectedRoute allowedRoles={['garson']}>
              <GarsonPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/asci" element={
            <ProtectedRoute allowedRoles={['asci']}>
              <AsciPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/kurye" element={
            <ProtectedRoute allowedRoles={['kurye']}>
              <KuryePanel />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppDialogProvider>
    </BrowserRouter>
  );
}

export default App;