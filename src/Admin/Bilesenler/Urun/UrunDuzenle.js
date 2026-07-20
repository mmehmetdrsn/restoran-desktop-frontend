// src/Admin/components/Urun/UrunDuzenle.js
import React from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productService } from '../../../api/api';

const UrunDuzenle = ({ 
  acik, kapat, onSuccess, kategoriler,
  duzenlenecekUrunId, setDuzenlenecekUrunId,
  duzenlenecekUrunAdi, setDuzenlenecekUrunAdi,
  duzenlenecekUrunFiyat, setDuzenlenecekUrunFiyat,
  duzenlenecekUrunKategori, setDuzenlenecekUrunKategori,
  duzenlenecekUrunAciklama, setDuzenlenecekUrunAciklama,
  loading, setLoading
}) => {
  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duzenlenecekUrunId || !duzenlenecekUrunAdi || !duzenlenecekUrunFiyat) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }
    const fiyat = parseFloat(duzenlenecekUrunFiyat);
    if (isNaN(fiyat) || fiyat <= 0) {
      toast.warning('Geçerli bir fiyat girin!');
      return;
    }
    try {
      setLoading(true);
      await productService.update(parseInt(duzenlenecekUrunId), {
        urunAdi: duzenlenecekUrunAdi.trim(),
        fiyat: fiyat,
        kategoriId: parseInt(duzenlenecekUrunKategori) || 1,
        acikLamaLar: duzenlenecekUrunAciklama.trim()
      });
      toast.success('✅ Ürün başarıyla güncellendi!');
      setDuzenlenecekUrunId('');
      setDuzenlenecekUrunAdi('');
      setDuzenlenecekUrunFiyat('');
      setDuzenlenecekUrunKategori('');
      setDuzenlenecekUrunAciklama('');
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      toast.error('❌ Ürün güncellenirken hata oluştu!');
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
              <h2 className="text-white font-bold text-lg">Ürün Düzenle</h2>
              <p className="text-gray-400 text-xs">Ürün bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Ürün ID *</label>
            <input
              type="number"
              value={duzenlenecekUrunId}
              onChange={(e) => setDuzenlenecekUrunId(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: 1"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Ürün Adı *</label>
            <input
              value={duzenlenecekUrunAdi}
              onChange={(e) => setDuzenlenecekUrunAdi(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: Adana Kebap"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Fiyat (TL) *</label>
            <input
              type="number"
              step="0.01"
              value={duzenlenecekUrunFiyat}
              onChange={(e) => setDuzenlenecekUrunFiyat(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Örn: 85"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori</label>
            <select
              value={duzenlenecekUrunKategori}
              onChange={(e) => setDuzenlenecekUrunKategori(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
              required
              disabled={loading}
            >
              <option value="">-- Kategori Seç --</option>
              {kategoriler.map((k) => (
                <option key={k.kategoriId || k.id} value={k.kategoriId || k.id}>
                  {k.kategoriAdi || k.name} (ID: {k.kategoriId || k.id})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Kategori ID'sine göre seçim yapın</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Açıklama</label>
            <textarea
              value={duzenlenecekUrunAciklama}
              onChange={(e) => setDuzenlenecekUrunAciklama(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
              placeholder="Ürün açıklamasını girin (isteğe bağlı)"
              rows="3"
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

export default UrunDuzenle;