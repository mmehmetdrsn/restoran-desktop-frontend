// src/Admin/components/Rezervasyon/RezervasyonEkle.js
import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reservationService, tableService } from '../../../api/api';

const RezervasyonEkle = ({ acik, kapat, onSuccess }) => {
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
    rezervasyonTipi: 'TELEFON'
  });
  const [loading, setLoading] = useState(false);

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
      setFormData({
        masaId: '',
        musteriAdi: '',
        musteriSoyadi: '',
        telefon: '',
        kisiSayisi: 2,
        tarih: '',
        saat: '',
        aciklama: '',
        rezervasyonTipi: 'TELEFON'
      });
    }
  }, [acik]);

  if (!acik) return null;

  const fetchMasaListesi = async () => {
    setMasalarYukleniyor(true);
    try {
      const response = await tableService.getAll();
      console.log('📥 Masa listesi ham yanıt:', response);
      
      // ✅ Güvenli veri çıkarma
      let masaArray = [];
      
      if (Array.isArray(response)) {
        masaArray = response;
      } else if (response && typeof response === 'object') {
        // Obje içinde array ara
        if (Array.isArray(response.data)) {
          masaArray = response.data;
        } else if (Array.isArray(response.items)) {
          masaArray = response.items;
        } else if (Array.isArray(response.masalar)) {
          masaArray = response.masalar;
        } else if (Array.isArray(response.masaListesi)) {
          masaArray = response.masaListesi;
        } else {
          // Tüm değerleri kontrol et
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
      toast.error('Masa listesi yüklenirken hata oluştu!');
    } finally {
      setMasalarYukleniyor(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.masaId) {
      toast.warning('Lütfen masa seçin!');
      return;
    }
    if (!formData.musteriAdi || formData.musteriAdi.trim() === '') {
      toast.warning('Lütfen müşteri adı girin!');
      return;
    }
    if (!formData.tarih || !formData.saat) {
      toast.warning('Lütfen tarih ve saat seçin!');
      return;
    }

    setLoading(true);
    try {
      await reservationService.create({
        masaId: parseInt(formData.masaId),
        musteriAdi: formData.musteriAdi.trim(),
        musteriSoyadi: formData.musteriSoyadi.trim() || null,
        telefon: formData.telefon.trim() || null,
        kisiSayisi: parseInt(formData.kisiSayisi) || 2,
        tarih: formData.tarih,
        saat: formData.saat,
        aciklama: formData.aciklama.trim() || null,
        rezervasyonTipi: formData.rezervasyonTipi
      });
      
      toast.success('✅ Rezervasyon başarıyla eklendi!');
      setFormData({
        masaId: '',
        musteriAdi: '',
        musteriSoyadi: '',
        telefon: '',
        kisiSayisi: 2,
        tarih: '',
        saat: '',
        aciklama: '',
        rezervasyonTipi: 'TELEFON'
      });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Rezervasyon eklenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.mesaj || errorData.message) {
          toast.error(`❌ ${errorData.mesaj || errorData.message}`);
        } else {
          toast.error('❌ Rezervasyon eklenirken hata oluştu!');
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
            <div className="text-2xl text-gray-400"><FaCalendarCheck /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Rezervasyon Ekle</h2>
              <p className="text-gray-400 text-xs">Yeni rezervasyon bilgilerini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Masa Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Masa <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.masaId}
              onChange={(e) => setFormData({...formData, masaId: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
              required
              disabled={loading || masalarYukleniyor}
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
            {masalarYukleniyor && (
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></span>
                Masalar yükleniyor...
              </p>
            )}
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
              placeholder="Örn: Ahmet"
              required
              disabled={loading}
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
              placeholder="Örn: Yılmaz"
              disabled={loading}
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
              placeholder="Örn: 05XX XXX XX XX"
              disabled={loading}
            />
          </div>

          {/* Kişi Sayısı */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Kişi Sayısı
            </label>
            <input
              type="number"
              value={formData.kisiSayisi}
              onChange={(e) => setFormData({...formData, kisiSayisi: e.target.value})}
              min="1"
              max="20"
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              disabled={loading}
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
    disabled={loading}
>
    <option value="TELEFON">Telefon</option>
    <option value="WEB">Web</option>
</select>
          </div>

          {/* Tarih */}
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
              disabled={loading}
            />
          </div>

          {/* Saat */}
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
              disabled={loading}
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Açıklama
            </label>
            <textarea
              value={formData.aciklama}
              onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
              rows="2"
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
              placeholder="Özel istekler, notlar..."
              disabled={loading}
            />
          </div>

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
              disabled={loading} 
              className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span> Ekleniyor...</>
              ) : (
                'Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RezervasyonEkle;