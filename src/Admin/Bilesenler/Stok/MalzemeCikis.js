// src/Admin/components/Stok/MalzemeCikis.js
import React, { useState, useEffect } from 'react';
import { FaMinusCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { materialService } from '../../../api/api';

const MalzemeCikis = ({ acik, kapat, onSuccess, malzemeler }) => {
  const [formData, setFormData] = useState({
    malzemeId: '',
    miktar: '',
    aciklama: ''
  });
  const [loading, setLoading] = useState(false);

  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.malzemeId) {
      toast.warning('Lütfen malzeme seçin!');
      return;
    }

    const miktar = parseFloat(formData.miktar);
    if (!miktar || miktar <= 0) {
      toast.warning('Geçerli bir miktar girin!');
      return;
    }

    // Seçilen malzemenin mevcut stokunu bul
    const secilenMalzeme = malzemeler.find(m => m.malzemeId === parseInt(formData.malzemeId));
    if (secilenMalzeme && miktar > secilenMalzeme.stokMiktari) {
      toast.warning(`Yeterli stok yok! Mevcut stok: ${secilenMalzeme.stokMiktari} ${secilenMalzeme.birim}`);
      return;
    }

    setLoading(true);
    try {
      // Malzemeyi güncelle (stok düş)
      const yeniStok = (secilenMalzeme?.stokMiktari || 0) - miktar;
      await materialService.update(parseInt(formData.malzemeId), {
        malzemeAdi: secilenMalzeme?.malzemeAdi,
        stokMiktari: yeniStok,
        birim: secilenMalzeme?.birim,
        birimMaliyeti: secilenMalzeme?.birimMaliyeti
      });
      
      toast.success(`✅ ${miktar} ${secilenMalzeme?.birim} malzeme çıkışı yapıldı!`);
      setFormData({ malzemeId: '', miktar: '', aciklama: '' });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Malzeme çıkışı yapılırken hata:', error);
      toast.error('❌ Malzeme çıkışı yapılırken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-red-400"><FaMinusCircle /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Malzeme Çıkışı</h2>
              <p className="text-gray-400 text-xs">Stoktan malzeme düş</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Malzeme *</label>
            <select
              value={formData.malzemeId}
              onChange={(e) => setFormData({...formData, malzemeId: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
              required
              disabled={loading}
            >
              <option value="">Malzeme Seçin</option>
              {malzemeler.map((m) => (
                <option key={m.malzemeId} value={m.malzemeId}>
                  {m.malzemeAdi} (Stok: {m.stokMiktari} {m.birim})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Çıkış Miktarı *</label>
            <input
              type="number"
              step="0.01"
              value={formData.miktar}
              onChange={(e) => setFormData({...formData, miktar: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="0"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Açıklama</label>
            <input
              value={formData.aciklama}
              onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Çıkış nedeni"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={kapat} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={loading}>
              İptal
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> İşleniyor...</> : 'Çıkış Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MalzemeCikis;