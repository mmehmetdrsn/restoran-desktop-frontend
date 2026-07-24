// src/Admin/Bilesenler/Personel/PersonelListele.js
import React, { useState } from 'react';
import { FaTimes, FaUser, FaCheck, FaTimes as FaClose, FaFilter } from 'react-icons/fa';

const PersonelListele = ({ acik, kapat, personeller }) => {
  const [filtre, setFiltre] = useState('TUMU');

  if (!acik) return null;

  const getRolColor = (rol) => {
    const r = (rol || '').toLowerCase();
    if (r.includes('admin') || r.includes('yonetici')) return 'bg-red-500/20 text-red-400';
    if (r.includes('garson')) return 'bg-blue-500/20 text-blue-400';
    if (r.includes('aşçı') || r.includes('asci')) return 'bg-orange-500/20 text-orange-400';
    if (r.includes('kurye')) return 'bg-green-500/20 text-green-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  // 🔥 Filtreleme
  const filteredPersoneller = personeller.filter(p => {
    if (filtre === 'TUMU') return true;
    if (filtre === 'AKTIF') return p.isActive !== false;
    if (filtre === 'PASIF') return p.isActive === false;
    return true;
  });

  const aktifSayisi = personeller.filter(p => p.isActive !== false).length;
  const pasifSayisi = personeller.filter(p => p.isActive === false).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Personel Listesi</h2>
            <p className="text-gray-400 text-xs">
              Toplam {personeller.length} personel 
              ({aktifSayisi} aktif, {pasifSayisi} pasif)
            </p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* 🔥 Filtre */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 flex items-center gap-3">
          <FaFilter className="text-gray-400" />
          <select
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/20 outline-none"
          >
            <option value="TUMU">Tümü ({personeller.length})</option>
            <option value="AKTIF">Aktif ({aktifSayisi})</option>
            <option value="PASIF">Pasif ({pasifSayisi})</option>
          </select>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredPersoneller.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Bu kategoride personel bulunamadı</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-white/10">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Ad Soyad</th>
                  <th className="text-left py-2 px-3">Kullanıcı Adı</th>
                  <th className="text-left py-2 px-3">Rol</th>
                  <th className="text-left py-2 px-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersoneller.map((p, index) => {
                  const rolAdi = p.rolAdi || p.rol || p.Rol || 'Bilinmiyor';
                  const isActive = p.isActive !== false;
                  
                  return (
                    <tr key={index} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${!isActive ? 'opacity-60' : ''}`}>
                      <td className="py-2 px-3 text-gray-400 text-xs">{index + 1}</td>
                      <td className="py-2 px-3 text-white text-sm">
                        {p.personelAdi || p.Adi || 'Bilinmiyor'} {p.personelSoyadi || p.Soyadi || ''}
                      </td>
                      <td className="py-2 px-3 text-gray-300 text-sm">{p.kullaniciAdi || p.KullaniciAdi || '-'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${getRolColor(rolAdi)}`}>
                          {rolAdi}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${
                          isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isActive ? <FaCheck size={10} /> : <FaClose size={10} />}
                          {isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
          <span className="text-gray-400 text-xs">
            Gösterilen: {filteredPersoneller.length} / Toplam: {personeller.length} personel
          </span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonelListele;