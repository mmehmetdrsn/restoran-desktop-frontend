// src/Admin/components/Personel/PersonelDuzenle.js
import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { personnelService } from '../../../api/api';

const PersonelDuzenle = ({ acik, kapat, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: '',
    adi: '',
    soyadi: '',
    rolId: ''
  });
  const [loading, setLoading] = useState(false);

  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.adi || !formData.soyadi || !formData.rolId) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }
    
    setLoading(true);
    try {
      await personnelService.update(parseInt(formData.id), {
        PersonelAdi: formData.adi.trim(),
        PersonelSoyadi: formData.soyadi.trim(),
        RolId: parseInt(formData.rolId)
      });
      toast.success('✅ Personel başarıyla güncellendi!');
      setFormData({ id: '', adi: '', soyadi: '', rolId: '' });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Personel güncellenirken hata:', error);
      toast.error('❌ Personel güncellenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Personel Düzenle</h2>
              <p className="text-gray-400 text-xs">Personel bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Personel ID *</label>
            <input
              type="number"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: 1"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Ad</label>
            <input
              value={formData.adi}
              onChange={(e) => setFormData({...formData, adi: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Adını girin"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Soyad</label>
            <input
              value={formData.soyadi}
              onChange={(e) => setFormData({...formData, soyadi: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Soyadını girin"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Rol</label>
            <select
              value={formData.rolId}
              onChange={(e) => setFormData({...formData, rolId: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
              required
              disabled={loading}
            >
              <option value="">Rol Seçin</option>
              <option value="1">Admin</option>
              <option value="2">Garson</option>
              <option value="3">Aşçı</option>
              <option value="4">Kurye</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">1:Admin | 2:Garson | 3:Aşçı | 4:Kurye</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={kapat} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={loading}>
              İptal
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Güncelleniyor...</> : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonelDuzenle;