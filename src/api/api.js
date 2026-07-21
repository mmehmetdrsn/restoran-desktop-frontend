// src/api/api.js

// .env dosyasından API URL'sini al
const API_BASE_URL = process.env.REACT_APP_API_URL 

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

    // Token varsa ekle
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        console.log(`📡 Response Status: ${response.status} - ${url}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HTTP Hatası: ${response.status} - ${errorText}`);
            
            // 401 Unauthorized - Token geçersiz
            if (response.status === 401) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
            }
            
            return { data: null, status: response.status, error: errorText };
        }

        if (response.status === 204) {
            console.log('📡 204 No Content - Veri yok');
            return { data: [], status: 204 };
        }

        const data = await response.json();
        console.log(`📡 Response Data:`, data);
        return { data, status: response.status };
    } catch (error) {
        console.error('❌ API Hatası:', error);
        return { data: [], error: true };
    }
};

// ========== AUTH SERVİSİ ==========
export const authService = {
    login: (data) => apiRequest('/Auth/login', 'POST', data),
    register: (data) => apiRequest('/Auth/register', 'POST', data),
    refresh: (data) => apiRequest('/Auth/refresh', 'POST', data),
    logout: () => apiRequest('/Auth/logout', 'POST'),
    sifreDegistir: (data) => apiRequest('/Auth/sifre-degistir', 'POST', data),
};

// ========== SİPARİŞ SERVİSİ ==========
export const orderService = {
    getAll: () => apiRequest('/Siparisler'),
    getById: (id) => apiRequest(`/Siparisler/${id}`),
    create: (data) => apiRequest('/Siparisler', 'POST', data),
    update: (id, data) => apiRequest(`/Siparisler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Siparisler/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Siparisler/${id}/durum`, 'PUT', { siparisDurumu: status }),
    cancel: (id) => apiRequest(`/Siparisler/${id}/iptal`, 'PUT'),
    complete: (id) => apiRequest(`/Siparisler/${id}/tamamla`, 'PUT'),
};

// ========== AŞÇI SERVİSİ ==========
export const asciAPI = {
    // Tüm siparişleri getir
    getSiparisler: () => apiRequest('/Siparisler'),
    
    // Tek sipariş detayını getir
    getSiparisDetay: (id) => apiRequest(`/Siparisler/${id}`),
    
    // Sipariş durumunu güncelle (BEKLEMEDE -> HAZIRLANIYOR -> HAZIR)
    updateSiparisDurum: (id, durum) => 
        apiRequest(`/Siparisler/${id}/durum`, 'PUT', { siparisDurumu: durum }),
    
    // Sipariş tamamla (stok düşümü için)
    siparisTamamla: (id) => apiRequest(`/Siparisler/${id}/tamamla`, 'PUT'),
    
    // Sadece aşçının ilgilendiği siparişleri getir (BEKLEMEDE, HAZIRLANIYOR)
    getAsciSiparisleri: async () => {
        const response = await apiRequest('/Siparisler');
        if (response.data && Array.isArray(response.data)) {
            const asciDurumlar = ['BEKLEMEDE', 'HAZIRLANIYOR'];
            response.data = response.data.filter(s => {
                const durum = s.siparisDurumu?.toUpperCase() || '';
                return asciDurumlar.includes(durum);
            });
        }
        return response;
    },
    
    // 🆕 Sipariş hazır olduğunda otomatik kurye ata
    siparisHazirVeKuryeAta: async (siparisId) => {
        try {
            // 1. Siparişi HAZIR yap
            await asciAPI.updateSiparisDurum(siparisId, 'HAZIR');
            
            // 2. Müsait kurye bul
            const kuryeResponse = await kuryeAPI.getMusaitKuryeler();
            const musaitKuryeler = kuryeResponse?.data || [];
            
            if (musaitKuryeler.length === 0) {
                return { 
                    success: false, 
                    message: 'Müsait kurye bulunamadı! Sipariş havuza eklendi.' 
                };
            }
            
            // 3. İlk müsait kuryeye ata
            const secilenKurye = musaitKuryeler[0];
            await kuryeAPI.siparisKuryeyeAta(siparisId, secilenKurye.personelId);
            
            return { 
                success: true, 
                message: `Sipariş kurye ${secilenKurye.personelAdi} ${secilenKurye.personelSoyadi}'a atandı!`,
                kurye: secilenKurye
            };
        } catch (error) {
            console.error('Kurye atama hatası:', error);
            return { 
                success: false, 
                message: 'Kurye atama başarısız! Sipariş havuza eklendi.' 
            };
        }
    },
    
    // 🆕 Sipariş bildirimi gönder
    siparisBildirimGonder: (siparisId, durum) => 
        apiRequest(`/Siparisler/${siparisId}/bildirim`, 'POST', { durum }),
};

// ========== ÜYE SERVİSİ ==========
export const userService = {
    getAll: () => apiRequest('/Uyeler'),
    getById: (id) => apiRequest(`/Uyeler/${id}`),
    create: (data) => apiRequest('/Uyeler', 'POST', data),
    update: (id, data) => apiRequest(`/Uyeler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Uyeler/${id}`, 'DELETE'),
};

// ========== KATEGORİ SERVİSİ ==========
export const categoryService = {
    getAll: () => apiRequest('/Kategoriler'),
    getById: (id) => apiRequest(`/Kategoriler/${id}`),
    create: (data) => apiRequest('/Kategoriler', 'POST', data),
    update: (id, data) => apiRequest(`/Kategoriler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kategoriler/${id}`, 'DELETE'),
};

// ========== ÜRÜN SERVİSİ ==========
export const productService = {
    getAll: () => apiRequest('/Urunler'),
    getById: (id) => apiRequest(`/Urunler/${id}`),
    create: (data) => apiRequest('/Urunler', 'POST', data),
    update: (id, data) => apiRequest(`/Urunler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Urunler/${id}`, 'DELETE'),
};

// ========== MASA SERVİSİ ==========
export const tableService = {
    getAll: () => apiRequest('/Masa'),
    getById: (id) => apiRequest(`/Masa/${id}`),
    create: (data) => apiRequest('/Masa', 'POST', data),
    update: (id, data) => apiRequest(`/Masa/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Masa/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Masa/${id}/durum`, 'PUT', { masaDurumu: status }),
    moveTable: (data) => apiRequest('/Masa/tasi', 'POST', data),
};

// ========== REZERVASYON SERVİSİ ==========
export const reservationService = {
    getAll: () => apiRequest('/Rezervasyon'),
    getById: (id) => apiRequest(`/Rezervasyon/${id}`),
    create: (data) => apiRequest('/Rezervasyon', 'POST', data),
    update: (id, data) => apiRequest(`/Rezervasyon/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Rezervasyon/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Rezervasyon/${id}/durum`, 'PUT', { durum: status }),
};

// ========== PERSONEL SERVİSİ ==========
export const personnelService = {
    getAll: () => apiRequest('/Personel'),
    getById: (id) => apiRequest(`/Personel/${id}`),
    create: (data) => apiRequest('/Personel', 'POST', data),
    update: (id, data) => apiRequest(`/Personel/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Personel/${id}`, 'DELETE'),
};

// ========== ÖDEME SERVİSİ ==========
export const paymentService = {
    getAll: () => apiRequest('/Odeme'),
    getById: (id) => apiRequest(`/Odeme/${id}`),
    create: (data) => apiRequest('/Odeme', 'POST', data),
    update: (id, data) => apiRequest(`/Odeme/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Odeme/${id}`, 'DELETE'),
};

// ========== KASA SERVİSİ ==========
export const cashService = {
    getAll: () => apiRequest('/Kasa'),
    getById: (id) => apiRequest(`/Kasa/${id}`),
    create: (data) => apiRequest('/Kasa', 'POST', data),
    update: (id, data) => apiRequest(`/Kasa/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kasa/${id}`, 'DELETE'),
    close: (id, data) => apiRequest(`/Kasa/${id}/kapat`, 'PUT', data),
};

// ========== MALZEME SERVİSİ ==========
export const materialService = {
    getAll: () => apiRequest('/Malzemeler'),
    getById: (id) => apiRequest(`/Malzemeler/${id}`),
    create: (data) => apiRequest('/Malzemeler', 'POST', data),
    update: (id, data) => apiRequest(`/Malzemeler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Malzemeler/${id}`, 'DELETE'),
};

// ========== RAPOR SERVİSİ ==========
export const reportService = {
    getGunlukCiro: (tarih) => {
        const params = tarih ? `?tarih=${tarih}` : '';
        return apiRequest(`/Rapor/gunluk-ciro${params}`);
    },
    getEnCokSatanlar: (gun) => {
        const params = gun ? `?gun=${gun}` : '';
        return apiRequest(`/Rapor/en-cok-satanlar${params}`);
    },
    getSonSiparisler: (adet) => {
        const params = adet ? `?adet=${adet}` : '';
        return apiRequest(`/Rapor/son-siparisler${params}`);
    },
};

// ========== STOK HAREKET SERVİSİ ==========
export const stokHareketService = {
    getAll: () => apiRequest('/StokHareketleri'),
    getById: (id) => apiRequest(`/StokHareketleri/${id}`),
    create: (data) => apiRequest('/StokHareketleri/Ekle', 'POST', data),
    update: (id, data) => apiRequest(`/StokHareketleri/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/StokHareketleri/${id}`, 'DELETE'),
};

// ========== REÇETE SERVİSİ ==========
export const receteService = {
    getAll: () => apiRequest('/Receteler'),
    getByUrun: (urunId) => apiRequest(`/Receteler/urun/${urunId}`),
    create: (data) => apiRequest('/Receteler', 'POST', data),
    update: (id, data) => apiRequest(`/Receteler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Receteler/${id}`, 'DELETE'),
};

// ========== İADE SERVİSİ ==========
export const iadeService = {
    getAll: () => apiRequest('/Iade'),
    getById: (id) => apiRequest(`/Iade/${id}`),
    create: (data) => apiRequest('/Iade', 'POST', data),
    delete: (id) => apiRequest(`/Iade/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Iade/${id}/durum`, 'PUT', { iadeDurumu: status }),
};

// ========== PERSONEL İZİN SERVİSİ ==========
export const personelIzinService = {
    getAll: () => apiRequest('/PersonelIzin'),
    getById: (id) => apiRequest(`/PersonelIzin/${id}`),
    getByPersonel: (personelId) => apiRequest(`/PersonelIzin/personel/${personelId}`),
    create: (data) => apiRequest('/PersonelIzin', 'POST', data),
    update: (id, data) => apiRequest(`/PersonelIzin/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/PersonelIzin/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/PersonelIzin/${id}/durum`, 'PUT', { izinDurumu: status }),
};

// ========== KURYE SERVİSİ (GÜNCELLENDİ) ==========
export const kuryeAPI = {
    // Mevcut fonksiyonlar
    getKuryeler: () => apiRequest('/Kurye/kuryeler'),
    getAktifSiparisler: (personelId) => apiRequest(`/Kurye/${personelId}/aktif-siparisler`),
    getHavuzdakiSiparisler: (siparisId) => {
        const params = siparisId ? `?siparisId=${siparisId}` : '';
        return apiRequest(`/Kurye/havuzdaki-siparisler${params}`);
    },
    getOnlineSiparis: (siparisId) => apiRequest(`/Kurye/online-siparis/${siparisId}`),
    siparisKabulEt: (data) => apiRequest('/Kurye/siparis-kabul-et', 'POST', data),
    teslimEt: (siparisId, data) => apiRequest(`/Kurye/teslim-et/${siparisId}`, 'PUT', data),
    
    // 🆕 YENİ FONKSİYONLAR
    getMusaitKuryeler: () => apiRequest('/Kurye/musait-kuryeler'),
    siparisKuryeyeAta: (siparisId, kuryeId) => 
        apiRequest(`/Kurye/siparis-ata/${siparisId}`, 'POST', { kuryeId }),
    siparisKabul: (siparisId, kuryeId) => 
        apiRequest(`/Kurye/siparis-kabul/${siparisId}`, 'POST', { kuryeId }),
};

// ========== BİLDİRİM SERVİSİ ==========
export const notificationService = {
    getAll: () => apiRequest('/Bildirim'),
    getById: (id) => apiRequest(`/Bildirim/${id}`),
    create: (data) => apiRequest('/Bildirim', 'POST', data),
    update: (id, data) => apiRequest(`/Bildirim/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Bildirim/${id}`, 'DELETE'),
    markAsRead: (id) => apiRequest(`/Bildirim/okundu/${id}`, 'PUT'),
};

// ========== KATEGORİ İŞLEMLERİ İÇİN EK FONKSİYONLAR ==========
export const getKategoriler = categoryService.getAll;
export const kategoriEkle = categoryService.create;
export const kategoriSil = categoryService.delete;

// ========== ÜRÜN İŞLEMLERİ İÇİN EK FONKSİYONLAR ==========
export const urunEkle = productService.create;

// ========== AUTH İŞLEMLERİ ==========
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
};

export const sifreDegistir = authService.sifreDegistir;

// ========== VARSAYILAN EXPORT ==========
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
    stokHareketService,
    receteService,
    iadeService,
    personelIzinService,
    kuryeAPI,
    asciAPI,
    notificationService,
    getKategoriler,
    kategoriEkle,
    kategoriSil,
    urunEkle,
    logout,
    sifreDegistir,
};

export default api;