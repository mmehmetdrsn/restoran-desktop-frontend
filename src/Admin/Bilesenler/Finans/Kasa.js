// src/Admin/components/Finans/Kasa.js
import React, { useState } from 'react';
import { 
  FaTimes, FaWallet, FaUser, FaCalendarAlt, 
  FaPlus, FaMinus, FaSpinner, FaCheck 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cashService } from '../../../api/api';

const Kasa = ({ acik, kapat, kasaHareketleri, loading, onSuccess }) => {
  const [kasaAcLoading, setKasaAcLoading] = useState(false);
  const [acilisBakiyesi, setAcilisBakiyesi] = useState('');
  const [personelId, setPersonelId] = useState('');
  const [kapanisBakiyesi, setKapanisBakiyesi] = useState('');

  if (!acik) return null;

  // Açık kasayı bul
  const acikKasa = kasaHareketleri?.find(k => k.kasaDurumu === 'Açık' || k.kasaDurumu === 'Açık');

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

  // ✅ Kasa Aç
  const handleKasaAc = async (e) => {
    e.preventDefault();
    
    if (!personelId) {
      toast.warning('Lütfen personel ID girin!');
      return;
    }

    const bakiye = parseFloat(acilisBakiyesi) || 0;
    if (bakiye < 0) {
      toast.warning('Açılış bakiyesi negatif olamaz!');
      return;
    }

    try {
      setKasaAcLoading(true);
      await cashService.create({
        kasaDurumu: 'Açık',
        acilisBakiyesi: bakiye,
        personelId: parseInt(personelId)
      });
      
      toast.success('✅ Kasa başarıyla açıldı!');
      setAcilisBakiyesi('');
      setPersonelId('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Kasa açılırken hata:', error);
      if (error.response?.data) {
        toast.error(`❌ ${error.response.data}`);
      } else {
        toast.error('❌ Kasa açılırken hata oluştu!');
      }
    } finally {
      setKasaAcLoading(false);
    }
  };

  // ✅ Kasa Kapat
  const handleKasaKapat = async () => {
    if (!acikKasa) {
      toast.warning('Açık kasa bulunamadı!');
      return;
    }

    const kapanis = parseFloat(kapanisBakiyesi);
    if (isNaN(kapanis) || kapanis < 0) {
      toast.warning('Geçerli bir kapanış bakiyesi girin!');
      return;
    }

    if (!window.confirm(
      `Kasa #${acikKasa.kasaId} kapatmak istediğinize emin misiniz?\n\n` +
      `Açılış Bakiyesi: ₺${acikKasa.acilisBakiyesi?.toFixed(2) || 0}\n` +
      `Kapanış Bakiyesi: ₺${kapanis.toFixed(2)}`
    )) {
      return;
    }

    try {
      setKasaAcLoading(true);
      await cashService.update(acikKasa.kasaId, {
        kasaDurumu: 'Kapalı',
        kapanisBakiyesi: kapanis,
        personelId: acikKasa.personelId
      });
      
      toast.success(`✅ Kasa #${acikKasa.kasaId} başarıyla kapatıldı!`);
      setKapanisBakiyesi('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Kasa kapatılırken hata:', error);
      toast.error('❌ Kasa kapatılırken hata oluştu!');
    } finally {
      setKasaAcLoading(false);
    }
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
            <h2 className="text-white font-bold text-lg">🏦 Kasa Yönetimi</h2>
            <p className="text-gray-400 text-xs">Kasa işlemleri ve hareketleri</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* ✅ Kasa Durumu ve İşlemleri */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400 text-sm">Kasa Durumu</p>
                {acikKasa ? (
                  <p className="text-green-400 font-medium">✅ Açık Kasa #{acikKasa.kasaId}</p>
                ) : (
                  <p className="text-red-400 font-medium">❌ Açık Kasa Yok</p>
                )}
              </div>
              <button
                onClick={onSuccess}
                disabled={kasaAcLoading}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50 flex items-center gap-1"
              >
                {kasaAcLoading ? <FaSpinner className="animate-spin" /> : '🔄 Yenile'}
              </button>
            </div>

            {/* Kasa Açma Formu */}
            {!acikKasa && (
              <form onSubmit={handleKasaAc} className="space-y-3 mt-3 pt-3 border-t border-white/10">
                <h4 className="text-green-400 font-medium text-sm flex items-center gap-2">
                  <FaPlus /> Yeni Kasa Aç
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Açılış Bakiyesi
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={acilisBakiyesi}
                      onChange={(e) => setAcilisBakiyesi(e.target.value)}
                      className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none text-sm"
                      placeholder="0.00"
                      disabled={kasaAcLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Personel ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={personelId}
                      onChange={(e) => setPersonelId(e.target.value)}
                      className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none text-sm"
                      placeholder="ID girin"
                      required
                      disabled={kasaAcLoading}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={kasaAcLoading || !personelId}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {kasaAcLoading ? <FaSpinner className="animate-spin" /> : <FaWallet />}
                  Kasa Aç
                </button>
              </form>
            )}

            {/* Kasa Kapama Formu */}
            {acikKasa && (
              <div className="space-y-3 mt-3 pt-3 border-t border-white/10">
                <h4 className="text-red-400 font-medium text-sm flex items-center gap-2">
                  <FaMinus /> Kasayı Kapat
                </h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Kapanış Bakiyesi <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={kapanisBakiyesi}
                      onChange={(e) => setKapanisBakiyesi(e.target.value)}
                      className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none text-sm"
                      placeholder="Gün sonu sayım tutarı"
                      disabled={kasaAcLoading}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleKasaKapat}
                      disabled={kasaAcLoading || !kapanisBakiyesi}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm h-[42px]"
                    >
                      {kasaAcLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                      Kapat
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">
                  💡 Açılış: ₺{acikKasa.acilisBakiyesi?.toFixed(2) || 0}
                </p>
              </div>
            )}
          </div>

          {/* ✅ Özet Kartı */}
          {kasaHareketleri.length > 0 && (
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
          )}

          {/* ✅ Kasa Listesi */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-white rounded-full"></div>
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : kasaHareketleri.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz kasa hareketi yok</p>
          ) : (
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