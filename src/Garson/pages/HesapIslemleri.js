import React from 'react';

const HesapIslemleri = ({ occupiedTables, processPayment, onOpenPayment, isDayMode }) => {
  return (
    <div className="space-y-4">
      <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>Dolu Masalar</p>
      {occupiedTables.length === 0 && <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Ödeme alınacak masa yok</p>}
      <div className="grid grid-cols-1 gap-3">
        {occupiedTables.map(table => (
          <div key={table.id} className={`${isDayMode ? 'bg-slate-100 border border-slate-200/50 text-slate-900' : 'bg-white/5 border border-white/10 text-white'} p-3 rounded-lg flex items-center justify-between`}>
            <div>
              <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-medium`}>{table.name}</p>
              <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>Toplam: ₺{table.order?.total || 0}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => processPayment(table.id, 'Nakit')} className={isDayMode ? 'py-2 px-3 bg-green-500/20 text-green-700 rounded' : 'py-2 px-3 bg-green-500/20 text-green-400 rounded'}>Nakit</button>
              <button onClick={() => processPayment(table.id, 'Kart')} className={isDayMode ? 'py-2 px-3 bg-blue-500/20 text-blue-700 rounded' : 'py-2 px-3 bg-blue-500/20 text-blue-400 rounded'}>Kart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HesapIslemleri;
