import React from 'react';

const HesapIslemleri = ({ occupiedTables, processPayment, onOpenPayment }) => {
  return (
    <div className="space-y-4">
      <p className="text-white font-semibold">Dolu Masalar</p>
      {occupiedTables.length === 0 && <p className="text-gray-400">Ödeme alınacak masa yok</p>}
      <div className="grid grid-cols-1 gap-3">
        {occupiedTables.map(table => (
          <div key={table.id} className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{table.name}</p>
              <p className="text-gray-400 text-sm">Toplam: ₺{table.order?.total || 0}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => processPayment(table.id, 'Nakit')} className="py-2 px-3 bg-green-500/20 text-green-400 rounded">Nakit</button>
              <button onClick={() => processPayment(table.id, 'Kart')} className="py-2 px-3 bg-blue-500/20 text-blue-400 rounded">Kart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HesapIslemleri;
