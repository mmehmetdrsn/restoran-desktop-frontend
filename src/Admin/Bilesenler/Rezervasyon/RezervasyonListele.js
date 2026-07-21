// src/Admin/Bilesenler/Rezervasyon/RezervasyonListele.js
import React, { useState, useEffect } from 'react';
import { FaList, FaSearch, FaTimes, FaEdit, FaTrash, FaCheck, FaTimesCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { reservationService } from '../../../api/api';

const RezervasyonListele = ({ acik, kapat }) => {
  const [rezervasyonlar, setRezervasyonlar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredRezervasyonlar, setFilteredRezervasyonlar] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDurum, setFilterDurum] = useState('TUMU');
  const [filterTarih, setFilterTarih] = useState('');

  // ✅ useEffect'ler her zaman çağrılır
  useEffect(() => {
    if (acik) {
      fetchRezervasyonlar();
    }
  }, [acik]);

  useEffect(() => {
    if (acik) {
      filtrele();
    }
  }, [rezervasyonlar, searchTerm, filterDurum, filterTarih, acik]);

  const fetchRezervasyonlar = async () => {
    setLoading(true);
    try {
      const response = await reservationService.getAll();
      console.log('📥 Rezervasyon listesi:', response);
      
      let data = response;
      if (response && typeof response === 'object' && response.data) {
        data = response.data;
      }
      if (Array.isArray(data)) {
        setRezervasyonlar(data);
        setFilteredRezervasyonlar(data);
      } else {
        setRezervasyonlar([]);
        setFilteredRezervasyonlar([]);
      }
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      toast.error('❌ Rezervasyonlar yüklenirken hata oluştu!');
      setRezervasyonlar([]);
      setFilteredRezervasyonlar([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrele = () => {
    let filtered = [...rezervasyonlar];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(r =>
        r.musteriAdi?.toLowerCase().includes(term) ||
        r.musteriSoyadi?.toLowerCase().includes(term) ||
        r.telefon?.includes(term) ||
        r.masaNo?.toLowerCase().includes(term) ||
        r.rezervasyonId?.toString().includes(term)
      );
    }

    if (filterDurum !== 'TUMU') {
      filtered = filtered.filter(r => r.durum === filterDurum);
    }

    if (filterTarih) {
      filtered = filtered.filter(r => {
        if (!r.tarihSaat) return false;
        const tarih = r.tarihSaat.split('T')[0];
        return tarih === filterTarih;
      });
    }

    setFilteredRezervasyonlar(filtered);
  };

  const getDurumBadge = (durum) => {
    const durumMap = {
      'BEKLEMEDE': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <FaClock size={12} /> },
      'ONAYLANDI': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <FaCheck size={12} /> },
      'IPTAL': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <FaTimesCircle size={12} /> },
      'REDDEDILDI': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <FaTimesCircle size={12} /> },
      'TAMAMLANDI': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <FaCheck size={12} /> }
    };

    const config = durumMap[durum] || durumMap['BEKLEMEDE'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center gap-1 w-fit`}>
        {config.icon}
        {durum}
      </span>
    );
  };

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

  // ✅ Modal kapalıysa hiçbir şey render etme
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-blue-400"><FaList /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Rezervasyon Listesi</h2>
              <p className="text-gray-400 text-xs">
                Toplam {filteredRezervasyonlar.length} rezervasyon bulunuyor
                {rezervasyonlar.length !== filteredRezervasyonlar.length && ` (${rezervasyonlar.length} toplam)`}
              </p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Filtreler */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Müşteri, masa, ID ara..."
              className="w-full py-2 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none text-sm"
            />
          </div>

          <select
            value={filterDurum}
            onChange={(e) => setFilterDurum(e.target.value)}
            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none text-sm"
          >
            <option value="TUMU">Tüm Durumlar</option>
            <option value="BEKLEMEDE">Beklemede</option>
            <option value="ONAYLANDI">Onaylandı</option>
            <option value="IPTAL">İptal</option>
            <option value="REDDEDILDI">Reddedildi</option>
            <option value="TAMAMLANDI">Tamamlandı</option>
          </select>

          <input
            type="date"
            value={filterTarih}
            onChange={(e) => setFilterTarih(e.target.value)}
            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none text-sm"
          />

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterDurum('TUMU');
              setFilterTarih('');
            }}
            className="py-2 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all text-sm"
          >
            Temizle
          </button>

          <button
            onClick={fetchRezervasyonlar}
            disabled={loading}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Yükleniyor...</>
            ) : (
              'Yenile'
            )}
          </button>
        </div>

        {/* Tablo */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <span className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></span>
                <p className="text-gray-400 text-sm">Rezervasyonlar yükleniyor...</p>
              </div>
            </div>
          ) : filteredRezervasyonlar.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaList size={48} className="mb-3 opacity-30" />
              <p className="text-lg font-medium">Rezervasyon bulunamadı</p>
              <p className="text-sm">Filtreleri değiştirerek tekrar deneyin</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-left">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Müşteri</th>
                    <th className="pb-3 font-medium">Telefon</th>
                    <th className="pb-3 font-medium">Masa</th>
                    <th className="pb-3 font-medium">Kişi</th>
                    <th className="pb-3 font-medium">Tarih/Saat</th>
                    <th className="pb-3 font-medium">Durum</th>
                    <th className="pb-3 font-medium text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRezervasyonlar.map((rezervasyon) => (
                    <tr key={rezervasyon.rezervasyonId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white font-mono text-xs">
                        #{rezervasyon.rezervasyonId}
                      </td>
                      <td className="py-3">
                        <div className="text-white font-medium">
                          {rezervasyon.musteriAdi || '-'} {rezervasyon.musteriSoyadi || ''}
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">
                        {rezervasyon.telefon || '-'}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-white/5 rounded text-white text-xs">
                          {rezervasyon.masaNo || `Masa #${rezervasyon.masaId}`}
                        </span>
                      </td>
                      <td className="py-3 text-white text-center">
                        {rezervasyon.kisiSayisi || 1}
                      </td>
                      <td className="py-3 text-gray-300 text-xs">
                        {formatDate(rezervasyon.tarihSaat)}
                      </td>
                      <td className="py-3">
                        {getDurumBadge(rezervasyon.durum)}
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (window.openRezervasyonDuzenle) {
                                window.openRezervasyonDuzenle(rezervasyon.rezervasyonId);
                              }
                            }}
                            className="p-1.5 text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                            title="Düzenle"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`#${rezervasyon.rezervasyonId} rezervasyonunu silmek istediğinizden emin misiniz?`)) {
                                reservationService.delete(rezervasyon.rezervasyonId)
                                  .then(() => {
                                    toast.success(`✅ Rezervasyon #${rezervasyon.rezervasyonId} silindi!`);
                                    fetchRezervasyonlar();
                                  })
                                  .catch((error) => {
                                    console.error('Silme hatası:', error);
                                    const msg = error.response?.data?.mesaj || error.response?.data?.message || 'Silme hatası!';
                                    toast.error(`❌ ${msg}`);
                                  });
                              }
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Sil"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 flex justify-between items-center text-gray-400 text-xs">
          <span>Toplam {filteredRezervasyonlar.length} rezervasyon</span>
          <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
};

export default RezervasyonListele;