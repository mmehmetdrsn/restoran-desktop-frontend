// src/Admin/components/Stok/StokDurumu.js
import React from 'react';
import { FaTimes, FaBox, FaExclamationTriangle, FaCheckCircle, FaDollarSign } from 'react-icons/fa';

const StokDurumu = ({ acik, kapat, malzemeler, loading }) => {
  if (!acik) return null;

  const getStokDurumu = (stok) => {
    if (stok <= 0) return { text: 'Tükendi', color: 'bg-red-500/20 text-red-400', icon: <FaExclamationTriangle className="text-red-400" /> };
    if (stok <= 10) return { text: 'Kritik Seviye', color: 'bg-orange-500/20 text-orange-400', icon: <FaExclamationTriangle className="text-orange-400" /> };
    if (stok > 50) return { text: 'Stok Dolu', color: 'bg-green-500/20 text-green-400', icon: <FaCheckCircle className="text-green-400" /> };
    return { text: 'Normal', color: 'bg-blue-500/20 text-blue-400', icon: <FaBox className="text-blue-400" /> };
  };

  // Toplam stok değerini hesapla
  const toplamStokDegeri = malzemeler.reduce((toplam, m) => {
    return toplam + ((m.stokMiktari || 0) * (m.birimMaliyeti || 0));
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📦 Güncel Stok Durumları</h2>
            <p className="text-gray-400 text-xs">Toplam {malzemeler.length} malzeme</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-white rounded-full"></div>
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : malzemeler.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz malzeme eklenmemiş</p>
          ) : (
            <>
              {/* Özet Kartı */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 mb-4 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Toplam Stok Değeri</p>
                    <p className="text-white text-2xl font-bold">₺{toplamStokDegeri.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Toplam Malzeme</p>
                    <p className="text-white text-lg font-bold">{malzemeler.length}</p>
                  </div>
                </div>
              </div>

              {/* Malzeme Listesi */}
              <div className="space-y-3">
                {malzemeler.map((malzeme, index) => {
                  const durum = getStokDurumu(malzeme.stokMiktari || 0);
                  
                  return (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                            {durum.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{malzeme.malzemeAdi || 'Bilinmiyor'}</span>
                              <span className="text-gray-400 text-xs">#{malzeme.malzemeId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>Birim: {malzeme.birim || '-'}</span>
                              <span className={`px-2 py-0.5 rounded ${durum.color}`}>
                                {durum.text}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">
                            {malzeme.stokMiktari?.toFixed(2) || 0}
                          </p>
                          {malzeme.birimMaliyeti && (
                            <p className="text-gray-400 text-xs flex items-center justify-end gap-1">
                              <FaDollarSign size={10} /> {malzeme.birimMaliyeti?.toFixed(2)} / {malzeme.birim}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Stok Durumu Çubuğu */}
                      <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            malzeme.stokMiktari <= 0 ? 'bg-red-500' :
                            malzeme.stokMiktari <= 10 ? 'bg-orange-500' :
                            malzeme.stokMiktari > 50 ? 'bg-green-500' :
                            'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min((malzeme.stokMiktari || 0) / 100 * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {malzemeler.length} malzeme</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default StokDurumu;