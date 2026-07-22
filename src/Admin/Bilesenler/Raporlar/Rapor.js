import React, { useState } from 'react';
import { FaChartLine, FaPizzaSlice, FaCalendarCheck, FaMoneyBillWave, FaTimes, FaChartBar } from 'react-icons/fa';
import Buton from '../Ortak/Buton';
import BolumBasligi from '../Ortak/BolumBasligi';
import { toast } from 'react-toastify';
import { reportService } from '../../../api/api';

const RaporButonlari = () => {
  const [modalAcik, setModalAcik] = useState(false);
  const [modalBaslik, setModalBaslik] = useState('');
  const [raporData, setRaporData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seciliTarih, setSeciliTarih] = useState(new Date().toISOString().split('T')[0]);
  const [seciliGun, setSeciliGun] = useState(30);
  const [seciliYil, setSeciliYil] = useState(new Date().getFullYear());

  // Gunluk Satis Raporu
  const fetchGunlukSatis = async () => {
    setModalBaslik('Gunluk Satis Raporu');
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getGunlukSatis(seciliTarih);
      console.log('Gunluk satis:', response);
      setRaporData(response.data?.siparisler || []);
      if (response.data?.siparisler?.length === 0) {
        toast.info('Bu tarihte siparis bulunamadi');
      }
    } catch (error) {
      console.error('Gunluk satis raporu hatasi:', error);
      toast.error('Gunluk satis raporu alinamadi!');
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // Urun Satis Raporu
  const fetchUrunSatis = async () => {
    setModalBaslik('Urun Satis Raporu');
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getUrunSatis(seciliGun);
      console.log('Urun satis:', response);
      setRaporData(response.data?.data || []);
      if (response.data?.data?.length === 0) {
        toast.info('Urun satis verisi bulunamadi');
      }
    } catch (error) {
      console.error('Urun satis raporu hatasi:', error);
      toast.error('Urun satis raporu alinamadi!');
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // Rezervasyon Raporu
  const fetchRezervasyonRaporu = async () => {
    setModalBaslik('Rezervasyon Raporu');
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getRezervasyonRaporu();
      console.log('Rezervasyon raporu:', response);
      setRaporData(response.data?.data || []);
      if (response.data?.data?.length === 0) {
        toast.info('Rezervasyon verisi bulunamadi');
      }
    } catch (error) {
      console.error('Rezervasyon raporu hatasi:', error);
      toast.error('Rezervasyon raporu alinamadi!');
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // Gelir Istatistikleri - DÜZELTİLDİ
  const fetchGelirIstatistikleri = async () => {
    setModalBaslik('Gelir Istatistikleri');
    setLoading(true);
    setModalAcik(true);
    try {
      const response = await reportService.getGelirIstatistikleri(seciliYil);
      console.log('Gelir istatistikleri:', response);

      let veri = [];
      if (response.data?.data) {
        veri = response.data.data;
      } else if (response.data?.Data) {
        veri = response.data.Data;
      } else if (Array.isArray(response.data)) {
        veri = response.data;
      }

      console.log('Gelir istatistikleri islenmis veri:', veri);
      setRaporData(veri);

      if (veri.length === 0) {
        toast.info(`${seciliYil} yili icin gelir verisi bulunamadi`);
      } else {
        toast.success(`${veri.length} ay verisi bulundu`);
      }
    } catch (error) {
      console.error('Gelir istatistikleri hatasi:', error);
      toast.error('Gelir istatistikleri alinamadi!');
      setModalAcik(false);
    } finally {
      setLoading(false);
    }
  };

  // Modal Kapat
  const modalKapat = () => {
    setModalAcik(false);
    setRaporData([]);
  };

  // Tarih formatlama
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

  // Filtreler componenti
  const Filtreler = () => (
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
    </div>
  );

  return (
    <>
      {/* Butonlar */}
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
        <BolumBasligi icon={<FaChartBar />} title="Raporlar ve Istatistikler" />
        <p className="text-gray-400 text-sm mb-6">Rapor butonlarina tiklayarak detayli raporlari goruntuleyin.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Buton
            icon={<FaChartLine />}
            label="Gunluk Satis Raporlari"
            onClick={fetchGunlukSatis}
          />
          <Buton
            icon={<FaPizzaSlice />}
            label="Urun Satis Raporu"
            onClick={fetchUrunSatis}
          />
          <Buton
            icon={<FaCalendarCheck />}
            label="Rezervasyon Raporu"
            onClick={fetchRezervasyonRaporu}
          />
          <Buton
            icon={<FaMoneyBillWave />}
            label="Gelir Istatistikleri"
            onClick={fetchGelirIstatistikleri}
          />
        </div>
      </div>

      {/* Rapor Modal */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Baslik */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-white font-bold text-lg">{modalBaslik}</h2>
                <p className="text-gray-400 text-xs">{raporData.length} kayit bulundu</p>
              </div>
              <button onClick={modalKapat} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Filtreler */}
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <Filtreler />
            </div>

            {/* Rapor Icerigi */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                    <p className="text-gray-400">Rapor yukleniyor...</p>
                  </div>
                </div>
              ) : raporData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p className="text-lg">Veri bulunamadi</p>
                  <p className="text-sm text-gray-500">Filtreleri degistirerek tekrar deneyin</p>
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
                              {typeof value === 'boolean' ? (value ? 'Evet' : 'Hayir') :
                                value instanceof Date ? formatDate(value) :
                                  typeof value === 'object' ? JSON.stringify(value) :
                                    value || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
              <span className="text-gray-400 text-xs">Toplam {raporData.length} kayit</span>
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

export default RaporButonlari;