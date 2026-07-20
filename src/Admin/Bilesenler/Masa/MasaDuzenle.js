// src/Admin/components/Masa/MasaDuzenle.js
import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tableService } from '../../../api/api';

const MasaDuzenle = ({ acik, kapat, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: '',
    masaNo: ''
  });
  const [loading, setLoading] = useState(false);

  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.masaNo) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }
    try {
      setLoading(true);
      await tableService.update(parseInt(formData.id), {
        masaNo: parseInt(formData.masaNo)
      });
      toast.success('✅ Masa başarıyla güncellendi!');
      setFormData({ id: '', masaNo: '' });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Masa güncellenirken hata:', error);
      toast.error('❌ Masa güncellenirken hata oluştu!');
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
              <h2 className="text-white font-bold text-lg">Masa Düzenle</h2>
              <p className="text-gray-400 text-xs">Masa bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Masa ID *</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Masa Numarası</label>
            <input
              type="number"
              value={formData.masaNo}
              onChange={(e) => setFormData({...formData, masaNo: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: 5"
              required
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={kapat} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={loading}>İptal</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Güncelleniyor...</> : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasaDuzenle;