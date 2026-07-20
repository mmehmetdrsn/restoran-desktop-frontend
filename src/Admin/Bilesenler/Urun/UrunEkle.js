// src/Admin/components/Urun/UrunEkle.js
import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productService } from '../../../api/api';

const UrunEkle = ({ acik, kapat, onSuccess, kategoriler, urunAdi, setUrunAdi, urunFiyat, setUrunFiyat, urunKategoriId, 
  setUrunKategoriId,urunAciklama, setUrunAciklama, loading, setLoading }) => {
  if (!acik) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urunAdi || !urunFiyat || !urunKategoriId) {
      toast.warning('Lütfen tüm alanları doldurun.');
      return;
    }
    const fiyat = Number(urunFiyat);
    if (isNaN(fiyat) || fiyat <= 0) {
      toast.warning('Geçerli bir fiyat girin.');
      return;
    }
    try {
      setLoading(true);
      await productService.create({
        urunAdi: urunAdi.trim(),
        fiyat: fiyat,
        kategoriId: parseInt(urunKategoriId),
        aciklamalar: urunAciklama.trim()

      });
      toast.success('✅ Ürün eklendi.');
      setUrunAdi('');
      setUrunFiyat('');
      setUrunKategoriId('');
      kapat();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Ürün eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-gray-400"><FaPlus /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Ürün Ekle</h2>
              <p className="text-gray-400 text-xs">Yeni ürün bilgilerini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Ürün Adı</label>
            <input value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" placeholder="Örn: Adana Kebap" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Fiyat (TL)</label>
            <input value={urunFiyat} onChange={(e) => setUrunFiyat(e.target.value)} className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" placeholder="Örn: 85" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori</label>
            <select value={urunKategoriId} onChange={(e) => setUrunKategoriId(e.target.value)} className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none" required>
              <option value="">-- Kategori Seç --</option>
              {kategoriler.map(k => (
                <option key={k.kategoriId || k.id} value={k.kategoriId || k.id}>{k.kategoriAdi || k.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Açıklama
              <span className="text-gray-500 text-xs ml-1">(isteğe bağlı)</span>
            </label>
            <textarea
              value={urunAciklama}
              onChange={(e) => setUrunAciklama(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
              placeholder="Ürün açıklamasını girin (ör: Acılı, ekstra peynirli vb.)"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Butonlar */}
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
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Kaydediliyor...</>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UrunEkle;