// src/api/api.js

// .env dosyasından API URL'sini al
const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('🚀 API Base URL:', API_BASE_URL);

// ============================================================
// ✅ GENEL API İSTEK FONKSİYONU
// ============================================================
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

// ============================================================
// ✅ AUTH SERVİSİ
// ============================================================
export const authService = {
    login: (data) => apiRequest('/Auth/login', 'POST', data),
    register: (data) => apiRequest('/Auth/register', 'POST', data),
    refresh: (data) => apiRequest('/Auth/refresh', 'POST', data),
    logout: () => apiRequest('/Auth/logout', 'POST'),
    sifreDegistir: (data) => {
        return apiRequest('/Auth/sifre-degistir', 'POST', data);
    },
};

// ============================================================
// ✅ SİPARİŞ SERVİSİ
// ============================================================
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
    updateDetails: (id, data) => {
        console.log(`📦 Sipariş #${id} detayları güncelleniyor:`, data);
        return apiRequest(`/Siparisler/${id}`, 'PUT', data);
    },
    addItem: (id, item) => {
        console.log(`📦 Sipariş #${id} ürün ekleniyor:`, item);
        return apiRequest(`/Siparisler/${id}/urun-ekle`, 'POST', item);
    },
    removeItem: (id, itemId) => {
        console.log(`📦 Sipariş #${id} ürün çıkarılıyor:`, itemId);
        return apiRequest(`/Siparisler/${id}/urun-cikar/${itemId}`, 'DELETE');
    }
};


// ============================================================
// ✅ ÜYE SERVİSİ
// ============================================================
export const userService = {
    getAll: () => apiRequest('/Uyeler'),
    getById: (id) => apiRequest(`/Uyeler/${id}`),
    create: (data) => apiRequest('/Uyeler', 'POST', data),
    update: (id, data) => apiRequest(`/Uyeler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Uyeler/${id}`, 'DELETE'),
};

// ============================================================
// ✅ KATEGORİ SERVİSİ
// ============================================================
export const categoryService = {
    getAll: () => apiRequest('/Kategoriler'),
    getById: (id) => apiRequest(`/Kategoriler/${id}`),
    create: (data) => apiRequest('/Kategoriler', 'POST', data),
    update: (id, data) => apiRequest(`/Kategoriler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kategoriler/${id}`, 'DELETE'),
};

// ============================================================
// ✅ ÜRÜN SERVİSİ
// ============================================================
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

// ============================================================
// ✅ MASA SERVİSİ
// ============================================================
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

// ============================================================
// ✅ REZERVASYON SERVİSİ
// ============================================================
export const reservationService = {
    getAll: () => apiRequest('/Rezervasyon'),
    getById: (id) => apiRequest(`/Rezervasyon/${id}`),
    create: (data) => apiRequest('/Rezervasyon', 'POST', data),
    update: (id, data) => apiRequest(`/Rezervasyon/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Rezervasyon/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Rezervasyon/${id}/durum`, 'PUT', { durum: status }),
};

// ============================================================
// ✅ PERSONEL SERVİSİ
// ============================================================
export const personnelService = {
    getAll: () => apiRequest('/Personel'),
    getById: (id) => apiRequest(`/Personel/${id}`),
    create: (data) => apiRequest('/Personel', 'POST', data),
    update: (id, data) => apiRequest(`/Personel/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Personel/${id}`, 'DELETE'),
};

// ============================================================
// ✅ ÖDEME SERVİSİ
// ============================================================
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
    masaOdeme: (data) => {
        console.log('💰 Masa ödemesi işleniyor:', data);
        return apiRequest('/Odeme/masa-odeme', 'POST', data);
    },
    processRefund: (data) => {
        console.log('↩️ İade işleniyor:', data);
        return apiRequest('/Iade/siparis-iade', 'POST', data);
    }
};

// ============================================================
// ✅ KASA SERVİSİ
// ============================================================
export const cashService = {
    getAll: () => apiRequest('/Kasa'),
    getById: (id) => apiRequest(`/Kasa/${id}`),
    create: (data) => apiRequest('/Kasa', 'POST', data),
    update: (id, data) => apiRequest(`/Kasa/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Kasa/${id}`, 'DELETE'),
    close: (id, data) => apiRequest(`/Kasa/${id}/kapat`, 'PUT', data),
};

// ============================================================
// ✅ MALZEME SERVİSİ
// ============================================================
export const materialService = {
    getAll: () => apiRequest('/Malzemeler'),
    getById: (id) => apiRequest(`/Malzemeler/${id}`),
    create: (data) => apiRequest('/Malzemeler', 'POST', data),
    update: (id, data) => apiRequest(`/Malzemeler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Malzemeler/${id}`, 'DELETE'),
};

// ============================================================
// ✅ RAPOR SERVİSİ
// ============================================================
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

// ============================================================
// ✅ STOK HAREKET SERVİSİ
// ============================================================
export const stokHareketService = {
    getAll: () => apiRequest('/StokHareketleri'),
    getById: (id) => apiRequest(`/StokHareketleri/${id}`),
    create: (data) => apiRequest('/StokHareketleri/Ekle', 'POST', data),
    update: (id, data) => apiRequest(`/StokHareketleri/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/StokHareketleri/${id}`, 'DELETE'),
};

// ============================================================
// ✅ REÇETE SERVİSİ
// ============================================================
export const receteService = {
    getAll: () => apiRequest('/Receteler'),
    getByUrun: (urunId) => apiRequest(`/Receteler/urun/${urunId}`),
    create: (data) => apiRequest('/Receteler', 'POST', data),
    update: (id, data) => apiRequest(`/Receteler/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Receteler/${id}`, 'DELETE'),
};

// ============================================================
// ✅ İADE SERVİSİ
// ============================================================
export const iadeService = {
    getAll: () => apiRequest('/Iade'),
    getById: (id) => apiRequest(`/Iade/${id}`),
    create: (data) => apiRequest('/Iade', 'POST', data),
    delete: (id) => apiRequest(`/Iade/${id}`, 'DELETE'),
    updateStatus: (id, status) => apiRequest(`/Iade/${id}/durum`, 'PUT', { iadeDurumu: status }),
};

// ============================================================
// ✅ PERSONEL İZİN SERVİSİ
// ============================================================
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
// ✅ KURYE SERVİSİ
// ============================================================
export const kuryeAPI = {
    getKuryeler: () => apiRequest('/Kurye/kuryeler'),
    getAktifSiparisler: (personelId) => apiRequest(`/Kurye/${personelId}/aktif-siparisler`),
    getHavuzdakiSiparisler: (siparisId) => {
        const params = siparisId ? `?siparisId=${siparisId}` : '';
        return apiRequest(`/Kurye/havuzdaki-siparisler${params}`);
    },
    getOnlineSiparis: (siparisId) => apiRequest(`/Kurye/online-siparis/${siparisId}`),
    siparisKabulEt: (data) => apiRequest('/Kurye/siparis-kabul-et', 'POST', data),
    teslimEt: (siparisId, data) => apiRequest(`/Kurye/teslim-et/${siparisId}`, 'PUT', data),
    getMusaitKuryeler: () => apiRequest('/Kurye/musait-kuryeler'),

    siparisKuryeyeAta: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} kurye #${kuryeId}'a atanıyor...`);
        return apiRequest(`/Kurye/siparis-ata/${siparisId}`, 'POST', {
            siparisId: siparisId,
            personelId: kuryeId
        });
    },
    siparisKabul: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} kurye #${kuryeId} tarafından kabul ediliyor...`);
        return apiRequest(`/Kurye/siparis-kabul/${siparisId}`, 'POST', {
            siparisId: siparisId,
            personelId: kuryeId
        });
    },
    siparisIptal: (siparisId, kuryeId) => {
        console.log(`📦 Sipariş #${siparisId} iptal ediliyor...`);
        return apiRequest(`/Kurye/siparis-iptal/${siparisId}`, 'PUT', {
            siparisId: siparisId,
            personelId: kuryeId
        });
    },
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

// ============================================================
// ✅ BİLDİRİM SERVİSİ
// ============================================================
export const notificationService = {
    getAll: () => apiRequest('/Bildirim'),
    getById: (id) => apiRequest(`/Bildirim/${id}`),
    create: (data) => apiRequest('/Bildirim', 'POST', data),
    update: (id, data) => apiRequest(`/Bildirim/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/Bildirim/${id}`, 'DELETE'),
    markAsRead: (id) => apiRequest(`/Bildirim/okundu/${id}`, 'PUT'),
};

// ============================================================
// ✅ MALZEME TALEP SERVİSİ 
// ============================================================
export const malzemeTalepAPI = {
    // Tüm talepleri getir
    getAll: () => apiRequest('/MalzemeTalep/tum-talepler'),

    // Admin için tüm talepleri getir (getAdminTalepler olarak)
    getAdminTalepler: () => apiRequest('/MalzemeTalep/tum-talepler'),

    // Bekleyen talepleri getir
    getBekleyenler: () => apiRequest('/MalzemeTalep/bekleyen-talepler'),

    // Tek bir talebi getir
    getById: (id) => apiRequest(`/MalzemeTalep/${id}`),

    //  Yeni talep oluştur (Aşçı için) - FONKSİYONU EKLE
    talepOlustur: (data) => {
        console.log('📦 Malzeme talebi oluşturuluyor:', data);
        return apiRequest('/MalzemeTalep/talep-olustur', 'POST', data);
    },

    // Talep durumunu güncelle (Onayla/Reddet)
    updateStatus: (id, data) => apiRequest(`/MalzemeTalep/talep-cevapla/${id}`, 'PUT', data),

    // Talep sil
    delete: (id) => apiRequest(`/MalzemeTalep/talep-sil/${id}`, 'DELETE'),

    // Admin tarafından talep onayla
    adminOnayla: (id) => apiRequest(`/MalzemeTalep/talep-cevapla/${id}`, 'PUT', { durum: 'ONAYLANDI', cevaplayan: 'Admin' }),

    // Admin tarafından talep reddet
    adminReddet: (id) => apiRequest(`/MalzemeTalep/talep-cevapla/${id}`, 'PUT', { durum: 'REDDEDILDI', cevaplayan: 'Admin' })
};


// ============================================================
// ✅ AŞÇI SERVİSİ
// ============================================================
export const asciAPI = {
    // Aşçı panelindeki siparişleri getir
    getAsciSiparisleri: async () => {
        try {
            const response = await apiRequest('/Asci/siparisler');
            return response;
        } catch (error) {
            console.error('Siparişler alınamadı:', error);
            throw error;
        }
    },

    // Tek sipariş detaylarını getir
    getSiparisDetay: (id) => apiRequest(`/Siparisler/${id}`),

    // Sipariş durumunu güncelle - direkt string gönder
    updateSiparisDurum: (id, durum) =>
        apiRequest(`/Asci/siparis/${id}/durum`, 'PUT', durum),

    // Sipariş hazır ve kurye ata
    siparisHazirVeKuryeAta: (id) =>
        apiRequest(`/Asci/siparis/${id}/hazir-ve-kurye-ata`, 'POST'),

    // Garsona bildirim gönder
    garsonaBildirimGonder: (id) =>
        apiRequest(`/Asci/siparis/${id}/garson-bildirim`, 'POST'),

    // Sipariş tamamla (stok düşüşü ile)
    siparisTamamla: (id) =>
        apiRequest(`/Asci/siparis/${id}/tamamla`, 'PUT'),
};


// ============================================================
// ✅ EK FONKSİYONLAR
// ============================================================
export const getKategoriler = categoryService.getAll;
export const kategoriEkle = categoryService.create;
export const kategoriSil = categoryService.delete;
export const urunEkle = productService.create;

// ============================================================
// ✅ AUTH İŞLEMLERİ
// ============================================================
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
};

export const sifreDegistir = authService.sifreDegistir;

// ============================================================
// ✅ VARSAYILAN EXPORT
// ============================================================
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
    malzemeTalepAPI,
    getKategoriler,
    kategoriEkle,
    kategoriSil,
    urunEkle,
    logout,
    sifreDegistir,
};

export default api;