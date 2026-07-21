// src/Admin/components/Urun/UrunDuzenle.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaSpinner, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productService } from '../../../api/api';

const UrunDuzenle = ({ acik, kapat, onSuccess, kategoriler }) => {
  const [urunId, setUrunId] = useState('');
  const [loading, setLoading] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [urunBulundu, setUrunBulundu] = useState(false);
  
  // ✅ Form state'i
  const [formData, setFormData] = useState({
    urunAdi: '',
    fiyat: '',
    kategoriId: '',
    aciklamalar: '',
    isActive: true
  });

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!acik) {
      setUrunId('');
      setFormData({
        urunAdi: '',
        fiyat: '',
        kategoriId: '',
        aciklamalar: '',
        isActive: true
      });
      setUrunBulundu(false);
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Ürün ara ve bilgileri getir
  const handleUrunAra = async (e) => {
    e.preventDefault();
    if (!urunId) {
      toast.warning('Lütfen ürün ID girin!');
      return;
    }

    setLoading(true);
    setUrunBulundu(false);

    try {
      const response = await productService.getById(parseInt(urunId));
      const data = response.data;
      
      console.log('📋 Gelen ürün verisi:', data);
      
      if (data && data.urunId) {
        // ✅ Forma verileri doldur
        setFormData({
          urunAdi: data.urunAdi || '',
          fiyat: data.fiyat || '',
          kategoriId: data.kategoriId || '',
          aciklamalar: data.aciklamalar || '',
          isActive: data.isActive !== false // null veya true ise aktif
        });
        
        setUrunBulundu(true);
        const durum = data.isActive !== false ? 'aktif' : 'pasif';
        toast.success(`✅ ${data.urunAdi} bulundu! (${durum})`);
      } else {
        toast.error('❌ Ürün bulunamadı!');
        setUrunBulundu(false);
      }
    } catch (error) {
      console.error('Ürün aranırken hata:', error);
      toast.error('❌ Ürün bulunamadı!');
      setUrunBulundu(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!urunId) {
      toast.warning('Lütfen ürün ID girin!');
      return;
    }

    if (!formData.urunAdi || !formData.fiyat || !formData.kategoriId) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    const fiyat = parseFloat(formData.fiyat);
    if (isNaN(fiyat) || fiyat <= 0) {
      toast.warning('Geçerli bir fiyat girin!');
      return;
    }

    setYukleniyor(true);
    try {
      const data = {
        urunAdi: formData.urunAdi.trim(),
        fiyat: fiyat,
        kategoriId: parseInt(formData.kategoriId),
        aciklamalar: formData.aciklamalar || null,
        isActive: formData.isActive  // ✅ Aktif/Pasif durumunu da gönder
      };

      console.log('📤 Güncellenen veri:', data);

      await productService.update(parseInt(urunId), data);
      
      const durum = formData.isActive ? 'aktif' : 'pasif';
      toast.success(`✅ Ürün başarıyla güncellendi! (${durum})`);
      
      setUrunId('');
      setFormData({
        urunAdi: '',
        fiyat: '',
        kategoriId: '',
        aciklamalar: '',
        isActive: true
      });
      setUrunBulundu(false);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join('\n');
          toast.error(`❌ ${errorMessages}`);
        } else if (errorData.message) {
          toast.error(`❌ ${errorData.message}`);
        } else {
          toast.error('❌ Ürün güncellenirken bir hata oluştu!');
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

  // ✅ Aktif/Pasif durumunu değiştir
  const toggleDurum = () => {
    setFormData({...formData, isActive: !formData.isActive});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
          {/* ✅ ID ARAMA ALANI */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex gap-2">
              <input
                type="number"
                value={urunId}
                onChange={(e) => setUrunId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Ürün ID girin (Örn: 1)"
                required
                disabled={loading || yukleniyor}
              />
              <button
                type="button"
                onClick={handleUrunAra}
                disabled={loading || yukleniyor || !urunId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Aranıyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>
            {urunBulundu && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${formData.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {formData.isActive ? '✅ Ürün bulundu! (Aktif)' : '❌ Ürün bulundu! (Pasif)'}
                {!formData.isActive && (
                  <span className="text-yellow-400 text-xs ml-2">(Düzenleyip aktif edebilirsiniz)</span>
                )}
              </p>
            )}
          </div>

          {/* ✅ ÜRÜN BİLGİLERİ */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> Ürün Bilgileri
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Ürün Adı <span className="text-red-400">*</span>
                </label>
                <input
                  value={formData.urunAdi}
                  onChange={(e) => setFormData({...formData, urunAdi: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Ürün adını girin"
                  required
                  disabled={!urunBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Fiyat (TL) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fiyat}
                  onChange={(e) => setFormData({...formData, fiyat: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="0.00"
                  required
                  disabled={!urunBulundu || yukleniyor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Kategori <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.kategoriId}
                  onChange={(e) => setFormData({...formData, kategoriId: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  required
                  disabled={!urunBulundu || yukleniyor}
                >
                  <option value="">-- Kategori Seç --</option>
                  {kategoriler.map((k) => (
                    <option key={k.kategoriId || k.id} value={k.kategoriId || k.id}>
                      {k.kategoriAdi || k.name} (ID: {k.kategoriId || k.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Açıklama
                  <span className="text-gray-500 text-xs ml-1">(isteğe bağlı)</span>
                </label>
                <textarea
                  value={formData.aciklamalar}
                  onChange={(e) => setFormData({...formData, aciklamalar: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  placeholder="Ürün açıklamasını girin"
                  rows="3"
                  disabled={!urunBulundu || yukleniyor}
                />
              </div>
            </div>
          </div>

          {/* ✅ DURUM BİLGİSİ - Aktif/Pasif */}
          {urunBulundu && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Mevcut Durum</p>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {formData.isActive ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleDurum}
                  disabled={!urunBulundu || yukleniyor}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition-all flex items-center gap-2 ${
                    formData.isActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {formData.isActive ? (
                    <><FaTimes /> Pasife Al</>
                  ) : (
                    <><FaUndo /> Aktif Et</>
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {formData.isActive 
                  ? '💡 Ürün menüde görünür. Pasife almak için tıklayın.' 
                  : '💡 Ürün menüde görünmez. Aktif etmek için tıklayın.'}
              </p>
            </div>
          )}

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
              disabled={!urunBulundu || yukleniyor} 
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

export default UrunDuzenle;