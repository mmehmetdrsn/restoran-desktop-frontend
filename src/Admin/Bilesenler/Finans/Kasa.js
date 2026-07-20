// src/Admin/components/Finans/Kasa.js
import React from 'react';
import { FaTimes, FaWallet, FaUser, FaCalendarAlt } from 'react-icons/fa';

const Kasa = ({ acik, kapat, kasaHareketleri, loading }) => {
  if (!acik) return null;

  const getDurumRenk = (durum) => {
    const d = (durum || '').toLowerCase();
    if (d.includes('açık') || d.includes('acik')) return 'bg-green-500/20 text-green-400';
    if (d.includes('kapalı') || d.includes('kapali')) return 'bg-red-500/20 text-red-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  const formatTarih = (tarih) => {
    if (!tarih) return '-';
    const date = new Date(tarih);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toplam bakiyeyi hesapla
  const toplamBakiye = kasaHareketleri.reduce((toplam, kasa) => {
    return toplam + (kasa.acilisBakiyesi || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">🏦 Kasa Hareketleri</h2>
            <p className="text-gray-400 text-xs">Toplam {kasaHareketleri.length} kasa kaydı</p>
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
          ) : kasaHareketleri.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz kasa hareketi yok</p>
          ) : (
            <>
              {/* Özet Kartı */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 mb-4 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Toplam Kasa Bakiyesi</p>
                    <p className="text-white text-2xl font-bold">₺{toplamBakiye.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Toplam Kasa</p>
                    <p className="text-white text-lg font-bold">{kasaHareketleri.length}</p>
                  </div>
                </div>
              </div>

              {/* Kasa Listesi */}
              <div className="space-y-3">
                {kasaHareketleri.map((kasa, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                          <FaWallet />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">Kasa #{kasa.kasaId}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getDurumRenk(kasa.kasaDurumu)}`}>
                              {kasa.kasaDurumu || 'Bilinmiyor'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {kasa.personelId && (
                              <span className="flex items-center gap-1">
                                <FaUser size={10} /> Personel #{kasa.personelId}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={10} /> 
                              {formatTarih(kasa.acilisTarihi)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col">
                          {kasa.acilisBakiyesi !== null && kasa.acilisBakiyesi !== undefined && (
                            <p className="text-green-400 text-sm">
                              Açılış: ₺{kasa.acilisBakiyesi?.toFixed(2) || 0}
                            </p>
                          )}
                          {kasa.kapanisBakiyesi !== null && kasa.kapanisBakiyesi !== undefined && (
                            <p className="text-blue-400 text-sm">
                              Kapanış: ₺{kasa.kapanisBakiyesi?.toFixed(2) || 0}
                            </p>
                          )}
                          {kasa.kapanisTarihi && (
                            <p className="text-gray-500 text-xs">
                              Kapanış: {formatTarih(kasa.kapanisTarihi)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {kasaHareketleri.length} kasa</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kasa;