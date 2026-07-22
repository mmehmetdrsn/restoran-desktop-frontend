import React, { useState, useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reportService } from '../../../api/api';

const Raporlar = () => {
  const [raporLoading, setRaporLoading] = useState(false);
  const [gunlukSatis, setGunlukSatis] = useState([]);
  const [urunSatis, setUrunSatis] = useState([]);
  const [rezervasyonRaporu, setRezervasyonRaporu] = useState([]);
  const [kategoriSatis, setKategoriSatis] = useState([]);
  const [dashboardOzet, setDashboardOzet] = useState(null);
  const [seciliTarih, setSeciliTarih] = useState(new Date().toISOString().split('T')[0]);
  const [seciliGun, setSeciliGun] = useState(30);
  const [seciliYil, setSeciliYil] = useState(new Date().getFullYear());

  // Gunluk satis raporu
  const fetchGunlukSatis = async () => {
    setRaporLoading(true);
    try {
      const response = await reportService.getGunlukSatis(seciliTarih);
      console.log('Gunluk satis:', response);
      setGunlukSatis(response.data?.siparisler || []);
      toast.success(`${response.data?.siparisler?.length || 0} siparis bulundu`);
    } catch (error) {
      console.error('Gunluk satis raporu hatasi:', error);
      toast.error('Gunluk satis raporu alinamadi!');
    } finally {
      setRaporLoading(false);
    }
  };

  // Urun satis raporu
  const fetchUrunSatis = async () => {
    setRaporLoading(true);
    try {
      const response = await reportService.getUrunSatis(seciliGun);
      console.log('Urun satis:', response);
      setUrunSatis(response.data?.data || []);
      toast.success(`${response.data?.data?.length || 0} urun bulundu`);
    } catch (error) {
      console.error('Urun satis raporu hatasi:', error);
      toast.error('Urun satis raporu alinamadi!');
    } finally {
      setRaporLoading(false);
    }
  };

  // Rezervasyon raporu
  const fetchRezervasyonRaporu = async () => {
    setRaporLoading(true);
    try {
      const response = await reportService.getRezervasyonRaporu();
      console.log('Rezervasyon raporu:', response);
      setRezervasyonRaporu(response.data?.data || []);
      toast.success(`${response.data?.data?.length || 0} gun verisi bulundu`);
    } catch (error) {
      console.error('Rezervasyon raporu hatasi:', error);
      toast.error('Rezervasyon raporu alinamadi!');
    } finally {
      setRaporLoading(false);
    }
  };

  // Gelir istatistikleri
  const fetchGelirIstatistikleri = async () => {
    setRaporLoading(true);
    try {
      const response = await reportService.getGelirIstatistikleri(seciliYil);
      console.log('Gelir istatistikleri:', response);
      toast.success(`${response.data?.Data?.length || 0} ay verisi bulundu`);
    } catch (error) {
      console.error('Gelir istatistikleri hatasi:', error);
      toast.error('Gelir istatistikleri alinamadi!');
    } finally {
      setRaporLoading(false);
    }
  };

  // Kategori satis
  const fetchKategoriSatis = async () => {
    setRaporLoading(true);
    try {
      const response = await reportService.getKategoriSatis(seciliGun);
      console.log('Kategori satis:', response);
      setKategoriSatis(response.data || []);
      toast.success(`${response.data?.length || 0} kategori bulundu`);
    } catch (error) {
      console.error('Kategori satis hatasi:', error);
      toast.error('Kategori satis raporu alinamadi!');
    } finally {
      setRaporLoading(false);
    }
  };

  // Dashboard ozet
  const fetchDashboardOzet = async () => {
    try {
      const response = await reportService.getDashboardOzet();
      console.log('Dashboard ozet:', response);
      setDashboardOzet(response.data);
    } catch (error) {
      console.error('Dashboard ozet hatasi:', error);
    }
  };

  // Tum raporlari getir
  const fetchAllReports = () => {
    fetchDashboardOzet();
    fetchGunlukSatis();
    fetchUrunSatis();
    fetchRezervasyonRaporu();
    fetchGelirIstatistikleri();
    fetchKategoriSatis();
  };

  // Ilk yuklemede raporlari getir
  useEffect(() => {
    fetchAllReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Tarih</label>
          <input
            type="date"
            value={seciliTarih}
            onChange={(e) => setSeciliTarih(e.target.value)}
            className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Gun Sayisi</label>
          <select
            value={seciliGun}
            onChange={(e) => setSeciliGun(parseInt(e.target.value))}
            className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
          >
            <option value="7">7 Gun</option>
            <option value="15">15 Gun</option>
            <option value="30">30 Gun</option>
            <option value="60">60 Gun</option>
            <option value="90">90 Gun</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Yil</label>
          <select
            value={seciliYil}
            onChange={(e) => setSeciliYil(parseInt(e.target.value))}
            className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
          >
            {[2023, 2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchAllReports}
          disabled={raporLoading}
          className="py-1.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all disabled:opacity-50"
        >
          {raporLoading ? 'Yukleniyor...' : 'Tumunu Yenile'}
        </button>
      </div>

      {/* Dashboard Ozet Kartlari */}
      {dashboardOzet && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-xs">Bugun Ciro</p>
            <p className="text-green-400 font-bold text-xl">₺{dashboardOzet.bugunCiro?.toFixed(2) || 0}</p>
            <p className={`text-xs ${dashboardOzet.degisimYuzdesi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dashboardOzet.degisimYuzdesi >= 0 ? '↑' : '↓'} {Math.abs(dashboardOzet.degisimYuzdesi)}%
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-xs">Aktif Siparis</p>
            <p className="text-yellow-400 font-bold text-xl">{dashboardOzet.aktifSiparis}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-xs">Bugun Siparis</p>
            <p className="text-blue-400 font-bold text-xl">{dashboardOzet.bugunSiparis}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-xs">Ay Ciro</p>
            <p className="text-purple-400 font-bold text-xl">₺{dashboardOzet.ayCiro?.toFixed(2) || 0}</p>
          </div>
        </div>
      )}

      {/* Rapor Verileri */}
      {raporLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
          <p className="text-gray-400 mt-3">Raporlar yukleniyor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gunluk Satis */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaChartLine className="text-green-400" /> Gunluk Satislar
            </h4>
            {gunlukSatis.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {gunlukSatis.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="text-gray-300 text-sm">#{item.siparisId}</span>
                    <span className="text-white font-medium">₺{item.toplamTutar?.toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.siparisDurumu === 'TAMAMLANDI' ? 'bg-green-500/20 text-green-400' :
                      item.siparisDurumu === 'BEKLEMEDE' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.siparisDurumu}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Bu tarihte siparis yok</p>
            )}
          </div>

          {/* Urun Satis */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaPizzaSlice className="text-orange-400" /> En Cok Satan Urunler
            </h4>
            {urunSatis.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {urunSatis.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="text-gray-300 text-sm">{index+1}. {item.urunAdi}</span>
                    <span className="text-white">{item.toplamAdet} adet</span>
                    <span className="text-yellow-400 text-sm">₺{item.toplamCiro?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Urun satis verisi yok</p>
            )}
          </div>

          {/* Rezervasyon Raporu */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaCalendarCheck className="text-blue-400" /> Rezervasyonlar
            </h4>
            {rezervasyonRaporu.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {rezervasyonRaporu.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="text-gray-300 text-sm">{item.tarih}</span>
                    <span className="text-white">Toplam: {item.toplamRezervasyon}</span>
                    <span className="text-green-400 text-xs">{item.onaylanan}</span>
                    <span className="text-red-400 text-xs">{item.iptalEdilen}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Rezervasyon verisi yok</p>
            )}
          </div>

          {/* Kategori Satis */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaUtensils className="text-purple-400" /> Kategori Bazli Satis
            </h4>
            {kategoriSatis.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {kategoriSatis.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="text-gray-300 text-sm">{item.kategoriAdi}</span>
                    <span className="text-white">{item.toplamAdet} adet</span>
                    <span className="text-yellow-400 text-sm">₺{item.toplamCiro?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Kategori verisi yok</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Raporlar;