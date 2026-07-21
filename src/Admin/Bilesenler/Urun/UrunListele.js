// src/Admin/components/Urun/UrunListele.js
import React from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const UrunListele = ({ acik, kapat, urunler }) => {
  if (!acik) return null;

  // ✅ Tüm olası aktiflik durumlarını kontrol et
  const isUrunAktif = (urun) => {
    // Tüm olası alan adlarını kontrol et
    const active = urun.isActive ?? urun.IsActive ?? urun.is_active ?? urun.IS_ACTIVE ?? urun.active ?? urun.Active;
    
    // null veya undefined ise aktif kabul et (varsayılan)
    if (active === null || active === undefined) return true;
    
    // true, 1, "true", "1" ise aktif
    if (active === true || active === 1 || active === 'true' || active === '1') return true;
    
    // false, 0, "false", "0" ise pasif
    return false;
  };

  // ✅ Ürünün pasif olup olmadığını kontrol et
  const isUrunPasif = (urun) => {
    return !isUrunAktif(urun);
  };

  const aktifUrunler = urunler.filter(isUrunAktif);
  const pasifUrunler = urunler.filter(isUrunPasif);

  console.log('📊 Tüm ürünler:', urunler);
  console.log('📊 Aktif ürünler:', aktifUrunler);
  console.log('📊 Pasif ürünler:', pasifUrunler);

  // Eğer pasif ürün yoksa ama backend'den geliyorsa, alan adını kontrol et
  if (pasifUrunler.length === 0 && urunler.length > 0) {
    console.warn('⚠️ Pasif ürün bulunamadı! İlk ürünün alanlarını kontrol edelim:');
    console.log('🔍 İlk ürün:', urunler[0]);
    console.log('🔍 isActive değeri:', urunler[0]?.isActive);
    console.log('🔍 IsActive değeri:', urunler[0]?.IsActive);
    console.log('🔍 Tüm anahtarlar:', Object.keys(urunler[0]));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Ürün Listesi</h2>
            <p className="text-gray-400 text-xs">
              Toplam {urunler.length} ürün 
              <span className="text-green-400 ml-2">✅ {aktifUrunler.length} aktif</span>
              <span className="text-red-400 ml-2">❌ {pasifUrunler.length} pasif</span>
            </p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {urunler.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Henüz ürün eklenmemiş</p>
          ) : (
            <div className="space-y-2">
              {urunler.map((urun, index) => {
                const aktif = isUrunAktif(urun);
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      aktif ? 'bg-white/5 hover:bg-white/10' : 'bg-white/5 opacity-60 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs">{index + 1}.</span>
                      <div>
                        <span className="text-white text-sm">
                          {urun.urunAdi || urun.UrunAdi || urun.name || 'Bilinmiyor'}
                        </span>
                        {!aktif && (
                          <span className="ml-2 text-xs text-red-400">(Pasif)</span>
                        )}
                        <p className="text-gray-500 text-xs">{urun.kategori || urun.kategoriAdi || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-sm font-medium">
                        ₺{urun.fiyat || urun.Fiyat || urun.price || 0}
                      </span>
                      <span className="text-gray-500 text-xs">#{urun.urunId || urun.UrunId || urun.id}</span>
                      {aktif ? (
                        <FaEye className="text-green-400" size={14} />
                      ) : (
                        <FaEyeSlash className="text-red-400" size={14} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">
            Toplam: {urunler.length} ürün 
            (✅ {aktifUrunler.length} aktif | ❌ {pasifUrunler.length} pasif)
          </span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrunListele;