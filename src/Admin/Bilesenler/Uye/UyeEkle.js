// src/Admin/components/Uye/UyeEkle.js
import React from 'react';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../../../api/api';

const UyeEkle = ({ acik, kapat, onSuccess, yeniUye, setYeniUye, loading, setLoading }) => {
  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!yeniUye.uyeAdi || !yeniUye.uyeSoyadi || !yeniUye.uyeEmail) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }
    
    if (!yeniUye.uyeSifre || yeniUye.uyeSifre.length < 6) {
      toast.warning('Şifre en az 6 karakter olmalıdır!');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(yeniUye.uyeEmail)) {
      toast.warning('Geçerli bir email adresi girin!');
      return;
    }
    
    setLoading(true);
    try {
      // ✅ Backend'in beklediği format (PascalCase)
      const data = {
        uyeAdi: yeniUye.uyeAdi.trim(),
        uyeSoyadi: yeniUye.uyeSoyadi.trim(),
        uyeEmail: yeniUye.uyeEmail.trim(),
        uyeSifre: yeniUye.uyeSifre,
        uyeTelefon: yeniUye.uyeTelefon || null,
        cinsiyet: yeniUye.cinsiyet || null,
        adresTipi: yeniUye.adresTipi || null,
        acikAdres: yeniUye.acikAdres || null,
        teslimatBolgesindeMi: yeniUye.teslimatBolgesindeMi || false
      };
      
      console.log('📤 Gönderilen veri:', data);
      
      const response = await userService.create(data);
      console.log('📥 Gelen yanıt:', response);
      
      toast.success('✅ Üye başarıyla eklendi!');
      setYeniUye({
        uyeAdi: '',
        uyeSoyadi: '',
        uyeEmail: '',
        uyeSifre: '',
        uyeTelefon: '',
        cinsiyet: '',
        adresTipi: '',
        acikAdres: '',
        teslimatBolgesindeMi: false
      });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Üye eklenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        console.error('❌ Hata detayı:', errorData);
        
        if (typeof errorData === 'string') {
          toast.error(`❌ ${errorData}`);
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join('\n');
          toast.error(`❌ ${errorMessages}`);
        } else if (errorData.title) {
          toast.error(`❌ ${errorData.title}`);
        } else if (errorData.mesaj || errorData.message) {
          toast.error(`❌ ${errorData.mesaj || errorData.message}`);
        } else {
          toast.error('❌ Üye eklenirken bir hata oluştu!');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-gray-400"><FaUserPlus /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Yeni Üye Ekle</h2>
              <p className="text-gray-400 text-xs">Üye bilgilerini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kişisel Bilgiler */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3">👤 Kişisel Bilgiler</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ad *</label>
                <input
                  value={yeniUye.uyeAdi}
                  onChange={(e) => setYeniUye({...yeniUye, uyeAdi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Adını girin"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Soyad *</label>
                <input
                  value={yeniUye.uyeSoyadi}
                  onChange={(e) => setYeniUye({...yeniUye, uyeSoyadi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Soyadını girin"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={yeniUye.uyeEmail}
                  onChange={(e) => setYeniUye({...yeniUye, uyeEmail: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="email@ornek.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Şifre * (En az 6 karakter)</label>
                <input
                  type="password"
                  value={yeniUye.uyeSifre}
                  onChange={(e) => setYeniUye({...yeniUye, uyeSifre: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Şifreyi girin"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefon</label>
                <input
                  value={yeniUye.uyeTelefon}
                  onChange={(e) => setYeniUye({...yeniUye, uyeTelefon: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="05XX XXX XX XX"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cinsiyet</label>
                <select
                  value={yeniUye.cinsiyet}
                  onChange={(e) => setYeniUye({...yeniUye, cinsiyet: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={loading}
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3">📍 Adres Bilgileri</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Adres Tipi</label>
                <select
                  value={yeniUye.adresTipi}
                  onChange={(e) => setYeniUye({...yeniUye, adresTipi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={loading}
                >
                  <option value="">Seçiniz</option>
                  <option value="Ev">Ev</option>
                  <option value="İş">İş</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Açık Adres</label>
                <textarea
                  value={yeniUye.acikAdres}
                  onChange={(e) => setYeniUye({...yeniUye, acikAdres: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  placeholder="Mahalle, Sokak, No, Daire"
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="teslimatBolgesi"
                  checked={yeniUye.teslimatBolgesindeMi || false}
                  onChange={(e) => setYeniUye({...yeniUye, teslimatBolgesindeMi: e.target.checked})}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-white/20"
                  disabled={loading}
                />
                <label htmlFor="teslimatBolgesi" className="text-sm text-gray-300">
                  Teslimat Bölgesinde mi?
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={kapat} 
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" 
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Ekleniyor...</>
              ) : (
                'Üye Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UyeEkle;