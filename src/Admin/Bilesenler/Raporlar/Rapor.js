import React, { useState, useEffect } from 'react';
import { FaChartLine, FaPizzaSlice, FaCalendarCheck, FaMoneyBillWave, FaTimes, FaChartBar } from 'react-icons/fa';
import Buton from '../Ortak/Buton';
import BolumBasligi from '../Ortak/BolumBasligi';
import { toast } from 'react-toastify';
import { reportService } from '../../../api/api';

const Rapor = () => {
  const [modalAcik, setModalAcik] = useState(false);
  const [modalBaslik, setModalBaslik] = useState('');
  const [raporData, setRaporData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seciliGun, setSeciliGun] = useState(30);
  const [seciliYil, setSeciliYil] = useState(new Date().getFullYear());

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [seciliTarih, setSeciliTarih] = useState(getToday());
  const [aktifRapor, setAktifRapor] = useState(null);

  // ========== TARİH FORMATLAMA ==========
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // ========== GÜNLÜK SATIŞ RAPORU ==========
  const fetchGunlukSatis = async () => {
    setAktifRapor('gunluk');
    const tarih = seciliTarih;
    setModalBaslik(`Günlük Satış Raporu (${tarih})`);
    setLoading(true);
    setModalAcik(true);
    
    try {
      const response = await reportService.getGunlukSatis(tarih);
      const veri = response?.data?.siparisler || 
                   response?.data?.data || 
                   response?.data || 
                   [];
      setRaporData(veri);
      
      if (veri.length === 0) {
        toast.info(`${tarih} tarihinde sipariş bulunamadı`);
      } else {
        toast.success(`${veri.length} sipariş bulundu`);
      }
    } catch (error) {
      console.error('Günlük satış raporu hatası:', error);
      toast.error('Günlük satış raporu alınamadı!');
      setRaporData([]);
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // ========== ÜRÜN SATIŞ RAPORU ==========
  const fetchUrunSatis = async () => {
    setAktifRapor('urun');
    setModalBaslik(`Ürün Satış Raporu (Son ${seciliGun} Gün)`);
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getUrunSatis(seciliGun);
      const veri = Array.isArray(response.data?.data) ? response.data.data :
                   Array.isArray(response.data) ? response.data : [];
      setRaporData(veri);
      if (veri.length === 0) {
        toast.info('Ürün satış verisi bulunamadı');
      } else {
        toast.success(`${veri.length} ürün bulundu`);
      }
    } catch (error) {
      console.error('Ürün satış raporu hatası:', error);
      toast.error('Ürün satış raporu alınamadı!');
      setRaporData([]);
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // ========== REZERVASYON RAPORU ==========
  const fetchRezervasyonRaporu = async () => {
    setAktifRapor('rezervasyon');
    setModalBaslik('Rezervasyon Raporu');
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getRezervasyonRaporu();
      const veri = Array.isArray(response.data?.data) ? response.data.data :
                   Array.isArray(response.data) ? response.data : [];
      setRaporData(veri);
      if (veri.length === 0) {
        toast.info('Rezervasyon verisi bulunamadı');
      } else {
        toast.success(`${veri.length} rezervasyon bulundu`);
      }
    } catch (error) {
      console.error('Rezervasyon raporu hatası:', error);
      toast.error('Rezervasyon raporu alınamadı!');
      setRaporData([]);
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // ========== GELİR İSTATİSTİKLERİ ==========
  const fetchGelirIstatistikleri = async () => {
    setAktifRapor('gelir');
    setModalBaslik(`Gelir İstatistikleri (${seciliYil})`);
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getGelirIstatistikleri(seciliYil);
      let veri = [];
      if (Array.isArray(response.data?.data)) {
        veri = response.data.data;
      } else if (Array.isArray(response.data?.Data)) {
        veri = response.data.Data;
      } else if (Array.isArray(response.data)) {
        veri = response.data;
      }
      setRaporData(veri);
      if (veri.length === 0) {
        toast.info(`${seciliYil} yılı için gelir verisi bulunamadı`);
      } else {
        toast.success(`${veri.length} ay verisi bulundu`);
      }
    } catch (error) {
      console.error('Gelir istatistikleri hatası:', error);
      toast.error('Gelir istatistikleri alınamadı!');
      setRaporData([]);
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // ========== OTOMATİK YENİLEME ==========
  
  // Günlük Satış - Tarih değişince
  useEffect(() => {
    if (modalAcik && aktifRapor === 'gunluk') {
      fetchGunlukSatis();
    }
  }, [seciliTarih]);

  // Ürün Satış - Gün sayısı değişince
  useEffect(() => {
    if (modalAcik && aktifRapor === 'urun') {
      fetchUrunSatis();
    }
  }, [seciliGun]);

  // Gelir İstatistikleri - Yıl değişince
  useEffect(() => {
    if (modalAcik && aktifRapor === 'gelir') {
      fetchGelirIstatistikleri();
    }
  }, [seciliYil]);

  // ========== MODAL KAPAT ==========
  const modalKapat = () => {
    setModalAcik(false);
    setRaporData([]);
    setAktifRapor(null);
  };

  // ========== FİLTRELER ==========
  const Filtreler = () => {
    // 🔥 Sadece Günlük Satış Raporu açıkken Tarih filtresini göster
    const showTarih = aktifRapor === 'gunluk';
    const showGun = aktifRapor === 'urun';
    const showYil = aktifRapor === 'gelir';

    return (
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-wrap gap-4 items-center">
        {/* 🔥 SADECE GÜNLÜK SATIŞ RAPORU'NDA TARİH FİLTRESİ */}
        {showTarih && (
          <div>
            <label className="text-gray-400 text-xs block mb-1">Tarih</label>
            <input
              type="date"
              value={seciliTarih}
              onChange={(e) => setSeciliTarih(e.target.value)}
              className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
            />
          </div>
        )}

        {/* 🔥 SADECE ÜRÜN SATIŞ RAPORU'NDA GÜN FİLTRESİ */}
        {showGun && (
          <div>
            <label className="text-gray-400 text-xs block mb-1">Gün Sayısı</label>
            <select
              value={seciliGun}
              onChange={(e) => setSeciliGun(parseInt(e.target.value))}
              className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
            >
              <option value="7">7 Gün</option>
              <option value="15">15 Gün</option>
              <option value="30">30 Gün</option>
              <option value="60">60 Gün</option>
              <option value="90">90 Gün</option>
            </select>
          </div>
        )}

        {/* 🔥 SADECE GELİR İSTATİSTİKLERİ'NDE YIL FİLTRESİ */}
        {showYil && (
          <div>
            <label className="text-gray-400 text-xs block mb-1">Yıl</label>
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
        )}

        {/* 🔥 REZERVASYON'DA FİLTRE YOK */}
        {aktifRapor === 'rezervasyon' && (
          <div className="text-gray-400 text-sm">
            <FaCalendarCheck className="inline mr-2" />
            Tüm rezervasyonlar
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
        <BolumBasligi icon={<FaChartBar />} title="Raporlar ve İstatistikler" />
        <p className="text-gray-400 text-sm mb-6">Rapor butonlarına tıklayarak detaylı raporları görüntüleyin.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Buton icon={<FaChartLine />} label="Günlük Satış Raporları" onClick={fetchGunlukSatis} />
          <Buton icon={<FaPizzaSlice />} label="Ürün Satış Raporu" onClick={fetchUrunSatis} />
          <Buton icon={<FaCalendarCheck />} label="Rezervasyon Raporu" onClick={fetchRezervasyonRaporu} />
          <Buton icon={<FaMoneyBillWave />} label="Gelir İstatistikleri" onClick={fetchGelirIstatistikleri} />
        </div>
      </div>

      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-white font-bold text-lg">{modalBaslik}</h2>
                <p className="text-gray-400 text-xs">{Array.isArray(raporData) ? raporData.length : 0} kayıt bulundu</p>
              </div>
              <button onClick={modalKapat} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <Filtreler />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                    <p className="text-gray-400">Rapor yükleniyor...</p>
                  </div>
                </div>
              ) : !Array.isArray(raporData) || raporData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p className="text-lg">Veri bulunamadı</p>
                  <p className="text-sm text-gray-500">Filtreleri değiştirerek tekrar deneyin</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-left">
                        {Object.keys(raporData[0] || {}).map((key) => (
                          <th key={key} className="pb-3 font-medium px-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {raporData.map((item, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          {Object.values(item).map((value, idx) => (
                            <td key={idx} className="py-3 px-2 text-gray-300">
                              {value === null || value === undefined || value === '' ? '--' :
                                typeof value === 'boolean' ? (value ? 'Evet' : 'Hayır') :
                                  value instanceof Date ? formatDate(value) :
                                    typeof value === 'object' ? JSON.stringify(value) :
                                      value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
              <span className="text-gray-400 text-xs">Toplam {Array.isArray(raporData) ? raporData.length : 0} kayıt</span>
              <button onClick={modalKapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rapor;