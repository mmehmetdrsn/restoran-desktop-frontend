// src/Admin/components/Urun/UrunSil.js
import React, { useState, useEffect } from 'react';
import { FaTrash, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productService } from '../../../api/api';

// ✅ ONAY MODALI BİLEŞENİ
const SilmeOnayModal = ({ acik, kapat, onConfirm, urunAdi }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-2xl">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Ürünü Pasife Al</h2>
            <p className="text-gray-400 text-sm">Bu işlem geri alınabilir</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-2">
          <span className="text-white font-medium">"{urunAdi}"</span> ürününü pasif duruma getirmek istediğinize emin misiniz?
        </p>
        
        <p className="text-gray-500 text-xs mb-6">
          ℹ️ Bu işlem ürünü menüde göstermez, ancak veritabanından silmez. İlerleyen zamanda tekrar aktif edilebilir.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={kapat}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all"
          >
            İptal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
          >
            Pasife Al
          </button>
        </div>
      </div>
    </div>
  );
};

const UrunSil = ({ acik, kapat, onSuccess }) => {
  const [urunId, setUrunId] = useState('');
  const [urunBilgisi, setUrunBilgisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  
  // ✅ Onay modalı state'i
  const [onayModal, setOnayModal] = useState({ acik: false, urunAdi: '' });

  // Modal kapandığında sıfırla
  useEffect(() => {
    if (!acik) {
      setUrunId('');
      setUrunBilgisi(null);
      setOnayModal({ acik: false, urunAdi: '' });
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Ürün bilgilerini getir
  const handleUrunAra = async () => {
    if (!urunId) {
      toast.warning('Lütfen ürün ID girin!');
      return;
    }

    setAraniyor(true);
    setUrunBilgisi(null);

    try {
      const response = await productService.getById(parseInt(urunId));
      const data = response.data;
      
      if (data && data.urunId) {
        setUrunBilgisi(data);
        toast.success(`✅ ${data.urunAdi} bulundu!`);
      } else {
        toast.error('❌ Ürün bulunamadı!');
      }
    } catch (error) {
      console.error('Ürün aranırken hata:', error);
      toast.error('❌ Ürün bulunamadı!');
    } finally {
      setAraniyor(false);
    }
  };

  // ✅ Silme butonuna tıklandığında onay modalını aç
  const silmeTiklandi = (e) => {
    e.preventDefault();
    
    if (!urunId) {
      toast.warning('Lütfen ürün ID girin!');
      return;
    }

    if (!urunBilgisi) {
      toast.warning('Lütfen önce ürünü arayın!');
      return;
    }

    if (urunBilgisi.isActive === false) {
      toast.warning('⚠️ Bu ürün zaten pasif durumda!');
      return;
    }

    // ✅ Onay modalını aç
    setOnayModal({
      acik: true,
      urunAdi: urunBilgisi.urunAdi || urunId
    });
  };

  // ✅ Silme işlemini onayla
  const silmeOnayla = async () => {
    setOnayModal({ acik: false, urunAdi: '' });
    setLoading(true);

    try {
      await productService.delete(parseInt(urunId));
      
      toast.success(`✅ "${urunBilgisi?.urunAdi || urunId}" ürünü pasif duruma getirildi!`);
      
      setUrunId('');
      setUrunBilgisi(null);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(`❌ ${errorData.message}`);
        } else {
          toast.error('❌ Ürün pasif duruma getirilirken hata oluştu!');
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
    <>
      {/* Ana Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-red-400"><FaTrash /></div>
              <div>
                <h2 className="text-white font-bold text-lg">Ürünü Pasife Al</h2>
                <p className="text-gray-400 text-xs">Silmek istediğiniz Ürün ID'sini girin</p>
              </div>
            </div>
            <button onClick={kapat} className="text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={silmeTiklandi} className="space-y-4">
            {/* ID Girişi ve Ara Butonu */}
            <div className="flex gap-2">
              <input
                type="number"
                value={urunId}
                onChange={(e) => {
                  setUrunId(e.target.value);
                  setUrunBilgisi(null);
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Ürün ID girin (Örn: 1)"
                required
                disabled={loading || araniyor}
              />
              <button
                type="button"
                onClick={handleUrunAra}
                disabled={loading || araniyor || !urunId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {araniyor ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ara...</>
                ) : (
                  'Ara'
                )}
              </button>
            </div>

            {/* Ürün Bilgisi */}
            {urunBilgisi && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{urunBilgisi.urunAdi}</p>
                    <p className="text-gray-400 text-sm">
                      Fiyat: ₺{urunBilgisi.fiyat} • Kategori: {urunBilgisi.kategoriAdi || 'Belirtilmemiş'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    urunBilgisi.isActive !== false 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {urunBilgisi.isActive !== false ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </div>
                {urunBilgisi.aciklamalar && (
                  <p className="text-gray-400 text-xs mt-2 border-t border-white/5 pt-2">
                    📝 {urunBilgisi.aciklamalar}
                  </p>
                )}
              </div>
            )}

            {/* Zaten pasif olan ürün uyarısı */}
            {urunBilgisi && urunBilgisi.isActive === false && (
              <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20 flex items-start gap-3">
                <FaInfoCircle className="text-red-400 text-lg mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-medium">Bu ürün zaten pasif!</p>
                  <p className="text-gray-400 text-xs">
                    #{urunId} ID'li ürün zaten pasif durumda. Tekrar işlem yapmanıza gerek yok.
                  </p>
                </div>
              </div>
            )}

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
                disabled={loading || !urunBilgisi || urunBilgisi?.isActive === false} 
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> İşleniyor...</>
                ) : (
                  'Pasife Al'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ SİLME ONAY MODALI */}
      <SilmeOnayModal 
        acik={onayModal.acik}
        kapat={() => setOnayModal({ acik: false, urunAdi: '' })}
        onConfirm={silmeOnayla}
        urunAdi={onayModal.urunAdi}
      />
    </>
  );
};

export default UrunSil;