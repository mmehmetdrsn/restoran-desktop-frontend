// src/Admin/components/Urun/UrunListele.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const UrunListele = ({ acik, kapat, urunler }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Ürün Listesi</h2>
            <p className="text-gray-400 text-xs">Toplam {urunler.length} ürün</p>
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
                <th className="text-left py-2 px-3">Ürün Adı</th>
                <th className="text-left py-2 px-3">Kategori</th>
                <th className="text-right py-2 px-3">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {urunler.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400">Henüz ürün eklenmemiş</td></tr>
              ) : (
                urunler.map((urun, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3 text-gray-400 text-xs">{index + 1}</td>
                    <td className="py-2 px-3 text-white text-sm">{urun.urunAdi || urun.name || 'Bilinmiyor'}</td>
                    <td className="py-2 px-3 text-gray-400 text-sm">{urun.kategori || urun.kategoriAdi || '-'}</td>
                    <td className="py-2 px-3 text-yellow-400 text-sm text-right">₺{urun.fiyat || urun.price || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {urunler.length} ürün</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrunListele;