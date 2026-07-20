// src/Admin/components/Personel/PersonelListele.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const PersonelListele = ({ acik, kapat, personeller }) => {
  if (!acik) return null;

  const getRolColor = (rol) => {
    const r = (rol || '').toLowerCase();
    if (r.includes('admin') || r.includes('yonetici')) return 'bg-red-500/20 text-red-400';
    if (r.includes('garson')) return 'bg-blue-500/20 text-blue-400';
    if (r.includes('aşçı') || r.includes('asci')) return 'bg-orange-500/20 text-orange-400';
    if (r.includes('kurye')) return 'bg-green-500/20 text-green-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Personel Listesi</h2>
            <p className="text-gray-400 text-xs">Toplam {personeller.length} personel</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
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
              {personeller.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-400">Henüz personel eklenmemiş</td></tr>
              ) : (
                personeller.map((p, index) => {
                  const rolAdi = p.rolAdi || p.rol || p.Rol || 'Bilinmiyor';
                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                        <span className={`px-2 py-1 rounded text-xs ${p.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.isActive !== false ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {personeller.length} personel</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonelListele;