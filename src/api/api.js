// src/api/api.js
const API_URL = "https://localhost:7099/api";

// Her istekte token'ı otomatik ekleyen merkezi yardımcı fonksiyon
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // 401 gelirse oturum düşmüş demektir
  if (res.status === 401) {
    localStorage.removeItem("token");
    // istersen login sayfasına yönlendir:
    // window.location.href = "/login";
  }

  // Yanıt gövdesini oku (bazı yanıtlar boş olabilir)
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // API'nin standart hata formatı: { "mesaj": "..." }
    throw new Error(data?.mesaj ?? `Hata: ${res.status}`);
  }

  return data;
}

// ================= AUTH =================
export const login = (kullaniciAdi, sifre) =>
  request("/Auth/login", {
    method: "POST",
    body: JSON.stringify({ kullaniciAdi, sifre }),
  });

export const register = (dto) =>
  request("/Auth/register", { method: "POST", body: JSON.stringify(dto) });

export const refresh = (refreshToken) =>
  request("/Auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

export const sifreDegistir = (eskiSifre, yeniSifre) =>
  request("/Auth/sifre-degistir", {
    method: "POST",
    body: JSON.stringify({ eskiSifre, yeniSifre }),
  });

export const logout = () => request("/Auth/logout", { method: "POST" });

// ================= KATEGORILER =================
export const getKategoriler = () => request("/Kategoriler");
export const getKategori = (id) => request(`/Kategoriler/${id}`);
export const kategoriEkle = (dto) =>
  request("/Kategoriler", { method: "POST", body: JSON.stringify(dto) });
export const kategoriGuncelle = (id, dto) =>
  request(`/Kategoriler/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const kategoriSil = (id) =>
  request(`/Kategoriler/${id}`, { method: "DELETE" });

// ================= URUNLER =================
export const getUrunler = () => request("/Urunler");
export const getUrun = (id) => request(`/Urunler/${id}`);
export const urunEkle = (dto) =>
  request("/Urunler", { method: "POST", body: JSON.stringify(dto) });
export const urunGuncelle = (id, dto) =>
  request(`/Urunler/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const urunSil = (id) => request(`/Urunler/${id}`, { method: "DELETE" });

// ================= MASALAR =================
export const getMasalar = () => request("/Masa");
export const getMasa = (id) => request(`/Masa/${id}`);
export const masaEkle = (dto) =>
  request("/Masa", { method: "POST", body: JSON.stringify(dto) });
export const masaGuncelle = (id, dto) =>
  request(`/Masa/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const masaSil = (id) => request(`/Masa/${id}`, { method: "DELETE" });

// ================= SIPARISLER =================
export const getSiparisler = () => request("/Siparisler");
export const getSiparis = (id) => request(`/Siparisler/${id}`);
export const siparisOlustur = (dto) =>
  request("/Siparisler", { method: "POST", body: JSON.stringify(dto) });
export const siparisGuncelle = (id, dto) =>
  request(`/Siparisler/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const siparisDurumGuncelle = (id, siparisDurumu) =>
  request(`/Siparisler/${id}/durum`, {
    method: "PUT",
    body: JSON.stringify({ siparisDurumu }),
  });
export const siparisIptal = (id) =>
  request(`/Siparisler/${id}/iptal`, { method: "PUT" });

// ================= ODEME =================
export const getOdemeler = () => request("/Odeme");
export const odemeAl = (dto) =>
  request("/Odeme", { method: "POST", body: JSON.stringify(dto) });
export const odemeGuncelle = (id, dto) =>
  request(`/Odeme/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const odemeSil = (id) => request(`/Odeme/${id}`, { method: "DELETE" });

// ================= KASA =================
export const getKasalar = () => request("/Kasa");
export const kasaAc = (dto) =>
  request("/Kasa", { method: "POST", body: JSON.stringify(dto) });
export const kasaKapat = (id, kapanisBakiyesi) =>
  request(`/Kasa/${id}/kapat`, {
    method: "PUT",
    body: JSON.stringify({ kapanisBakiyesi }),
  });

// ================= REZERVASYON =================
export const getRezervasyonlar = () => request("/Rezervasyon");
export const rezervasyonEkle = (dto) =>
  request("/Rezervasyon", { method: "POST", body: JSON.stringify(dto) });
export const rezervasyonGuncelle = (id, dto) =>
  request(`/Rezervasyon/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const rezervasyonDurumGuncelle = (id, durum) =>
  request(`/Rezervasyon/${id}/durum`, {
    method: "PUT",
    body: JSON.stringify({ durum }),
  });
export const rezervasyonSil = (id) =>
  request(`/Rezervasyon/${id}`, { method: "DELETE" });

// ================= MALZEMELER =================
export const getMalzemeler = () => request("/Malzemeler");
export const malzemeEkle = (dto) =>
  request("/Malzemeler", { method: "POST", body: JSON.stringify(dto) });
export const malzemeGuncelle = (id, dto) =>
  request(`/Malzemeler/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const malzemeSil = (id) =>
  request(`/Malzemeler/${id}`, { method: "DELETE" });

// ================= RECETELER =================
export const getReceteler = () => request("/Receteler");
export const getUrunRecetesi = (urunId) => request(`/Receteler/urun/${urunId}`);
export const receteEkle = (dto) =>
  request("/Receteler", { method: "POST", body: JSON.stringify(dto) });
export const receteGuncelle = (id, dto) =>
  request(`/Receteler/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const receteSil = (id) =>
  request(`/Receteler/${id}`, { method: "DELETE" });

// ================= STOK HAREKETLERI =================
export const getStokHareketleri = () => request("/StokHareketleri");
export const stokHareketEkle = (dto) =>
  request("/StokHareketleri/Ekle", { method: "POST", body: JSON.stringify(dto) });

// ================= PERSONEL =================
export const getPersoneller = () => request("/Personel");
export const personelEkle = (dto) =>
  request("/Personel", { method: "POST", body: JSON.stringify(dto) });
export const personelGuncelle = (id, dto) =>
  request(`/Personel/${id}`, { method: "PUT", body: JSON.stringify(dto) });
export const personelSil = (id) =>
  request(`/Personel/${id}`, { method: "DELETE" });

// ================= PERSONEL IZIN =================
export const getIzinler = () => request("/PersonelIzin");
export const izinEkle = (dto) =>
  request("/PersonelIzin", { method: "POST", body: JSON.stringify(dto) });
export const izinDurumGuncelle = (id, izinDurumu) =>
  request(`/PersonelIzin/${id}/durum`, {
    method: "PUT",
    body: JSON.stringify({ izinDurumu }),
  });