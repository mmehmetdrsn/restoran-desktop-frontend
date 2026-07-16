// src/api/endpoints.js
import api from './axios';

// ============ AUTH ============
export const authAPI = {
  // Giriş yap
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Şifre sıfırlama bağlantısı gönder
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Şifre değiştir
  changePassword: (oldPassword, newPassword) => 
    api.put('/auth/change-password', { oldPassword, newPassword }),
  
  // Profil bilgilerini getir
  getProfile: () => api.get('/auth/profile'),
  
  // Çıkış yap
  logout: () => api.post('/auth/logout'),
};