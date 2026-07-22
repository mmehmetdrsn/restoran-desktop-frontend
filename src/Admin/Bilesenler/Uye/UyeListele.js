// src/Admin/components/Uye/UyeListele.js
import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaCheck, FaTimes as FaTimesIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UyeListele = ({ acik, kapat, uyeler, loading, onSuccess }) => {
  const [filterDurum, setFilterDurum] = useState('TUMU');

  if (!acik) return null;

  // ✅ Filtrelenmiş üyeler
  const filteredUyeler = uyeler.filter(uye => {
    if (filterDurum === 'AKTIF') return uye.isActive !== false;
    if (filterDurum === 'PASIF') return uye.isActive === false;
    return true; // TUMU
  });

  // ✅ Aktiflik durumu badge'i
  const getStatusBadge = (isActive) => {
    if (isActive === false) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
          <FaTimesIcon size={10} /> Pasif
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1 w-fit">
        <FaCheck size={10} /> Aktif
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Üye Listesi</h2>
            <p className="text-gray-400 text-xs">
              Toplam {uyeler.length} üye 
              ({uyeler.filter(u => u.isActive !== false).length} aktif, 
              {uyeler.filter(u => u.isActive === false).length} pasif)
            </p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* ✅ Filtreler */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 flex flex-wrap gap-2 items-center">
          <span className="text-gray-400 text-xs mr-2">Filtre:</span>
          <button
            onClick={() => setFilterDurum('TUMU')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              filterDurum === 'TUMU'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilterDurum('AKTIF')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              filterDurum === 'AKTIF'
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            ✅ Aktif
          </button>
          <button
            onClick={() => setFilterDurum('PASIF')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              filterDurum === 'PASIF'
                ? 'bg-red-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            ❌ Pasif
          </button>

          <span className="text-gray-500 text-xs ml-auto">
            {filteredUyeler.length} üye gösteriliyor
          </span>
        </div>

        {/* ✅ Liste */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-white rounded-full"></div>
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : filteredUyeler.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaUser size={32} className="mx-auto mb-3 opacity-30" />
              <p>Bu kategoride üye bulunamadı</p>
              <p className="text-xs mt-1">Filtreyi değiştirerek tekrar deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUyeler.map((uye, index) => {
                const ad = uye.uyeAdi || 'Bilinmiyor';
                const soyad = uye.uyeSoyadi || '';
                const email = uye.uyeEmail || '-';
                const uyeId = uye.uyeId || index + 1;
                const isActive = uye.isActive !== false;

                return (
                  <div 
                    key={index} 
                    className={`rounded-xl p-4 border transition-colors ${
                      isActive
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        <FaUser />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-medium truncate">
                          {ad} {soyad}
                        </h3>
                        <p className="text-gray-400 text-xs truncate flex items-center gap-1">
                          <FaEnvelope size={10} className="flex-shrink-0" />
                          {email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(isActive)}
                        <span className="text-gray-500 text-xs">#{uyeId}</span>
                      </div>
                      {/* ❌ PASİF YAP BUTONU KALDIRILDI */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
          <span className="text-gray-400 text-xs">
            Toplam: {uyeler.length} üye 
            ({uyeler.filter(u => u.isActive !== false).length} aktif, 
            {uyeler.filter(u => u.isActive === false).length} pasif)
          </span>
          <button 
            onClick={kapat} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UyeListele;