// src/Admin/Bilesenler/Stok/MalzemeTalepleri.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { malzemeTalepAPI } from '../../../api/api';

const MalzemeTalepleri = ({ acik, kapat, onSuccess }) => {
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [islemYapilanId, setIslemYapilanId] = useState(null);

  useEffect(() => {
    if (acik) {
      fetchTalepler();
    }
  }, [acik]);

  if (!acik) return null;

  const fetchTalepler = async () => {
    try {
      setLoading(true);
      const response = await malzemeTalepAPI.getAdminTalepler();
      setTalepler(response.data || []);
    } catch (error) {
      console.error('Talepler yüklenirken hata:', error);
      toast.error('Talepler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleOnayla = async (talepId) => {
    if (!window.confirm('Bu talebi onaylamak istediğinize emin misiniz?')) return;
    
    setIslemYapilanId(talepId);
    try {
      await malzemeTalepAPI.adminOnayla(talepId);
      toast.success('✅ Talep onaylandı! Stok güncellendi.');
      await fetchTalepler();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Onay hatası:', error);
      toast.error('❌ Talep onaylanamadı!');
    } finally {
      setIslemYapilanId(null);
    }
  };

  const handleReddet = async (talepId) => {
    if (!window.confirm('Bu talebi reddetmek istediğinize emin misiniz?')) return;
    
    setIslemYapilanId(talepId);
    try {
      await malzemeTalepAPI.adminReddet(talepId);
      toast.success('✅ Talep reddedildi!');
      await fetchTalepler();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Reddetme hatası:', error);
      toast.error('❌ Talep reddedilemedi!');
    } finally {
      setIslemYapilanId(null);
    }
  };

  const getDurumBadge = (durum) => {
    switch (durum) {
      case 'BEKLIYOR':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' };
      case 'ONAYLANDI':
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Onaylandı' };
      case 'REDDEDILDI':
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Reddedildi' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: durum || 'Bilinmiyor' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">📦 Eksik Malzeme Talepleri</h2>
            <p className="text-gray-400 text-xs">
              {loading ? 'Yükleniyor...' : `${talepler.length} talep bulundu`}
            </p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <FaSpinner className="animate-spin text-blue-400 text-3xl" />
                <p className="text-gray-400">Talepler yükleniyor...</p>
              </div>
            </div>
          ) : talepler.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg">Henüz talep yok</p>
              <p className="text-sm text-gray-500">Aşçılardan gelen talepler burada görünecek</p>
            </div>
          ) : (
            <div className="space-y-3">
              {talepler.map((talep) => {
                const durum = getDurumBadge(talep.durum);
                const islemYapiliyor = islemYapilanId === talep.talepId;
                
                return (
                  <div key={talep.talepId} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-white font-bold">#{talep.talepId}</span>
                          <span className="text-gray-300">{talep.personelAdi || 'Aşçı'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${durum.bg} ${durum.text}`}>
                            {durum.label}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Malzeme:</span>
                            <span className="text-white ml-2">{talep.malzemeAdi}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Miktar:</span>
                            <span className="text-white ml-2">{talep.miktar} {talep.birim}</span>
                          </div>
                          {talep.aciklama && (
                            <div className="col-span-2">
                              <span className="text-gray-400">Açıklama:</span>
                              <span className="text-gray-300 ml-2">{talep.aciklama}</span>
                            </div>
                          )}
                          <div className="col-span-2">
                            <span className="text-gray-400">Tarih:</span>
                            <span className="text-gray-300 ml-2">
                              {new Date(talep.talepTarihi).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {talep.durum === 'BEKLIYOR' && (
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleOnayla(talep.talepId)}
                            disabled={islemYapiliyor}
                            className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 text-green-400 rounded-lg text-sm transition-all flex items-center gap-1"
                          >
                            {islemYapiliyor ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : (
                              <FaCheck size={12} />
                            )}
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReddet(talep.talepId)}
                            disabled={islemYapiliyor}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded-lg text-sm transition-all flex items-center gap-1"
                          >
                            {islemYapiliyor ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : (
                              <FaTimes size={12} />
                            )}
                            Reddet
                          </button>
                        </div>
                      )}
                      
                      {talep.durum === 'ONAYLANDI' && (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <FaCheck size={12} /> Onaylandı
                        </span>
                      )}
                      {talep.durum === 'REDDEDILDI' && (
                        <span className="text-red-400 text-sm flex items-center gap-1">
                          <FaTimes size={12} /> Reddedildi
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
          <span className="text-gray-400 text-xs">Toplam {talepler.length} talep</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MalzemeTalepleri;