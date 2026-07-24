// src/Garson/modals/MasaTasiModal.js
import React from 'react';
import { FaTimes, FaArrowRight } from 'react-icons/fa';

const MasaTasiModal = ({
  showMoveTableModal,
  onClose,
  tables = [],
  moveFromTable,
  moveToTable,
  setMoveFromTable,
  setMoveToTable,
  handleMoveTable
}) => {
  if (!showMoveTableModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            📦 Masa Taşı
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Kaynak Masa (Dolu) */}
          <div>
            <label className="text-white text-sm block mb-2 font-medium">📍 Kaynak Masa (Dolu)</label>
            <select
              value={moveFromTable}
              onChange={(e) => setMoveFromTable(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-white">Seçiniz...</option>
              {tables.filter(t => t.status === 'occupied').map(table => {
                const total = table.order?.toplam ?? table.order?.total ?? table.order?.tutar ?? 0;
                return (
                  <option key={table.id} value={table.id} className="bg-gray-900 text-white">
                    {table.name} (₺{Number(total).toFixed(2)})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Hedef Masa (Boş) */}
          <div>
            <label className="text-white text-sm block mb-2 font-medium">📍 Hedef Masa (Boş)</label>
            <select
              value={moveToTable}
              onChange={(e) => setMoveToTable(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-white">Seçiniz...</option>
              {tables.filter(t => t.status === 'empty').map(table => (
                <option key={table.id} value={table.id} className="bg-gray-900 text-white">
                  {table.name}
                </option>
              ))}
            </select>
          </div>

          {/* Taşı Butonu */}
          <button
            onClick={handleMoveTable}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <FaArrowRight /> Taşı
          </button>
          
          <p className="text-gray-400 text-xs text-center">⚠️ Dolu masa seçilen boş masaya aktarılacaktır.</p>
        </div>
      </div>
    </div>
  );
};

export default MasaTasiModal;