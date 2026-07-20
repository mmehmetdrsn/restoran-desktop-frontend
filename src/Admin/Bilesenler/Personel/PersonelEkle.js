// src/Admin/components/Personel/PersonelEkle.js
import React from 'react';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { personnelService } from '../../../api/api';

const PersonelEkle = ({ acik, kapat, onSuccess, yeniPersonel, setYeniPersonel, loading, setLoading }) => {
  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!yeniPersonel.PersonelAdi || !yeniPersonel.PersonelSoyadi || 
        !yeniPersonel.KullaniciAdi || !yeniPersonel.Sifre) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }
    if (yeniPersonel.Sifre.length < 6) {
      toast.warning('Şifre en az 6 karakter olmalı!');
      return;
    }
    
    setLoading(true);
    try {
      const rolId = parseInt(yeniPersonel.RolId);
      const validRolIds = [1, 2, 3, 4];
      if (!validRolIds.includes(rolId)) {
        toast.error('❌ Geçersiz rol seçimi! (1:Admin, 2:Garson, 3:Aşçı, 4:Kurye)');
        setLoading(false);
        return;
      }
      
      const personelData = {
        PersonelAdi: yeniPersonel.PersonelAdi.trim(),
        PersonelSoyadi: yeniPersonel.PersonelSoyadi.trim(),
        KullaniciAdi: yeniPersonel.KullaniciAdi.trim(),
        PersonelSifre: yeniPersonel.Sifre,
        RolId: rolId,
        PersonelTelefon: yeniPersonel.PersonelTelefon || null,
        Cinsiyet: yeniPersonel.Cinsiyet || null,
        Maas: yeniPersonel.Maas ? parseFloat(yeniPersonel.Maas) : null
      };
      
      console.log('📤 Gönderilen personel verisi:', personelData);
      
      await personnelService.create(personelData);
      
      toast.success(`✅ ${yeniPersonel.PersonelAdi} ${yeniPersonel.PersonelSoyadi} başarıyla eklendi!`);
      
      setYeniPersonel({
        PersonelAdi: '',
        PersonelSoyadi: '',
        KullaniciAdi: '',
        Sifre: '',
        RolId: 2,
        PersonelTelefon: '',
        Cinsiyet: '',
        Maas: ''
      });
      
      kapat();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('❌ Personel ekleme hatası:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = 'Personel eklenirken bir hata oluştu!';
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join('\n');
          errorMessage = errorMessages;
        }
        
        toast.error(`❌ ${errorMessage}`);
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
              <h2 className="text-white font-bold text-lg">Yeni Personel Ekle</h2>
              <p className="text-gray-400 text-xs">Personel bilgilerini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Personel Adı *</label>
            <input
              value={yeniPersonel.PersonelAdi}
              onChange={(e) => setYeniPersonel({...yeniPersonel, PersonelAdi: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Adını girin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Personel Soyadı *</label>
            <input
              value={yeniPersonel.PersonelSoyadi}
              onChange={(e) => setYeniPersonel({...yeniPersonel, PersonelSoyadi: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Soyadını girin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kullanıcı Adı *</label>
            <input
              value={yeniPersonel.KullaniciAdi}
              onChange={(e) => setYeniPersonel({...yeniPersonel, KullaniciAdi: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Kullanıcı adını girin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Şifre * (En az 6 karakter)</label>
            <input
              type="password"
              value={yeniPersonel.Sifre}
              onChange={(e) => setYeniPersonel({...yeniPersonel, Sifre: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Şifreyi girin"
              required
              minLength="6"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol *</label>
            <select
              value={yeniPersonel.RolId}
              onChange={(e) => setYeniPersonel({...yeniPersonel, RolId: parseInt(e.target.value)})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
              required
            >
              <option value="">Rol Seçin</option>
              <option value="1">Admin (ID: 1)</option>
              <option value="2">Garson (ID: 2)</option>
              <option value="3">Aşçı (ID: 3)</option>
              <option value="4">Kurye (ID: 4)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">1:Admin | 2:Garson | 3:Aşçı | 4:Kurye</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefon (Opsiyonel)</label>
            <input
              value={yeniPersonel.PersonelTelefon}
              onChange={(e) => setYeniPersonel({...yeniPersonel, PersonelTelefon: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="05XX XXX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Cinsiyet (Opsiyonel)</label>
            <select
              value={yeniPersonel.Cinsiyet}
              onChange={(e) => setYeniPersonel({...yeniPersonel, Cinsiyet: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
            >
              <option value="">Seçiniz</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Maaş (Opsiyonel)</label>
            <input
              type="number"
              step="0.01"
              value={yeniPersonel.Maas}
              onChange={(e) => setYeniPersonel({...yeniPersonel, Maas: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: 15000"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={kapat} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={loading}>
              İptal
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Ekleniyor...</> : 'Personel Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonelEkle;