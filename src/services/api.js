// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 1. AUTH SERVİSLERİ - /api/Auth
// ============================================
export const authService = {
  login: (email, password) => api.post('/Auth/login', { email, password }),
  register: (data) => api.post('/Auth/register', data),
  refresh: (refreshToken) => api.post('/Auth/refresh', { refreshToken }),
  changePassword: (oldPassword, newPassword) => 
    api.post('/Auth/sifre-degistir', { eskiSifre: oldPassword, yeniSifre: newPassword }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/Auth/Logout');
  },
};

// ============================================
// 2. SİPARİŞ SERVİSLERİ - /api/Siparisler
// ============================================
export const orderService = {
  getAll: () => api.get('/siparisler'),
  getById: (id) => api.get(`/siparisler/${id}`),
  create: (data) => api.post('/siparisler', data),
  update: (id, data) => api.put(`/siparisler/${id}`, data),
  updateStatus: (id, status) => api.put(`/siparisler/${id}/durum`, { siparisDurumu: status }),
  cancel: (id) => api.put(`/siparisler/${id}/iptal`),
  delete: (id) => api.delete(`/siparisler/${id}`),
};

// ============================================
// 3. ÜRÜN SERVİSLERİ - /api/Urunler
// ============================================
export const productService = {
  getAll: () => api.get('/Urunler'),
  getById: (id) => api.get(`/Urunler/${id}`),
  create: (data) => api.post('/Urunler', data),
  update: (id, data) => api.put(`/Urunler/${id}`, data),
  delete: (id) => api.delete(`/Urunler/${id}`),
};

// ============================================
// 4. KATEGORİ SERVİSLERİ - /api/Kategoriler
// ============================================
export const categoryService = {
  getAll: () => api.get('/Kategoriler'),
  getById: (id) => api.get(`/Kategoriler/${id}`),
  create: (data) => api.post('/Kategoriler', data),
  update: (id, data) => api.put(`/Kategoriler/${id}`, data),
  delete: (id) => api.delete(`/Kategoriler/${id}`),
};

// ============================================
// 5. MALZEME SERVİSLERİ - /api/Malzemeler
// ============================================
export const materialService = {
  getAll: () => api.get('/Malzemeler'),
  getById: (id) => api.get(`/Malzemeler/${id}`),
  create: (data) => api.post('/Malzemeler', data),
  update: (id, data) => api.put(`/Malzemeler/${id}`, data),
  delete: (id) => api.delete(`/Malzemeler/${id}`),
};

// ============================================
// 6. STOK HAREKETLERİ - /api/StokHareketleri
// ============================================
export const stockMovementService = {
  getAll: () => api.get('/StokHareketleri'),
  getById: (id) => api.get(`/StokHareketleri/${id}`),
  create: (data) => api.post('/StokHareketleri', data),
  update: (id, data) => api.put(`/StokHareketleri/${id}`, data),
  delete: (id) => api.delete(`/StokHareketleri/${id}`),
};

// ============================================
// 7. MASA SERVİSLERİ - /api/Masa
// ============================================
export const tableService = {
  getAll: () => api.get('/Masa'),
  getById: (id) => api.get(`/Masa/${id}`),
  create: (data) => api.post('/Masa', data),
  update: (id, data) => api.put(`/Masa/${id}`, data),
  delete: (id) => api.delete(`/Masa/${id}`),
};

// ============================================
// 8. REZERVASYON SERVİSLERİ - /api/Rezervasyon
// ============================================
export const reservationService = {
  getAll: () => api.get('/Rezervasyon'),
  getById: (id) => api.get(`/Rezervasyon/${id}`),
  create: (data) => api.post('/Rezervasyon', data),
  update: (id, data) => api.put(`/Rezervasyon/${id}`, data),
  delete: (id) => api.delete(`/Rezervasyon/${id}`),
};

// ============================================
// 9. PERSONEL SERVİSLERİ - /api/Personel
// ============================================
export const personnelService = {
  getAll: () => api.get('/Personel'),
  getById: (id) => api.get(`/Personel/${id}`),
  create: (data) => api.post('/Personel', data),
  update: (id, data) => api.put(`/Personel/${id}`, data),
  delete: (id) => api.delete(`/Personel/${id}`),
};

// ============================================
// 10. PERSONEL İZİN - /api/Personellizin
// ============================================
export const personnelLeaveService = {
  getAll: () => api.get('/Personellizin'),
  getById: (id) => api.get(`/Personellizin/${id}`),
  create: (data) => api.post('/Personellizin', data),
  update: (id, data) => api.put(`/Personellizin/${id}`, data),
  delete: (id) => api.delete(`/Personellizin/${id}`),
};

// ============================================
// 11. KASA SERVİSLERİ - /api/Kasa
// ============================================
export const cashService = {
  getAll: () => api.get('/Kasa'),
  getById: (id) => api.get(`/Kasa/${id}`),
  create: (data) => api.post('/Kasa', data),
  update: (id, data) => api.put(`/Kasa/${id}`, data),
  delete: (id) => api.delete(`/Kasa/${id}`),
};

// ============================================
// 12. ÖDEME SERVİSLERİ - /api/Odeme
// ============================================
export const paymentService = {
  getAll: () => api.get('/Odeme'),
  getById: (id) => api.get(`/Odeme/${id}`),
  create: (data) => api.post('/Odeme', data),
  update: (id, data) => api.put(`/Odeme/${id}`, data),
  delete: (id) => api.delete(`/Odeme/${id}`),
};

// ============================================
// 13. ADRES SERVİSLERİ - /api/Adres
// ============================================
export const addressService = {
  getAll: () => api.get('/Adres'),
  getById: (id) => api.get(`/Adres/${id}`),
  create: (data) => api.post('/Adres', data),
  update: (id, data) => api.put(`/Adres/${id}`, data),
  delete: (id) => api.delete(`/Adres/${id}`),
};

// ============================================
// 14. ÜYE SERVİSLERİ - /api/Uyeler
// ============================================
export const userService = {
  getAll: () => api.get('/Uyeler'),
  getById: (id) => api.get(`/Uyeler/${id}`),
  create: (data) => api.post('/Uyeler', data),
  update: (id, data) => api.put(`/Uyeler/${id}`, data),
  delete: (id) => api.delete(`/Uyeler/${id}`),
};

// ============================================
// 15. REÇETE SERVİSLERİ - /api/Receteler
// ============================================
export const recipeService = {
  getAll: () => api.get('/Receteler'),
  getById: (id) => api.get(`/Receteler/${id}`),
  create: (data) => api.post('/Receteler', data),
  update: (id, data) => api.put(`/Receteler/${id}`, data),
  delete: (id) => api.delete(`/Receteler/${id}`),
};

// ============================================
// 16. RAPOR SERVİSLERİ (Özel)
// ============================================
export const reportService = {
  getDailySales: (date) => api.get(`/raporlar/gunluk-satis?tarih=${date}`),
  getProductSales: (startDate, endDate) => 
    api.get(`/raporlar/urun-satis?baslangic=${startDate}&bitis=${endDate}`),
  getReservations: () => api.get('/raporlar/rezervasyon'),
  getRevenueStats: () => api.get('/raporlar/gelir-istatistikleri'),
};

// ============================================
// 17. BİLDİRİM SERVİSLERİ (Özel)
// ============================================
export const notificationService = {
  getAll: () => api.get('/bildirimler'),
  markAsRead: (id) => api.put(`/bildirimler/${id}/okundu`),
  markAllAsRead: () => api.put('/bildirimler/tumunu-okundu'),
};

export default api;