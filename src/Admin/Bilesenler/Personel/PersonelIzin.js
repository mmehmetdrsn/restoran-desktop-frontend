// src/Admin/Bilesenler/Personel/PersonelIzin.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaSpinner, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { personelIzinService } from '../../../api/api';

const PersonelIzin = ({ acik, kapat }) => {
  const [loading, setLoading] = useState(false);
  const [izinler, setIzinler] = useState([]);
  const [filtre, setFiltre] = useState('TUMU');

  useEffect(() => {
    if (acik) {
      fetchIzinler();
    }
  }, [acik]);

  if (!acik) return null;

  const fetchIzinler = async () => {
    try {
      setLoading(true);
      const response = await personelIzinService.getAll();
      console.log('📋 Gelen izin verileri:', response.data);
      setIzinler(response.data || []);
    } catch (error) {
      console.error('İzinler yüklenirken hata:', error);
      toast.error('❌ İzinler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const getIzinTipiBadge = (tip) => {
    const tipMap = {
      'YILLIK': 'bg-blue-500/20 text-blue-400',
      'HASTALIK': 'bg-red-500/20 text-red-400',
      'MAZERET': 'bg-yellow-500/20 text-yellow-400',
      'UCRETLI': 'bg-green-500/20 text-green-400',
      'UCRETSIZ': 'bg-gray-500/20 text-gray-400'
    };
    return tipMap[tip] || 'bg-gray-500/20 text-gray-400';
  };

  const getIzinTipiText = (tip) => {
    const tipMap = {
      'YILLIK': 'Yıllık İzin',
      'HASTALIK': 'Hastalık',
      'MAZERET': 'Mazeret',
      'UCRETLI': 'Ücretli',
      'UCRETSIZ': 'Ücretsiz'
    };
    return tipMap[tip] || tip;
  };

  const getPersonelAdi = (izin) => {
    if (izin.personelAdSoyad) {
      return izin.personelAdSoyad;
    }
    if (izin.PersonelAdSoyad) {
      return izin.PersonelAdSoyad;
    }
    
    const ad = izin.personelAdi || izin.PersonelAdi || izin.personel?.personelAdi || izin.personel?.PersonelAdi;
    const soyad = izin.personelSoyadi || izin.PersonelSoyadi || izin.personel?.personelSoyadi || izin.personel?.PersonelSoyadi;
    
    if (ad && soyad) {
      return `${ad} ${soyad}`;
    } else if (ad) {
      return ad;
    } 
    
    if (izin.personelId || izin.PersonelId) {
      return `Personel #${izin.personelId || izin.PersonelId}`;
    }
    
    return 'Bilinmiyor';
  };

 const filteredIzinler = izinler.filter(i => {
    if (filtre === 'TUMU') return true;
    
    const aciklama = (i.izinAciklamasi || i.IzinAciklamasi || '').toUpperCase();
    if (filtre === 'YILLIK') return aciklama.includes('YILLIK');
    if (filtre === 'HASTALIK') return aciklama.includes('SAĞLIK') || aciklama.includes('RAPOR');
    if (filtre === 'MAZERET') return aciklama.includes('MAZERET');
    
    return false;
});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-blue-400"><FaCalendarAlt /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Personel İzin Listesi</h2>
              <p className="text-gray-400 text-xs">Tüm personel izin kayıtlarını görüntüleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Filtre ve Yenile */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
            >
              <option value="TUMU">Tümü</option>
              <option value="YILLIK">Yıllık İzin</option>
              <option value="HASTALIK">Hastalık</option>
              <option value="MAZERET">Mazeret</option>
              <option value="UCRETLI">Ücretli</option>
              <option value="UCRETSIZ">Ücretsiz</option>
            </select>
          </div>
          <button
            onClick={fetchIzinler}
            disabled={loading}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            Yenile
          </button>
        </div>

        {/* İzin Listesi */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-blue-400 text-3xl" />
            </div>
          ) : filteredIzinler.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg">İzin kaydı bulunamadı</p>
              <p className="text-sm text-gray-500">Henüz hiç izin talebi oluşturulmamış</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIzinler.map((izin, index) => {
                const normalizedIzin = {
                  izinId: izin.izinId || izin.IzinId || izin.izinID || izin.IzinID || index + 1,
                  personelAdSoyad: izin.personelAdSoyad || izin.PersonelAdSoyad || null,
                  izinBaslangic: izin.izinBaslangic || izin.IzinBaslangic,
                  izinBitis: izin.izinBitis || izin.IzinBitis,
                  izinGunSayisi: izin.izinGunSayisi || izin.IzinGunSayisi || 0,
                  izinTipi: izin.izinTipi || izin.IzinTipi
                };
                
                return (
                  <div key={normalizedIzin.izinId} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-white font-medium">#{normalizedIzin.izinId}</span>
                          <span className="flex items-center gap-1 text-gray-300">
                            <FaUser size={12} /> 
                            {getPersonelAdi(normalizedIzin)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIzinTipiBadge(normalizedIzin.izinTipi)}`}>
                            {getIzinTipiText(normalizedIzin.izinTipi)}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Başlangıç:</span>
                            <span className="text-white ml-2">
                              {normalizedIzin.izinBaslangic 
                                ? new Date(normalizedIzin.izinBaslangic).toLocaleDateString('tr-TR') 
                                : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Bitiş:</span>
                            <span className="text-white ml-2">
                              {normalizedIzin.izinBitis 
                                ? new Date(normalizedIzin.izinBitis).toLocaleDateString('tr-TR') 
                                : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Gün:</span>
                            <span className="text-white ml-2">
                              {normalizedIzin.izinGunSayisi || 0} gün
                            </span>
                          </div>
                          {normalizedIzin.aciklama && (
                            <div className="col-span-2">
                              <span className="text-gray-400">Açıklama:</span>
                              <span className="text-gray-300 ml-2">{normalizedIzin.aciklama}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
          <span className="text-gray-400 text-xs">
            Toplam {filteredIzinler.length} izin kaydı
            {filtre !== 'TUMU' && ` (Filtre: ${filtre})`}
          </span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonelIzin;