// src/Admin/components/Rezervasyon/RezervasyonDuzenle.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaCalendarCheck, FaUser, FaChair, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reservationService, tableService } from '../../../api/api';

const RezervasyonDuzenle = ({ acik, kapat, onSuccess }) => {
  const [rezervasyonId, setRezervasyonId] = useState('');
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [rezervasyonBulundu, setRezervasyonBulundu] = useState(false);
  const [masaListesi, setMasaListesi] = useState([]);
  
  // ✅ Form state'i
  const [formData, setFormData] = useState({
    masaId: '',
    musteriAdi: '',
    tarih: '',
    saat: '',
    kisiSayisi: '',
    notlar: ''
  });

  // Modal açıldığında masa listesini getir
  useEffect(() => {
    if (acik) {
      fetchMasaListesi();
    }
  }, [acik]);

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!acik) {
      setRezervasyonId('');
      setFormData({
        masaId: '',
        musteriAdi: '',
        tarih: '',
        saat: '',
        kisiSayisi: '',
        notlar: ''
      });
      setRezervasyonBulundu(false);
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Masa listesini getir
  const fetchMasaListesi = async () => {
    try {
      const response = await tableService.getAll();
      setMasaListesi(response.data || []);
    } catch (error) {
      console.error('Masa listesi yüklenirken hata:', error);
    }
  };

  // ✅ Rezervasyon ara ve bilgileri getir
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
      const data = response.data;
      
      console.log('📋 Gelen rezervasyon verisi:', data);
      
      if (data && data.rezervasyonId) {
        // ✅ Forma verileri doldur
        setFormData({
          masaId: data.masaId || '',
          musteriAdi: data.musteriAdi || '',
          tarih: data.tarih ? data.tarih.split('T')[0] : '',
          saat: data.saat || '',
          kisiSayisi: data.kisiSayisi || '',
          notlar: data.notlar || ''
        });
        
        setRezervasyonBulundu(true);
        toast.success(`✅ Rezervasyon #${data.rezervasyonId} bulundu!`);
      } else {
        toast.error('❌ Rezervasyon bulunamadı!');
        setRezervasyonBulundu(false);
      }
    } catch (error) {
      console.error('Rezervasyon aranırken hata:', error);
      toast.error('❌ Rezervasyon bulunamadı!');
      setRezervasyonBulundu(false);
    } finally {
      setAraniyor(false);
    }
  };

  // ✅ Güncelleme işlemi
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

    if (!formData.tarih) {
      toast.warning('Lütfen tarih seçin!');
      return;
    }

    if (!formData.saat) {
      toast.warning('Lütfen saat seçin!');
      return;
    }

    setLoading(true);
    try {
      const data = {
        masaId: parseInt(formData.masaId),
        musteriAdi: formData.musteriAdi.trim(),
        tarih: formData.tarih,
        saat: formData.saat,
        kisiSayisi: formData.kisiSayisi ? parseInt(formData.kisiSayisi) : null,
        notlar: formData.notlar ? formData.notlar.trim() : null
      };

      console.log('📤 Güncellenen veri:', data);

      await reservationService.update(parseInt(rezervasyonId), data);
      
      toast.success(`✅ Rezervasyon #${rezervasyonId} başarıyla güncellendi!`);
      setRezervasyonId('');
      setFormData({
        masaId: '',
        musteriAdi: '',
        tarih: '',
        saat: '',
        kisiSayisi: '',
        notlar: ''
      });
      setRezervasyonBulundu(false);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Rezervasyon güncellenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(`❌ ${errorData.message}`);
        } else {
          toast.error('❌ Rezervasyon güncellenirken bir hata oluştu!');
        }
      } else if (error.request) {
        toast.error('❌ Sunucuya bağlanılamıyor!');
      } else {
        toast.error('❌ Bir hata oluştu: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Seçilen masanın bilgilerini getir
  const secilenMasa = masaListesi.find(m => m.masaId === parseInt(formData.masaId));

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
          {/* ✅ ID ARAMA ALANI */}
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
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Aranıyor...</>
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

          {/* ✅ REZERVASYON BİLGİLERİ */}
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
                  disabled={!rezervasyonBulundu || loading}
                  required
                >
                  <option value="">Masa Seçin</option>
                  {masaListesi.map((masa) => (
                    <option key={masa.masaId} value={masa.masaId}>
                      #{masa.masaId} - {masa.masaNo} ({masa.masaDurumu || 'BOŞ'})
                    </option>
                  ))}
                </select>
                {secilenMasa && (
                  <p className="text-gray-400 text-xs mt-1">
                    <FaChair className="inline mr-1" size={12} />
                    Seçilen Masa: {secilenMasa.masaNo} - Durum: {secilenMasa.masaDurumu || 'BOŞ'}
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
                  placeholder="Müşteri adını girin"
                  required
                  disabled={!rezervasyonBulundu || loading}
                />
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
                  placeholder="Kaç kişi?"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>

              {/* Notlar */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Notlar
                  <span className="text-gray-500 text-xs ml-1">(opsiyonel)</span>
                </label>
                <textarea
                  value={formData.notlar}
                  onChange={(e) => setFormData({...formData, notlar: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  placeholder="Özel istekler, notlar..."
                  rows="2"
                  disabled={!rezervasyonBulundu || loading}
                />
              </div>
            </div>
          </div>

          {/* ✅ BULUNAN REZERVASYON BİLGİSİ */}
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
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Güncelleniyor...</>
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