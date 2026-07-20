// src/Admin/components/Uye/UyeDetay.js
import React, { useState } from 'react';
import { 
  FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaUserCheck, FaIdCard, FaVenusMars, FaMapMarkerAlt, 
  FaHome, FaBuilding, FaCity, FaAddressCard, FaTruck 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../../../api/api';

const UyeDetay = ({ acik, kapat }) => {
  const [uyeId, setUyeId] = useState('');
  const [uye, setUye] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!acik) return null;

  const handleAra = async (e) => {
    e.preventDefault();
    if (!uyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }

    setLoading(true);
    setUye(null);

    try {
      const response = await userService.getById(parseInt(uyeId));
      const data = response.data;
      
      console.log('📋 Gelen üye detayı:', data);
      
      if (data && data.uyeId) {
        setUye(data);
        toast.success('✅ Üye bulundu!');
      } else {
        toast.error('❌ Üye bulunamadı!');
      }
    } catch (error) {
      console.error('Üye detay alınırken hata:', error);
      toast.error('❌ Üye bulunamadı!');
    } finally {
      setLoading(false);
    }
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

  // ✅ Durum kontrol fonksiyonu
  const isActive = (uye) => {
    if (!uye) return true;
    const active = uye.isActive ?? uye.IsActive ?? uye.is_active ?? uye.IS_ACTIVE;
    if (active === undefined || active === null) return true;
    return active === true || active === 1 || active === 'true' || active === '1';
  };

  // ✅ Adres tipine göre icon
  const getAdresIcon = (tip) => {
    if (!tip) return <FaMapMarkerAlt />;
    const t = tip.toLowerCase();
    if (t.includes('ev')) return <FaHome className="text-blue-400" />;
    if (t.includes('iş') || t.includes('is')) return <FaBuilding className="text-orange-400" />;
    if (t.includes('yazlık') || t.includes('yazlik')) return <FaCity className="text-green-400" />;
    return <FaMapMarkerAlt className="text-yellow-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">👤 Üye Detay</h2>
            <p className="text-gray-400 text-xs">Üye bilgilerini görüntüleyin</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleAra} className="mb-6">
            <div className="flex gap-3">
              <input
                type="number"
                value={uyeId}
                onChange={(e) => setUyeId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Üye ID girin (Örn: 1)"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Aranıyor...</>
                ) : (
                  'Ara'
                )}
              </button>
            </div>
          </form>

          {uye ? (
            <div className="space-y-4">
              {/* Profil Başlığı */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-2xl">
                  <FaUser />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {uye.uyeAdi} {uye.uyeSoyadi}
                  </h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <FaIdCard size={14} /> ID: #{uye.uyeId}
                  </p>
                </div>
              </div>

              {/* Bilgi Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Email */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaEnvelope size={12} /> Email
                  </p>
                  <p className="text-white font-medium mt-1 break-all">{uye.uyeEmail || '-'}</p>
                </div>

                {/* Telefon */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaPhone size={12} /> Telefon
                  </p>
                  <p className="text-white font-medium mt-1">{uye.uyeTelefon || '-'}</p>
                </div>

                {/* Cinsiyet */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaVenusMars size={12} /> Cinsiyet
                  </p>
                  <p className="text-white font-medium mt-1">
                    {uye.cinsiyet || uye.Cinsiyet || '-'}
                  </p>
                </div>

                {/* Kayıt Tarihi */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaCalendarAlt size={12} /> Kayıt Tarihi
                  </p>
                  <p className="text-white font-medium mt-1">
                    {formatTarih(uye.kayitTarihi || uye.KayitTarihi)}
                  </p>
                </div>

                {/* Durum - Tam genişlik */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 col-span-1 md:col-span-2">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaUserCheck size={12} /> Durum
                  </p>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      isActive(uye) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isActive(uye) ? '✅ Aktif' : '❌ Pasif'}
                    </span>
                  </p>
                </div>
              </div>

              {/* ✅ ADRES BİLGİLERİ - YENİ EKLENDİ */}
              {uye.adresler && uye.adresler.length > 0 ? (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <FaAddressCard className="text-yellow-400" />
                    <h4 className="text-white font-medium"> Adres Bilgileri</h4>
                    <span className="text-gray-400 text-xs bg-white/10 px-2 py-0.5 rounded">
                      {uye.adresler.length} adres
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {uye.adresler.map((adres, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getAdresIcon(adres.adresTipi)}
                            <span className="text-white font-medium text-sm">
                              {adres.adresTipi || 'Varsayılan Adres'}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">#{adres.adresId}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm ml-6">
                          {adres.acikAdres || 'Adres detayı girilmemiş'}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 ml-6">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            adres.teslimatBolgesindeMi 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            <FaTruck     className="inline mr-1" size={10} />
                            {adres.teslimatBolgesindeMi ? 'Teslimat Bölgesinde' : 'Teslimat Bölgesi Dışında'}
                          </span>
                          {adres.uyeId && (
                            <span className="text-gray-500 text-xs">
                              Uye #{adres.uyeId}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center text-gray-400">
                  <FaMapMarkerAlt className="text-2xl mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">Bu üyeye ait adres bilgisi bulunmuyor.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FaUser className="text-6xl mx-auto mb-4 text-gray-600" />
              <p>Üye ID girerek detayları görüntüleyin</p>
              <p className="text-xs text-gray-500 mt-1">Örn: 1</p>
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

export default UyeDetay;