// src/Garson/pages/HesapIslemleri.js
import React from 'react';

const HesapIslemleri = ({ occupiedTables, processPayment, isDayMode, selectedTable }) => {
  // Eğer özel olarak tek bir masa gönderilmişse sadece onu göster, yoksa dolu masaları listele
  const tablesToDisplay = selectedTable 
    ? [selectedTable] 
    : occupiedTables;

  return (
    <div className="space-y-4">
      <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
        {selectedTable ? `Ödeme Al: ${selectedTable.name}` : 'Ödeme Alınacak Masalar'}
      </p>
      
      {tablesToDisplay.length === 0 && (
        <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
          Ödeme alınacak masa bulunmuyor.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {tablesToDisplay.map(table => {
          const total = table.order?.toplam ?? table.order?.total ?? table.order?.tutar ?? 0;
          return (
            <div 
              key={table.id} 
              className={`${isDayMode ? 'bg-slate-100 border border-slate-200/50 text-slate-900' : 'bg-white/5 border border-white/10 text-white'} p-4 rounded-xl flex items-center justify-between gap-4`}
            >
              <div>
                <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-base`}>
                  {table.name}
                </p>
                <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-300'} text-sm mt-0.5`}>
                  Toplam Tutar: <span className="font-bold text-emerald-400">₺{Number(total).toFixed(2)}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => processPayment(table.id, 'Nakit')} 
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💵 Nakit
                </button>
                <button 
                  onClick={() => processPayment(table.id, 'Kart')} 
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💳 Kart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HesapIslemleri;