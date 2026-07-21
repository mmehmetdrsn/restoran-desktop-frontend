// src/Admin/components/Rezervasyon/RezervasyonDuzenle.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaCalendarCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reservationService, tableService } from '../../../api/api';

const RezervasyonDuzenle = ({ acik, kapat, onSuccess }) => {
  const [rezervasyonId, setRezervasyonId] = useState('');
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [rezervasyonBulundu, setRezervasyonBulundu] = useState(false);
  const [masaListesi, setMasaListesi] = useState([]);
  const [masalarYukleniyor, setMasalarYukleniyor] = useState(false);
  
  const [formData, setFormData] = useState({
    masaId: '',
    musteriAdi: '',
    musteriSoyadi: '',
    telefon: '',
    kisiSayisi: 2,
    tarih: '',
    saat: '',
    aciklama: '',
    rezervasyonTipi: 'WEB'
  });

  // Modal açıldığında masa listesini getir
  useEffect(() => {
    if (acik) {
      fetchMasaListesi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik]);

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!acik) {
      setRezervasyonId('');
      setFormData({
        masaId: '',
        musteriAdi: '',
        musteriSoyadi: '',
        telefon: '',
        kisiSayisi: 2,
        tarih: '',
        saat: '',
        aciklama: '',
        rezervasyonTipi: 'WEB'
      });
      setRezervasyonBulundu(false);
    }
  }, [acik]);

  if (!acik) return null;

  const fetchMasaListesi = async () => {
    setMasalarYukleniyor(true);
    try {
      const response = await tableService.getAll();
      console.log('📥 Masa listesi ham yanıt:', response);
      
      let masaArray = [];
      
      if (Array.isArray(response)) {
        masaArray = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          masaArray = response.data;
        } else if (Array.isArray(response.items)) {
          masaArray = response.items;
        } else if (Array.isArray(response.masalar)) {
          masaArray = response.masalar;
        } else {
          for (const key of Object.keys(response)) {
            if (Array.isArray(response[key])) {
              masaArray = response[key];
              break;
            }
          }
        }
      }
      
      console.log('✅ Masa listesi (işlenmiş):', masaArray);
      setMasaListesi(masaArray);
    } catch (error) {
      console.error('Masa listesi yüklenirken hata:', error);
      setMasaListesi([]);
    } finally {
      setMasalarYukleniyor(false);
    }
  };

  // ✅ DÜZELTİLDİ: Rezervasyon ara
  const handleRezervasyonAra = async (e) => {
    e.preventDefault();
    if (!rezervasyonId) {
      toast.warning('Lütfen rezervasyon ID girin!');
      return;
    }

    setAraniyor(true);
    setRezervasyonBulundu(false);

    try {
      const response = await reservationService.getById(parseInt(rezervasyonId));
      console.log('📋 Ham API yanıtı:', response);
      
      // ✅ response.data içindeki veriyi al
      let data = response;
      
      // Eğer response.data varsa ve obje ise, onu kullan
      if (response && typeof response === 'object' && response.data) {
        data = response.data;
        console.log('📋 Data içindeki veri:', data);
      }
      
      // Eğer data bir dizi ise ilk elemanı al
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
      
      console.log('📋 İşlenmiş rezervasyon verisi:', data);
      
      if (data && data.rezervasyonId) {
        // ✅ Tarih ve saat bilgisini ayır
        let tarih = '';
        let saat = '';
        if (data.tarihSaat) {
          const dateParts = data.tarihSaat.split('T');
          tarih = dateParts[0] || '';
          saat = dateParts[1] ? dateParts[1].substring(0, 5) : '';
        }
        
        // ✅ Forma verileri doldur
        setFormData({
          masaId: data.masaId || '',
          musteriAdi: data.musteriAdi || '',
          musteriSoyadi: data.musteriSoyadi || '',
          telefon: data.telefon || '',
          kisiSayisi: data.kisiSayisi || 2,
          tarih: tarih,
          saat: saat,
          aciklama: data.aciklama || '',
          rezervasyonTipi: data.rezervasyonTipi || 'WEB'
        });
        
        setRezervasyonBulundu(true);
        toast.success(`✅ Rezervasyon #${data.rezervasyonId} bulundu!`);
      } else {
        toast.error('❌ Rezervasyon bulunamadı!');
        setRezervasyonBulundu(false);
      }
    } catch (error) {
      console.error('❌ Rezervasyon aranırken hata:', error);
      
      if (error.response && error.response.status === 404) {
        toast.error('❌ Rezervasyon bulunamadı!');
      } else {
        toast.error('❌ Rezervasyon aranırken hata oluştu!');
      }
      setRezervasyonBulundu(false);
    } finally {
      setAraniyor(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!rezervasyonId) {
    toast.warning('Lütfen rezervasyon ID girin!');
    return;
  }

  if (!formData.masaId) {
    toast.warning('Lütfen masa seçin!');
    return;
  }

  if (!formData.musteriAdi || formData.musteriAdi.trim() === '') {
    toast.warning('Lütfen müşteri adını girin!');
    return;
  }

  if (!formData.tarih || !formData.saat) {
    toast.warning('Lütfen tarih ve saat seçin!');
    return;
  }

  // ✅ KİŞİ SAYISI - Number'a çevir ve kontrol et
  const kisiSayisi = Number(formData.kisiSayisi);
  if (isNaN(kisiSayisi) || kisiSayisi < 1) {
    toast.warning('Lütfen geçerli bir kişi sayısı girin! (1-20)');
    return;
  }

  setLoading(true);
  try {
    const tarihSaat = `${formData.tarih}T${formData.saat}:00`;
    
    // ✅ TÜM ALANLARI DOĞRU TİPLE GÖNDER
    const data = {
      masaId: Number(formData.masaId),  // ✅ Number
      musteriAdi: formData.musteriAdi.trim(),
      musteriSoyadi: formData.musteriSoyadi.trim() || null,
      telefon: formData.telefon.trim() || null,
      kisiSayisi: kisiSayisi,  // ✅ Number
      tarihSaat: tarihSaat,
      aciklama: formData.aciklama.trim() || null,
      rezervasyonTipi: formData.rezervasyonTipi,
      durum: 'BEKLEMEDE'
    };

    console.log('📤 Güncellenen veri (JSON):', JSON.stringify(data, null, 2));
    console.log('📤 KisiSayisi tipi:', typeof data.kisiSayisi, 'değer:', data.kisiSayisi);

    const response = await reservationService.update(parseInt(rezervasyonId), data);
    console.log('📥 Güncelleme yanıtı:', response);
    
    toast.success(`✅ Rezervasyon #${rezervasyonId} başarıyla güncellendi!`);
    
    setRezervasyonId('');
    setFormData({
      masaId: '',
      musteriAdi: '',
      musteriSoyadi: '',
      telefon: '',
      kisiSayisi: 2,
      tarih: '',
      saat: '',
      aciklama: '',
      rezervasyonTipi: 'WEB'
    });
    setRezervasyonBulundu(false);
    kapat();
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('❌ Rezervasyon güncellenirken hata:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      console.error('❌ Hata detayı:', errorData);
      if (errorData.mesaj || errorData.message) {
        toast.error(`❌ ${errorData.mesaj || errorData.message}`);
      } else {
        toast.error('❌ Rezervasyon güncellenirken bir hata oluştu!');
      }
    } else if (error.request) {
      toast.error('❌ Sunucuya bağlanılamıyor!');
    } else {
      toast.error('❌ ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Rezervasyon Düzenle</h2>
              <p className="text-gray-400 text-xs">Rezervasyon bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID ARAMA */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex gap-2">
              <input
                type="number"
                value={rezervasyonId}
                onChange={(e) => setRezervasyonId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Rezervasyon ID girin (Örn: 1)"
                required
                disabled={araniyor || loading}
              />
              <button
                type="button"
                onClick={handleRezervasyonAra}
                disabled={araniyor || loading || !rezervasyonId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {araniyor ? (
                  <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Aranıyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>
            {rezervasyonBulundu && (
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <FaCalendarCheck className="text-green-400" /> Rezervasyon bulundu! Bilgileri düzenleyebilirsiniz.
              </p>
            )}
          </div>

          {/* REZERVASYON BİLGİLERİ */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaCalendarCheck className="text-yellow-400" /> Rezervasyon Bilgileri
            </h3>
            
            <div className="space-y-3">
              {/* Masa Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Masa <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.masaId}
                  onChange={(e) => setFormData({...formData, masaId: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={!rezervasyonBulundu || loading || masalarYukleniyor}
                  required
                >
                  <option value="">
                    {masalarYukleniyor ? 'Masalar yükleniyor...' : 'Masa Seçin'}
                  </option>
                  {Array.isArray(masaListesi) && masaListesi.length > 0 ? (
                    masaListesi.map((masa) => (
                      <option key={masa.masaId || masa.id} value={masa.masaId || masa.id}>
                        {masa.masaNo || masa.no || 'Masa'} - {masa.masaDurumu || masa.durum || 'BOŞ'} ({masa.kapasite || 4} kişi)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {masalarYukleniyor ? 'Yükleniyor...' : 'Masa bulunamadı'}
                    </option>
                  )}
                </select>
              </div>

              {/* Müşteri Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Müşteri Adı <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.musteriAdi}
                  onChange={(e) => setFormData({...formData, musteriAdi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Müşteri adını girin"
                  required
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>

              {/* Müşteri Soyadı */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Müşteri Soyadı
                </label>
                <input
                  type="text"
                  value={formData.musteriSoyadi}
                  onChange={(e) => setFormData({...formData, musteriSoyadi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Müşteri soyadını girin"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Telefon numarası"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>

              {/* Kişi Sayısı */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Kişi Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.kisiSayisi}
                  onChange={(e) => setFormData({...formData, kisiSayisi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>

              {/* Rezervasyon Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Rezervasyon Tipi
                </label>
                <select
                  value={formData.rezervasyonTipi}
                  onChange={(e) => setFormData({...formData, rezervasyonTipi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={!rezervasyonBulundu || loading}
                >
                  <option value="WEB">Web</option>
                  <option value="TELEFON">Telefon</option>
                </select>
              </div>

              {/* Tarih ve Saat */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Tarih <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tarih}
                    onChange={(e) => setFormData({...formData, tarih: e.target.value})}
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    required
                    disabled={!rezervasyonBulundu || loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Saat <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.saat}
                    onChange={(e) => setFormData({...formData, saat: e.target.value})}
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    required
                    disabled={!rezervasyonBulundu || loading}
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Açıklama
                </label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  placeholder="Özel istekler, notlar..."
                  rows="2"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>
            </div>
          </div>

          {rezervasyonBulundu && (
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 flex items-center gap-3">
              <FaCalendarCheck className="text-green-400 text-lg" />
              <div>
                <p className="text-green-400 text-sm font-medium">Rezervasyon #{rezervasyonId} düzenleniyor</p>
                <p className="text-gray-400 text-xs">
                  Müşteri: <span className="text-white">{formData.musteriAdi}</span> • 
                  Tarih: <span className="text-white">{formData.tarih}</span> • 
                  Saat: <span className="text-white">{formData.saat}</span>
                </p>
              </div>
            </div>
          )}

          {/* BUTONLAR */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={kapat} 
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all" 
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={!rezervasyonBulundu || loading} 
              className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span> Güncelleniyor...</>
              ) : (
                'Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RezervasyonDuzenle;