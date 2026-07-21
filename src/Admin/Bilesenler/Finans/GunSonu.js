// src/Admin/components/Finans/GunSonu.js
import React, { useState } from 'react';
import { FaTimes, FaCheckDouble, FaMoneyBillWave, FaCalculator, FaPrint, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cashService, orderService } from '../../../api/api';

const GunSonu = ({ acik, kapat }) => {
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [rapor, setRapor] = useState(null);
  const [kasaListesi, setKasaListesi] = useState([]);
  const [seciliKasa, setSeciliKasa] = useState(null);

  if (!acik) return null;

  // Tüm kasaları getir
  const handleKasalarıGetir = async () => {
    try {
      setLoading(true);
      const response = await cashService.getAll();
      setKasaListesi(response.data || []);
      
      // Açık olan kasayı bul
      const acikKasa = response.data?.find(k => k.kasaDurumu === 'Açık');
      if (acikKasa) {
        setSeciliKasa(acikKasa);
        toast.info(`✅ Açık kasa bulundu: #${acikKasa.kasaId}`);
      } else {
        toast.warning('⚠️ Açık kasa bulunamadı!');
      }
    } catch (error) {
      console.error('Kasalar yüklenirken hata:', error);
      toast.error('❌ Kasalar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Gün sonu raporu
  const handleGunSonuRaporu = async () => {
    try {
      setLoading(true);
      
      // Günlük siparişleri getir
      const siparisResponse = await orderService.getAll();
      const tumSiparisler = siparisResponse.data || [];
      
      // Seçilen tarihe göre filtrele
      const gunlukSiparisler = tumSiparisler.filter(s => {
        if (!s.siparisTarihi) return false;
        const siparisTarihi = new Date(s.siparisTarihi).toISOString().split('T')[0];
        return siparisTarihi === tarih;
      });

      // Özet hesaplamalar
      const toplamSiparis = gunlukSiparisler.length;
      const toplamCiro = gunlukSiparisler.reduce((sum, s) => sum + (s.toplamTutar || 0), 0);
      const tamamlanan = gunlukSiparisler.filter(s => s.siparisDurumu === 'TAMAMLANDI' || s.siparisDurumu === 'ODENDI');
      const iptalEdilen = gunlukSiparisler.filter(s => s.siparisDurumu === 'IPTAL');

      setRapor({
        tarih,
        toplamSiparis,
        toplamCiro,
        tamamlananSayisi: tamamlanan.length,
        iptalSayisi: iptalEdilen.length,
        aktifSiparis: gunlukSiparisler.filter(s => s.siparisDurumu !== 'TAMAMLANDI' && s.siparisDurumu !== 'IPTAL' && s.siparisDurumu !== 'ODENDI').length,
        detaylar: gunlukSiparisler
      });

      toast.success('✅ Gün sonu raporu hazır!');
    } catch (error) {
      console.error('Gün sonu raporu alınırken hata:', error);
      toast.error('❌ Gün sonu raporu alınamadı!');
    } finally {
      setLoading(false);
    }
  };

  // Gün sonu kapat
  const handleGunSonuKapat = async () => {
    if (!seciliKasa) {
      toast.warning('Önce açık kasayı seçin!');
      return;
    }

    if (!window.confirm(
      `Gün sonu işlemini başlatmak istediğinize emin misiniz?\n\n` +
      `Kasa: #${seciliKasa.kasaId}\n` +
      `Açılış Bakiyesi: ₺${seciliKasa.acilisBakiyesi?.toFixed(2) || 0}\n` +
      `Tarih: ${tarih}`
    )) {
      return;
    }

    try {
      setLoading(true);
      
      // Kasayı kapat
      const kapanisBakiyesi = rapor?.toplamCiro || 0;
      await cashService.update(seciliKasa.kasaId, {
        kasaDurumu: 'Kapalı',
        kapanisBakiyesi: kapanisBakiyesi,
        personelId: seciliKasa.personelId
      });
      
      toast.success(`✅ Gün sonu başarıyla tamamlandı! Kasa #${seciliKasa.kasaId} kapatıldı.`);
      setRapor(null);
      setSeciliKasa(null);
      
      // Kasaları yeniden getir
      await handleKasalarıGetir();
    } catch (error) {
      console.error('Gün sonu kapatılırken hata:', error);
      toast.error('❌ Gün sonu kapatılırken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📊 Gün Sonu İşlemleri</h2>
            <p className="text-gray-400 text-xs">Günlük kapatma ve raporlama</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Kasa Durumu */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Kasa Durumu</p>
                {seciliKasa ? (
                  <p className="text-green-400 font-medium">✅ Açık Kasa #{(seciliKasa.kasaId)}</p>
                ) : (
                  <p className="text-red-400 font-medium">❌ Açık Kasa Yok</p>
                )}
              </div>
              <button
                onClick={handleKasalarıGetir}
                disabled={loading}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Kasayı Kontrol Et'}
              </button>
            </div>
            {seciliKasa && (
              <div className="mt-2 text-sm text-gray-400">
                Açılış Bakiyesi: <span className="text-white">₺{seciliKasa.acilisBakiyesi?.toFixed(2) || 0}</span>
              </div>
            )}
          </div>

          {/* Tarih Seçimi ve Rapor */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tarih</label>
                <input
                  type="date"
                  value={tarih}
                  onChange={(e) => setTarih(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleGunSonuRaporu}
                disabled={loading}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-4"
              >
                {loading ? <><FaSpinner className="animate-spin" /> Yükleniyor...</> : <><FaFileAlt /> Rapor Al</>}
              </button>
            </div>
          </div>

          {/* Rapor Özeti */}
          {rapor && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
                <h3 className="text-white font-semibold text-lg mb-2">📈 Gün Özeti - {rapor.tarih}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs">Toplam Sipariş</p>
                    <p className="text-white text-xl font-bold">{rapor.toplamSiparis}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs">Toplam Ciro</p>
                    <p className="text-green-400 text-xl font-bold">₺{rapor.toplamCiro?.toFixed(2) || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs">Tamamlanan</p>
                    <p className="text-green-400 text-xl font-bold">{rapor.tamamlananSayisi}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs">İptal</p>
                    <p className="text-red-400 text-xl font-bold">{rapor.iptalSayisi}</p>
                  </div>
                </div>
              </div>

              {/* Gün Sonu Kapat Butonu */}
              <button
                onClick={handleGunSonuKapat}
                disabled={loading || !seciliKasa}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><FaSpinner className="animate-spin" /> İşleniyor...</> : <><FaCheckDouble /> Gün Sonu Kapat</>}
              </button>
            </div>
          )}

          {!rapor && (
            <div className="text-center py-8 text-gray-400">
              <FaCalculator className="text-5xl mx-auto mb-3 text-gray-600" />
              <p>"Rapor Al" butonuna tıklayarak gün sonu verilerini görüntüleyin</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end">
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GunSonu;