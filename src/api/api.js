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

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch (networkErr) {
        console.error('❌ Ağ Hatası:', networkErr);
        const err = new Error('Sunucuya bağlanılamadı.');
        err.response = { status: 0, data: { Mesaj: 'Sunucuya bağlanılamadı.' } };
        throw err;
    }

    console.log(`📡 Response Status: ${response.status} - ${url}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Hatası: ${response.status} - ${errorText}`);

        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { Mesaj: errorText || `HTTP ${response.status} hatası` };
        }

        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }

        // 👇 KRİTİK: artık gerçekten throw ediyoruz, axios benzeri şekilde
        const err = new Error(errorData.Mesaj || errorData.mesaj || `HTTP ${response.status}`);
        err.response = { status: response.status, data: errorData };
        throw err;
    }

    if (response.status === 204) {
        console.log('📡 204 No Content - Veri yok');
        return { data: [], status: 204 };
    }

    const data = await response.json();
    console.log(`📡 Response Data:`, data);
    return { data, status: response.status };
};
// ========== AUTH SERVİSİ ==========
export const authService = {
    login: (data) => apiRequest('/Auth/login', 'POST', data),
    register: (data) => apiRequest('/Auth/register', 'POST', data),
    refresh: (data) => apiRequest('/Auth/refresh', 'POST', data),
    logout: () => apiRequest('/Auth/logout', 'POST'),
    sifreDegistir: (currentPassword, newPassword) => {
        return apiRequest('/Auth/sifre-degistir', 'POST', { 
            mevcutSifre: currentPassword, 
            yeniSifre: newPassword 
        });
    },
};

// ========== SİPARİŞ SERVİSİ ==========
export const orderService = {
    getAll: () => apiRequest('/Siparisler'),
    getById: (id) => apiRequest(`/Siparisler/${id}`),
    create: (data) => {
        console.log('📦 Sipariş oluşturuluyor:', data);
        return apiRequest('/Siparisler', 'POST', data);
    },
    update: (id, data) => apiRequest(`/Siparisler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Siparisler/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Siparisler/${id}/durum`, 'PUT', { siparisDurumu: status }),
    cancel: (id) => apiRequest(`/Siparisler/${id}/iptal`, 'PUT'),
    complete: (id) => apiRequest(`/Siparisler/${id}/tamamla`, 'PUT'),
    
    // 🆕 Sipariş detaylarını güncelle (ürün ekle/çıkar)
    updateDetails: (id, data) => {
        console.log(`📦 Sipariş #${id} detayları güncelleniyor:`, data);
        return apiRequest(`/Siparisler/${id}`, 'PUT', data);
    },
    
    // 🆕 Siparişe ürün ekle
    addItem: (id, item) => {
        console.log(`📦 Sipariş #${id} ürün ekleniyor:`, item);
        return apiRequest(`/Siparisler/${id}/urun-ekle`, 'POST', item);
    },
    
    // 🆕 Siparişten ürün çıkar
    removeItem: (id, itemId) => {
        console.log(`📦 Sipariş #${id} ürün çıkarılıyor:`, itemId);
        return apiRequest(`/Siparisler/${id}/urun-cikar/${itemId}`, 'DELETE');
    }
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
    create: (data) => {
        console.log('📦 Ürün oluşturuluyor:', data);
        return apiRequest('/Urunler', 'POST', data);
    },
    update: (id, data) => {
        console.log(`📦 Ürün #${id} güncelleniyor:`, data);
        return apiRequest(`/Urunler/${id}`, 'PUT', data);
    },
    delete: (id) => apiRequest(`/Urunler/${id}`, 'DELETE'),
};

// ========== MASA SERVİSİ ==========
export const tableService = {
    getAll: () => {
        console.log('📦 Masalar getiriliyor...');
        return apiRequest('/Masa');
    },
    getById: (id) => apiRequest(`/Masa/${id}`),
    create: (data) => {
        console.log('📦 Masa oluşturuluyor:', data);
        return apiRequest('/Masa', 'POST', data);
    },
    update: (id, data) => {
        console.log(`📦 Masa #${id} güncelleniyor:`, data);
        return apiRequest(`/Masa/${id}`, 'PUT', data);
    },
    delete: (id) => apiRequest(`/Masa/${id}`, 'DELETE'),
    moveTable: (data) => {
        console.log('📦 Masa taşınıyor:', data);
        return apiRequest('/Masa/tasi', 'POST', data);
    },
   updateStatus: (id, status, rezervasyonSaati = null) => {
    console.log(`📦 Masa #${id} durumu güncelleniyor:`, status, rezervasyonSaati);
    return apiRequest(`/Masa/${id}/durum`, 'PUT', {
        masaDurumu: status,
        rezervasyonSaati: rezervasyonSaati
    });
}
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
    create: (data) => {
        console.log('💰 Ödeme oluşturuluyor:', data);
        return apiRequest('/Odeme', 'POST', data);
    },
    update: (id, data) => apiRequest(`/Odeme/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Odeme/${id}`, 'DELETE'),
    processPayment: (data) => {
        console.log('💰 Ödeme işleniyor:', data);
        return apiRequest('/Odeme/odeme-al', 'POST', data);
    },
    processRefund: (data) => {
        console.log('↩️ İade işleniyor:', data);
        return apiRequest('/Odeme/iade', 'POST', data);
    }
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

    getGunlukSatis: (tarih) => {
        const params = tarih ? `?tarih=${tarih}` : '';
        return apiRequest(`/Rapor/gunluk-satis${params}`);
    },

    getUrunSatis: (gun) => {
        const params = gun ? `?gun=${gun}` : '';
        return apiRequest(`/Rapor/urun-satis${params}`);
    },

    getRezervasyonRaporu: (baslangic, bitis) => {
        let params = '';
        if (baslangic) params += `?baslangic=${baslangic}`;
        if (bitis) params += `${params ? '&' : '?'}bitis=${bitis}`;
        return apiRequest(`/Rapor/rezervasyon-raporu${params}`);
    },
    getGelirIstatistikleri: (yil) => {
        const params = yil ? `?yil=${yil}` : '';
        return apiRequest(`/Rapor/gelir-istatistikleri${params}`);
    },
    getDashboardOzet: () => {
        return apiRequest('/Rapor/dashboard-ozet');
    },
    getKategoriSatis: (gun) => {
        const params = gun ? `?gun=${gun}` : '';
        return apiRequest(`/Rapor/kategori-satis${params}`);
    }
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

// ============================================================
// ✅ KURYE SERVİSİ (DÜZELTİLDİ)
// ============================================================
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
    
    // ✅ DÜZELTİLDİ: Siparişi kuryeye ata
    siparisKuryeyeAta: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} kurye #${kuryeId}'a atanıyor...`);
        return apiRequest(`/Kurye/siparis-ata/${siparisId}`, 'POST', { 
            siparisId: siparisId,
            personelId: kuryeId 
        });
    },
    
    // ✅ DÜZELTİLDİ: Sipariş kabul
    siparisKabul: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} kurye #${kuryeId} tarafından kabul ediliyor...`);
        return apiRequest(`/Kurye/siparis-kabul/${siparisId}`, 'POST', { 
            siparisId: siparisId,
            personelId: kuryeId 
        });
    },
    
    // ✅ DÜZELTİLDİ: Sipariş iptal
    siparisIptal: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} iptal ediliyor...`);
        return apiRequest(`/Kurye/siparis-iptal/${siparisId}`, 'PUT', { 
            siparisId: siparisId,
            personelId: kuryeId 
        });
    },
    
    // 🆕 Kurye teslim geçmişi
    getTeslimGecmisi: (personelId) => {
        console.log(`📦 Kurye #${personelId} teslim geçmişi çekiliyor...`);
        return apiRequest(`/Kurye/${personelId}/gecmis`);
    },

    // ============================================================
    // 🔥🔥🔥 KURYE PANELİ İÇİN EKSİK FONKSİYONLAR 🔥🔥🔥
    // ============================================================

    // 🆕 Sipariş durumunu güncelle (Kurye paneli için)
    updateSiparisDurum: async (siparisId, data) => {
        console.log(`🔄 Sipariş #${siparisId} durumu güncelleniyor:`, data);
        const response = await apiRequest(`/Kurye/siparis-durum/${siparisId}`, 'PUT', data);
        return response;
    },

    // 🆕 Sipariş teslim al (HAZIR → KURYEDE) - Alternatif
    siparisTeslimAl: async (siparisId, personelId) => {
        console.log(`📦 Sipariş #${siparisId} teslim alınıyor...`);
        const response = await apiRequest(`/Kurye/siparis-kabul-et`, 'POST', {
            siparisId: siparisId,
            personelId: personelId
        });
        return response;
    },

    // 🆕 Sipariş teslim et (YOLDA → TESLIM EDILDI) - Alternatif
    siparisTeslimEt: async (siparisId, personelId) => {
        console.log(`✅ Sipariş #${siparisId} teslim ediliyor...`);
        const response = await apiRequest(`/Kurye/teslim-et/${siparisId}`, 'PUT', {
            personelId: personelId
        });
        return response;
    }
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
    sessionStorage.removeItem('token');
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