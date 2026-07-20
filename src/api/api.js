// src/api/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Backend Hatası:", error.response.data);
    } else if (error.request) {
      console.error("Sunucuya bağlanılamadı!");
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVİSLERİ
// ============================================
export const authService = {
  login: (kullaniciAdi, sifre) => api.post('/Auth/login', { 
    KullaniciAdi: kullaniciAdi,
    Sifre: sifre
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },
  
  sifreDegistir: (eskiSifre, yeniSifre) => 
    api.post('/Auth/sifre-degistir', { 
      EskiSifre: eskiSifre, 
      YeniSifre: yeniSifre 
    }),
  
  refresh: (refreshToken) => 
    api.post('/Auth/refresh', { RefreshToken: refreshToken }),
};

// ============================================
// SİPARİŞ SERVİSLERİ
// ============================================
export const orderService = {
  getAll: () => api.get('/siparisler'),
  getById: (id) => api.get(`/siparisler/${id}`),
  updateStatus: (id, status) => api.put(`/siparisler/${id}/durum`, { siparisDurumu: status }),
  cancel: (id) => api.put(`/siparisler/${id}/iptal`),
  create: (data) => api.post('/siparisler', data),
  delete: (id) => api.delete(`/siparisler/${id}`),
};

// ============================================
// ÜRÜN SERVİSLERİ
// ============================================
export const productService = {
  getAll: () => api.get('/Urunler'),
  getById: (id) => api.get(`/Urunler/${id}`),
  create: (data) => api.post('/Urunler', data),
  update: (id, data) => api.put(`/Urunler/${id}`, data),
  delete: (id) => api.delete(`/Urunler/${id}`),
};

// ============================================
// KATEGORİ SERVİSLERİ
// ============================================
export const categoryService = {
  getAll: () => api.get('/Kategoriler'),
  getById: (id) => api.get(`/Kategoriler/${id}`),
  create: (data) => api.post('/Kategoriler', data),
  update: (id, data) => api.put(`/Kategoriler/${id}`, data),
  delete: (id) => api.delete(`/Kategoriler/${id}`),
};

// ============================================
// MALZEME SERVİSLERİ
// ============================================
export const materialService = {
  getAll: () => api.get('/Malzemeler'),
  getById: (id) => api.get(`/Malzemeler/${id}`),
  create: (data) => api.post('/Malzemeler', data),
  update: (id, data) => api.put(`/Malzemeler/${id}`, data),
  delete: (id) => api.delete(`/Malzemeler/${id}`),
};

// ============================================
// MASA SERVİSLERİ
// ============================================
export const tableService = {
  getAll: () => api.get('/Masa'),
  getById: (id) => api.get(`/Masa/${id}`),
  create: (data) => api.post('/Masa', data),
  update: (id, data) => api.put(`/Masa/${id}`, data),
  delete: (id) => api.delete(`/Masa/${id}`),
  moveTable: (data) => api.post('/Masa/tasi', data).then(res => res.data),
};

// ============================================
// REZERVASYON SERVİSLERİ
// ============================================
export const reservationService = {
  getAll: () => api.get('/Rezervasyon'),
  getById: (id) => api.get(`/Rezervasyon/${id}`),
  create: (data) => api.post('/Rezervasyon', data),
  update: (id, data) => api.put(`/Rezervasyon/${id}`, data),
  delete: (id) => api.delete(`/Rezervasyon/${id}`),
};

// ============================================
// PERSONEL SERVİSLERİ
// ============================================
export const personnelService = {
  getAll: () => api.get('/Personel'),
  getById: (id) => api.get(`/Personel/${id}`),
  create: (data) => api.post('/Personel', data),
  update: (id, data) => api.put(`/Personel/${id}`, data),
  delete: (id) => api.delete(`/Personel/${id}`),
};

// ============================================
// KULLANICI SERVİSLERİ
// ============================================
export const userService = {
  getAll: () => api.get('/Uyeler'),
  getById: (id) => api.get(`/Uyeler/${id}`),
  create: (data) => api.post('/Uyeler', data),
  update: (id, data) => api.put(`/Uyeler/${id}`, data),
  delete: (id) => api.delete(`/Uyeler/${id}`),
};

// ============================================
// ÖDEME SERVİSLERİ
// ============================================
export const paymentService = {
  getAll: () => api.get('/Odeme'),
  getById: (id) => api.get(`/Odeme/${id}`),
  create: (data) => api.post('/Odeme', data),
  processPayment: (data) => api.post('/Odeme', data).then(res => res.data),
  processRefund: (data) => api.post('/Odeme/iade-iptal', data).then(res => res.data),
  update: (id, data) => api.put(`/Odeme/${id}`, data),
  delete: (id) => api.delete(`/Odeme/${id}`),
};

// ============================================
// KASA SERVİSLERİ
// ============================================
export const cashService = {
  getAll: () => api.get('/Kasa'),
  getById: (id) => api.get(`/Kasa/${id}`),
  create: (data) => api.post('/Kasa', data),
  update: (id, data) => api.put(`/Kasa/${id}`, data),
  delete: (id) => api.delete(`/Kasa/${id}`),
};

// ============================================
// BİLDİRİM SERVİSLERİ
// ============================================
export const notificationService = {
  getAll: () => api.get('/bildirimler'),
  markAsRead: (id) => api.put(`/bildirimler/${id}/okundu`),
  markAllAsRead: () => api.put('/bildirimler/tumunu-okundu'),
};

// ============================================
// RAPOR SERVİSLERİ
// ============================================
export const reportService = {
  getGunlukCiro: (tarih) => api.get('/Rapor/gunluk-ciro', { params: { tarih } }),
  getEnCokSatanlar: (gun) => api.get('/Rapor/en-cok-satanlar', { params: { gun } }),
  getSonSiparisler: (adet) => api.get('/Rapor/son-siparisler', { params: { adet } }),
};

// ============================================
// DESTEK FONKSİYONLAR
// ============================================
export const logout = authService.logout;
export const sifreDegistir = authService.sifreDegistir;
export const getKategoriler = categoryService.getAll;
export const kategoriEkle = categoryService.create;
export const kategoriSil = categoryService.delete;
export const urunEkle = productService.create;

export default api;