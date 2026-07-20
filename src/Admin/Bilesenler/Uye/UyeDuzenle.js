// src/Admin/components/Uye/UyeDuzenle.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../../../api/api';

const UyeDuzenle = ({ acik, kapat, onSuccess }) => {
  const [uyeId, setUyeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [uyeBulundu, setUyeBulundu] = useState(false);
  
  // ✅ Form state'i
  const [formData, setFormData] = useState({
    uyeAdi: '',
    uyeSoyadi: '',
    uyeEmail: '',
    uyeTelefon: '',
    cinsiyet: '',
    adresTipi: '',
    acikAdres: '',
  });

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!acik) {
      setUyeId('');
      setFormData({
        uyeAdi: '',
        uyeSoyadi: '',
        uyeEmail: '',
        uyeTelefon: '',
        cinsiyet: '',
        adresTipi: '',
        acikAdres: '',
      });
      setUyeBulundu(false);
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Üye ara ve bilgileri getir
  const handleUyeAra = async (e) => {
    e.preventDefault();
    if (!uyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }

    setLoading(true);
    setUyeBulundu(false);

    try {
      const response = await userService.getById(parseInt(uyeId));
      const data = response.data;
      
      console.log('📋 Gelen üye verisi:', data);
      
      if (data && data.uyeId) {
        // ✅ Forma verileri doldur
        setFormData({
          uyeAdi: data.uyeAdi || '',
          uyeSoyadi: data.uyeSoyadi || '',
          uyeEmail: data.uyeEmail || '',
          uyeTelefon: data.uyeTelefon || '',
          cinsiyet: data.cinsiyet || data.Cinsiyet || '',
          // Adres bilgileri (varsa ilk adresi al)
          adresTipi: data.adresler?.[0]?.adresTipi || '',
          acikAdres: data.adresler?.[0]?.acikAdres || '',
        });
        
        setUyeBulundu(true);
        toast.success(`✅ ${data.uyeAdi} ${data.uyeSoyadi} bulundu!`);
      } else {
        toast.error('❌ Üye bulunamadı!');
        setUyeBulundu(false);
      }
    } catch (error) {
      console.error('Üye aranırken hata:', error);
      toast.error('❌ Üye bulunamadı!');
      setUyeBulundu(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }

    if (!formData.uyeAdi || !formData.uyeSoyadi || !formData.uyeEmail) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.uyeEmail)) {
      toast.warning('Geçerli bir email adresi girin!');
      return;
    }

    setYukleniyor(true);
    try {
      const data = {
        uyeAdi: formData.uyeAdi.trim(),
        uyeSoyadi: formData.uyeSoyadi.trim(),
        uyeEmail: formData.uyeEmail.trim(),
        uyeTelefon: formData.uyeTelefon || null,
        cinsiyet: formData.cinsiyet || null,
        // Adres bilgileri
        adresTipi: formData.adresTipi || null,
        acikAdres: formData.acikAdres || null,
      };

      console.log('📤 Güncellenen veri:', data);

      await userService.update(parseInt(uyeId), data);
      
      toast.success('✅ Üye başarıyla güncellendi!');
      setUyeId('');
      setFormData({
        uyeAdi: '',
        uyeSoyadi: '',
        uyeEmail: '',
        uyeTelefon: '',
        cinsiyet: '',
        adresTipi: '',
        acikAdres: '',
      });
      setUyeBulundu(false);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Üye güncellenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join('\n');
          toast.error(`❌ ${errorMessages}`);
        } else if (errorData.message) {
          toast.error(`❌ ${errorData.message}`);
        } else {
          toast.error('❌ Üye güncellenirken bir hata oluştu!');
        }
      } else if (error.request) {
        toast.error('❌ Sunucuya bağlanılamıyor!');
      } else {
        toast.error('❌ Bir hata oluştu: ' + error.message);
      }
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Üye Düzenle</h2>
              <p className="text-gray-400 text-xs">Üye bilgilerini güncelleyin</p>
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
                value={uyeId}
                onChange={(e) => setUyeId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Üye ID girin (Örn: 1)"
                required
                disabled={loading || yukleniyor}
              />
              <button
                type="button"
                onClick={handleUyeAra}
                disabled={loading || yukleniyor || !uyeId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Aranıyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>
            {uyeBulundu && (
              <p className="text-green-400 text-xs mt-2">✅ Üye bulundu! Bilgileri düzenleyebilirsiniz.</p>
            )}
          </div>

          {/* ✅ KİŞİSEL BİLGİLER */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3">👤 Kişisel Bilgiler</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Ad *</label>
                <input
                  value={formData.uyeAdi}
                  onChange={(e) => setFormData({...formData, uyeAdi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Adını girin"
                  required
                  disabled={!uyeBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Soyad *</label>
                <input
                  value={formData.uyeSoyadi}
                  onChange={(e) => setFormData({...formData, uyeSoyadi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Soyadını girin"
                  required
                  disabled={!uyeBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Email *</label>
                <input
                  type="email"
                  value={formData.uyeEmail}
                  onChange={(e) => setFormData({...formData, uyeEmail: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="email@ornek.com"
                  required
                  disabled={!uyeBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Telefon</label>
                <input
                  value={formData.uyeTelefon}
                  onChange={(e) => setFormData({...formData, uyeTelefon: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="05XX XXX XX XX"
                  disabled={!uyeBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cinsiyet</label>
                <select
                  value={formData.cinsiyet}
                  onChange={(e) => setFormData({...formData, cinsiyet: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={!uyeBulundu || yukleniyor}
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>
            </div>
          </div>

          {/* ✅ ADRES BİLGİLERİ */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3">📍 Adres Bilgileri</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Adres Tipi</label>
                <select
                  value={formData.adresTipi}
                  onChange={(e) => setFormData({...formData, adresTipi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={!uyeBulundu || yukleniyor}
                >
                  <option value="">Seçiniz</option>
                  <option value="Ev">Ev</option>
                  <option value="İş">İş</option>
                  <option value="Yazlık">Yazlık</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Açık Adres</label>
                <textarea
                  value={formData.acikAdres}
                  onChange={(e) => setFormData({...formData, acikAdres: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  placeholder="Mahalle, Sokak, No, Daire"
                  rows="3"
                  disabled={!uyeBulundu || yukleniyor}
                />
              </div>
            </div>
          </div>

          {/* BUTONLAR */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={kapat} 
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all" 
              disabled={yukleniyor}
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={!uyeBulundu || yukleniyor} 
              className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {yukleniyor ? (
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

export default UyeDuzenle;