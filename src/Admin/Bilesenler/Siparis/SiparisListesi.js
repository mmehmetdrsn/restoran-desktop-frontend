// src/Admin/Bilesenler/Siparis/SiparisListesi.js
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const SiparisListesi = ({ 
  orders, 
  siparisGosterimModu, 
  aktifSiparisler, 
  tamamlananSiparisler, 
  iptalSiparisler, 
  iadeSiparisler, 
  iptalIadeSiparisler,
  handleSiparisTamamla
}) => {
  // Durum renkleri
  const getDurumRenk = (durum) => {
    const d = (durum || '').toUpperCase();
    if (d === 'TAMAMLANDI') return 'bg-green-500/20 text-green-400';
    if (d === 'ODENDI') return 'bg-purple-500/20 text-purple-400';
    if (d === 'BEKLEMEDE') return 'bg-yellow-500/20 text-yellow-400';
    if (d === 'HAZIRLANIYOR') return 'bg-blue-500/20 text-blue-400';
    if (d === 'HAZIR') return 'bg-cyan-500/20 text-cyan-400';
    if (d === 'TESLIM EDILDI') return 'bg-indigo-500/20 text-indigo-400';
    if (d === 'IPTAL') return 'bg-red-500/20 text-red-400';
    if (d === 'IADE') return 'bg-orange-500/20 text-orange-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  // Durum iconları
  const getDurumIcon = (durum) => {
    const d = (durum || '').toUpperCase();
    if (d === 'TAMAMLANDI') return '✅';
    if (d === 'ODENDI') return '💰';
    if (d === 'BEKLEMEDE') return '⏳';
    if (d === 'HAZIRLANIYOR') return '👨‍🍳';
    if (d === 'HAZIR') return '✅';
    if (d === 'TESLIM EDILDI') return '🚚';
    if (d === 'IPTAL') return '❌';
    if (d === 'IADE') return '🔄';
    return '📋';
  };

  // Gösterilecek siparişleri seç
  const getGosterilecekSiparisler = () => {
    switch(siparisGosterimModu) {
      case 'active': return aktifSiparisler;
      case 'completed': return tamamlananSiparisler;
      case 'cancelled': return iptalSiparisler;
      case 'iade': return iadeSiparisler;
      case 'iptal_iade': return iptalIadeSiparisler;
      default: return orders;
    }
  };

  const gosterilecekSiparisler = getGosterilecekSiparisler();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-black/90 backdrop-blur-sm rounded-2xl border border-white/10">
        <FaShoppingCart className="text-5xl mx-auto mb-4 text-gray-600" />
        <p>Henüz sipariş yok</p>
        <p className="text-xs text-gray-500 mt-1">"Tüm Siparişler" butonuna tıklayarak siparişleri görüntüleyin</p>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">
          {siparisGosterimModu === 'all' ? 'Tüm Siparişler' :
           siparisGosterimModu === 'active' ? 'Aktif Siparişler' :
           siparisGosterimModu === 'completed' ? 'Tamamlanan Siparişler' :
           siparisGosterimModu === 'cancelled' ? 'İptal Edilen Siparişler' :
           siparisGosterimModu === 'iade' ? 'İade Edilen Siparişler' :
           'İptal / İade Siparişleri'} 
          ({gosterilecekSiparisler.length})
        </h4>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>🟡 Aktif: {aktifSiparisler.length}</span>
          <span>🟢 Tamamlandı: {tamamlananSiparisler.length}</span>
          <span>🔴 İptal: {iptalSiparisler.length}</span>
          <span>🔄 İade: {iadeSiparisler.length}</span>
        </div>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {gosterilecekSiparisler.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Bu kategoride sipariş bulunmuyor.</p>
          </div>
        ) : (
          gosterilecekSiparisler.map((siparis) => (
            <div key={siparis.siparisId} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Sipariş #{siparis.siparisId}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getDurumRenk(siparis.siparisDurumu)}`}>
                      {getDurumIcon(siparis.siparisDurumu)} {siparis.siparisDurumu || 'Bilinmiyor'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Masa: {siparis.masaNo || 'Paket'} • {siparis.uyeAdi || 'Ziyaretçi'} • {siparis.detaySayisi || 0} ürün
                  </p>
                  <p className="text-gray-500 text-xs">
                    {siparis.siparisTarihi ? new Date(siparis.siparisTarihi).toLocaleString('tr-TR') : '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">₺{siparis.toplamTutar?.toFixed(2) || 0}</p>
                  <div className="flex gap-2 mt-1 justify-end">
                    {siparis.siparisDurumu !== 'TAMAMLANDI' && 
                     siparis.siparisDurumu !== 'IPTAL' && 
                     siparis.siparisDurumu !== 'ODENDI' &&
                     siparis.siparisDurumu !== 'IADE' && (
                      <button
                        onClick={() => handleSiparisTamamla(siparis.siparisId)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all"
                      >
                        ✅ Tamamla
                      </button>
                    )}
                    {(siparis.siparisDurumu === 'TAMAMLANDI' || siparis.siparisDurumu === 'ODENDI') && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                        ✅ Tamamlandı
                      </span>
                    )}
                    {siparis.siparisDurumu === 'IPTAL' && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg">
                        ❌ İptal
                      </span>
                    )}
                    {siparis.siparisDurumu === 'IADE' && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">
                        🔄 İade
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SiparisListesi;