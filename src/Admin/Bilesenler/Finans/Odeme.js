// src/Admin/components/Finans/Odeme.js
import React from 'react';
import { FaTimes, FaCreditCard, FaMoneyBillWave, FaWallet, FaUser, FaReceipt } from 'react-icons/fa';

const Odeme = ({ acik, kapat, odemeler, loading }) => {
  if (!acik) return null;

  const getOdemeTipiIcon = (tip) => {
    const t = (tip || '').toLowerCase();
    if (t.includes('kredi') || t.includes('kart')) return <FaCreditCard className="text-blue-400" />;
    if (t.includes('nakit')) return <FaMoneyBillWave className="text-green-400" />;
    if (t.includes('online')) return <FaWallet className="text-purple-400" />;
    return <FaReceipt className="text-gray-400" />;
  };

  const getOdemeTipiRenk = (tip) => {
    const t = (tip || '').toLowerCase();
    if (t.includes('kredi') || t.includes('kart')) return 'bg-blue-500/20 text-blue-400';
    if (t.includes('nakit')) return 'bg-green-500/20 text-green-400';
    if (t.includes('online')) return 'bg-purple-500/20 text-purple-400';
    return 'bg-gray-500/20 text-gray-400';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">💳 Ödeme Geçmişi</h2>
            <p className="text-gray-400 text-xs">Toplam {odemeler.length} ödeme kaydı</p>
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
          ) : odemeler.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz ödeme kaydı yok</p>
          ) : (
            <div className="space-y-3">
              {odemeler.map((odeme, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getOdemeTipiRenk(odeme.odemeTipi)}`}>
                        {getOdemeTipiIcon(odeme.odemeTipi)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">#{odeme.odemeId}</span>
                          <span className="text-gray-400 text-xs">Sipariş #{odeme.siparisId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className={`px-2 py-0.5 rounded ${getOdemeTipiRenk(odeme.odemeTipi)}`}>
                            {odeme.odemeTipi || 'Bilinmiyor'}
                          </span>
                          {odeme.personelId && (
                            <span className="flex items-center gap-1">
                              <FaUser size={10} /> Personel #{odeme.personelId}
                            </span>
                          )}
                          {odeme.kasaId && (
                            <span>Kasa #{odeme.kasaId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">₺{odeme.odemeTutari?.toFixed(2) || 0}</p>
                      <p className="text-gray-400 text-xs">
                        {formatTarih(odeme.odemeTarihi)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {odemeler.length} ödeme</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Odeme;