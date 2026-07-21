// src/api/api.js

// .env dosyasından API URL'sini al
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5141/api';

console.log('🚀 API Base URL:', API_BASE_URL);

// Genel API istek fonksiyonu
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 ${method} ${url}`);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        console.log(`📡 Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Hatası: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ API Hatası:', error);
        throw error;
    }
};

// ========== KURYE API FONKSİYONLARI ==========
export const kuryeAPI = {
    // Tüm kuryeleri listele
    getKuryeler: () => apiRequest('/Kurye/listele'),

    // Kuryenin aktif siparişlerini getir
    getAktifSiparisler: (personelId) =>
        apiRequest(`/Kurye/${Number(personelId)}/aktif-siparisler`),

    // Siparişi kuryeye ata
    siparisAta: (siparisId, personelId) =>
        apiRequest('/Kurye/siparis-ata', 'POST', {
            siparisId: Number(siparisId),
            personelId: Number(personelId),
        }),

    // Siparişi teslim et (personelId ve siparisId body'de Number olarak gönderilir)
    teslimEt: (siparisId, personelId) =>
        apiRequest(`/Kurye/teslim-et/${Number(siparisId)}`, 'PUT', {
            siparisId: Number(siparisId),
            personelId: Number(personelId),
        }),
};

// ========== DİĞER API FONKSİYONLARI (Mevcut olanlar) ==========

export const authService = {
    login: (data) => apiRequest('/Auth/login', 'POST', data),
    register: (data) => apiRequest('/Auth/register', 'POST', data),
};

export const orderService = {
    getAll: () => apiRequest('/Siparisler'),
    getById: (id) => apiRequest(`/Siparisler/${id}`),
    create: (data) => apiRequest('/Siparisler', 'POST', data),
    update: (id, data) => apiRequest(`/Siparisler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Siparisler/${id}`, 'DELETE'),
};

export const userService = {
    getAll: () => apiRequest('/Uye'),
    getById: (id) => apiRequest(`/Uye/${id}`),
    create: (data) => apiRequest('/Uye', 'POST', data),
    update: (id, data) => apiRequest(`/Uye/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Uye/${id}`, 'DELETE'),
};

export const categoryService = {
    getAll: () => apiRequest('/Kategoriler'),
    getById: (id) => apiRequest(`/Kategoriler/${id}`),
    create: (data) => apiRequest('/Kategoriler', 'POST', data),
    update: (id, data) => apiRequest(`/Kategoriler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kategoriler/${id}`, 'DELETE'),
};

export const productService = {
    getAll: () => apiRequest('/Urunler'),
    getById: (id) => apiRequest(`/Urunler/${id}`),
    create: (data) => apiRequest('/Urunler', 'POST', data),
    update: (id, data) => apiRequest(`/Urunler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Urunler/${id}`, 'DELETE'),
};

export const tableService = {
    getAll: () => apiRequest('/Masa'),
    getById: (id) => apiRequest(`/Masa/${id}`),
    create: (data) => apiRequest('/Masa', 'POST', data),
    update: (id, data) => apiRequest(`/Masa/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Masa/${id}`, 'DELETE'),
    moveTable: (data) => apiRequest('/Masa/tasi', 'POST', data),
    updateStatus: (id, status) =>
        apiRequest(`/Masa/${id}/durum`, 'PUT', { masaNo: `Masa ${id}`, masaDurumu: status }),
};

export const reservationService = {
    getAll: () => apiRequest('/Rezervasyon'),
    getById: (id) => apiRequest(`/Rezervasyon/${id}`),
    create: (data) => apiRequest('/Rezervasyon', 'POST', data),
    update: (id, data) => apiRequest(`/Rezervasyon/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Rezervasyon/${id}`, 'DELETE'),
};

export const personnelService = {
    getAll: () => apiRequest('/Personel'),
    getById: (id) => apiRequest(`/Personel/${id}`),
    create: (data) => apiRequest('/Personel', 'POST', data),
    update: (id, data) => apiRequest(`/Personel/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Personel/${id}`, 'DELETE'),
};

export const paymentService = {
    getAll: () => apiRequest('/Odeme'),
    getById: (id) => apiRequest(`/Odeme/${id}`),
    create: (data) => apiRequest('/Odeme', 'POST', data),
    update: (id, data) => apiRequest(`/Odeme/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Odeme/${id}`, 'DELETE'),
};

export const reportService = {
    getDaily: () => apiRequest('/Rapor/gunluk'),
    getMonthly: () => apiRequest('/Rapor/aylik'),
    getYearly: () => apiRequest('/Rapor/yillik'),
};

export const cashService = {
    getAll: () => apiRequest('/Kasa'),
    getById: (id) => apiRequest(`/Kasa/${id}`),
    create: (data) => apiRequest('/Kasa', 'POST', data),
    update: (id, data) => apiRequest(`/Kasa/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kasa/${id}`, 'DELETE'),
};

export const materialService = {
    getAll: () => apiRequest('/Malzemeler'),
    getById: (id) => apiRequest(`/Malzemeler/${id}`),
    create: (data) => apiRequest('/Malzemeler', 'POST', data),
    update: (id, data) => apiRequest(`/Malzemeler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Malzemeler/${id}`, 'DELETE'),
};

export const notificationService = {
    getAll: () => apiRequest('/Bildirim'),
    getById: (id) => apiRequest(`/Bildirim/${id}`),
    create: (data) => apiRequest('/Bildirim', 'POST', data),
    update: (id, data) => apiRequest(`/Bildirim/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Bildirim/${id}`, 'DELETE'),
    markAsRead: (id) => apiRequest(`/Bildirim/okundu/${id}`, 'PUT'),
};

// Kategori işlemleri için ek fonksiyonlar
export const getKategoriler = categoryService.getAll;
export const kategoriEkle = categoryService.create;
export const kategoriSil = categoryService.delete;

// Ürün işlemleri için ek fonksiyonlar
export const urunEkle = productService.create;

// Auth işlemleri
export const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
};

export const sifreDegistir = (data) => apiRequest('/Auth/sifre-degistir', 'POST', data);

// Varsayılan export
const api = {
    authService,
    orderService,
    userService,
    categoryService,
    productService,
    tableService,
    reservationService,
    personnelService,
    paymentService,
    reportService,
    cashService,
    materialService,
    notificationService,
    kuryeAPI,
    getKategoriler,
    kategoriEkle,
    kategoriSil,
    urunEkle,
    logout,
    sifreDegistir,
};

export default api;