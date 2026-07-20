// src/Admin/components/Uye/UyeListele.js
import React from 'react';
import { FaTimes, FaUser, FaEnvelope } from 'react-icons/fa';

const UyeListele = ({ acik, kapat, uyeler, loading }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Üye Listesi</h2>
            <p className="text-gray-400 text-xs">Toplam {uyeler.length} üye</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-white rounded-full"></div>
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : uyeler.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz üye eklenmemiş</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {uyeler.map((uye, index) => {
                const ad = uye.uyeAdi || 'Bilinmiyor';
                const soyad = uye.uyeSoyadi || '';
                const email = uye.uyeEmail || '-';
                const uyeId = uye.uyeId || index + 1;

                return (
                  <div 
                    key={index} 
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 flex-shrink-0">
                        <FaUser />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-medium truncate">
                          {ad} {soyad}
                        </h3>
                        <p className="text-gray-400 text-xs truncate flex items-center gap-1">
                          <FaEnvelope size={10} />
                          {email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-gray-500 text-xs">#{uyeId}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {uyeler.length} üye</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UyeListele;