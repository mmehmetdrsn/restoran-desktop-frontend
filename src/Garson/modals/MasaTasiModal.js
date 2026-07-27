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
  handleMoveTable,
  isDayMode = false
}) => {
  if (!showMoveTableModal) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDayMode ? 'bg-slate-900/35 backdrop-blur-[2px]' : 'bg-black/70 backdrop-blur-sm'}`}>
      <div className={`${isDayMode ? 'masa-tasi-day bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 text-slate-900 shadow-[0_22px_60px_rgba(15,23,42,0.16)]' : 'bg-black/95 border border-white/10 text-white shadow-2xl'} backdrop-blur-sm rounded-2xl max-w-md w-full p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg flex items-center gap-2`}>
            📦 Masa Taşı
          </h2>
          <button
            onClick={onClose}
            className={`${isDayMode ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-gray-400 hover:text-white'} p-1.5 rounded-full transition-colors`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Kaynak Masa (Dolu) */}
          <div>
            <label className={`${isDayMode ? 'text-slate-700' : 'text-white'} text-sm block mb-2 font-medium`}>📍 Kaynak Masa (Dolu)</label>
            <select
              value={moveFromTable}
              onChange={(e) => setMoveFromTable(e.target.value)}
              className={`${isDayMode ? 'day-mode-select w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none cursor-pointer' : 'w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none cursor-pointer'}`}
            >
              <option value="" className={isDayMode ? 'bg-white text-slate-500' : 'bg-gray-900 text-white'}>Seçiniz...</option>
              {tables.filter(t => t.status === 'occupied').map(table => {
                const total = table.order?.toplam ?? table.order?.total ?? table.order?.tutar ?? 0;
                return (
                  <option key={table.id} value={table.id} className={isDayMode ? 'bg-white text-slate-900' : 'bg-gray-900 text-white'}>
                    {table.name} (₺{Number(total).toFixed(2)})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Hedef Masa (Boş) */}
          <div>
            <label className={`${isDayMode ? 'text-slate-700' : 'text-white'} text-sm block mb-2 font-medium`}>📍 Hedef Masa (Boş)</label>
            <select
              value={moveToTable}
              onChange={(e) => setMoveToTable(e.target.value)}
              className={`${isDayMode ? 'day-mode-select w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none cursor-pointer' : 'w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none cursor-pointer'}`}
            >
              <option value="" className={isDayMode ? 'bg-white text-slate-500' : 'bg-gray-900 text-white'}>Seçiniz...</option>
              {tables.filter(t => t.status === 'empty').map(table => (
                <option key={table.id} value={table.id} className={isDayMode ? 'bg-white text-slate-900' : 'bg-gray-900 text-white'}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>

          {/* Taşı Butonu */}
          <button
            onClick={handleMoveTable}
            className={`${isDayMode ? 'w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(245,158,11,0.35)]' : 'w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 shadow-lg'}`}
          >
            <FaArrowRight /> Taşı
          </button>
          
          <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-xs text-center`}>⚠️ Dolu masa seçilen boş masaya aktarılacaktır.</p>
        </div>
      </div>
    </div>
  );
};

export default MasaTasiModal;