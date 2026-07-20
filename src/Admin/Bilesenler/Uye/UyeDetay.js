// src/Admin/components/Uye/UyeDetay.js
import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaUserCheck, FaIdCard, FaVenusMars } from 'react-icons/fa';
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
          {/* Arama Formu */}
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

          {/* Üye Bilgileri */}
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
                      uye.isActive === true || uye.IsActive === true || uye.isActive === 1 || uye.IsActive === 1
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {uye.isActive === true || uye.IsActive === true || uye.isActive === 1 || uye.IsActive === 1 
                        ? '✅ Aktif' 
                        : '❌ Pasif'}
                    </span>
                  </p>
                </div>
              </div>
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