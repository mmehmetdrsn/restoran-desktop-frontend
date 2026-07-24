// src/Garson/pages/MasaYonetimi.js
import React, { useState } from 'react';
import { FaChair } from 'react-icons/fa';

const MasaYonetimi = ({
  tables,
  filteredTables,
  filter,
  setFilter,
  handleTableClick,
  getTableStatusColor,
  getTableStatusText,
  getStatusIcon,
  onOpenStatusModal,
  isDayMode
}) => {
  

  // Sipariş detaylarını gösteren modal içeriği
  const renderOrderDetails = (table) => {
    if (table.status !== 'occupied' || !table.order) {
      return (
        <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm text-center py-4`}>
          Bu masa için aktif sipariş bulunmuyor.
        </div>
      );
    }

    const items = table.order.siparisUrunleri || table.order.items || [];
    const total = table.order.toplam || table.order.total || 0;

    if (items.length === 0) {
      return (
        <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm text-center py-4`}>
          Sipariş detayı bulunmuyor.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item, index) => {
          const name = item.urunAdi || item.name || 'Ürün';
          const qty = item.adet || item.quantity || 1;
          const price = item.fiyat || item.price || 0;
          const note = item.detayNot || item.note || '';
          return (
            <div key={index} className={`flex justify-between items-center p-2 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'} rounded-lg`}>
              <div>
                <span className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-medium`}>
                  {qty}x {name}
                </span>
                {note && (
                  <span className={`${isDayMode ? 'text-slate-500' : 'text-yellow-400'} text-xs block`}>
                    📝 {note}
                  </span>
                )}
              </div>
              <span className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
                ₺{(qty * price).toFixed(2)}
              </span>
            </div>
          );
        })}
        <div className={`border-t ${isDayMode ? 'border-slate-200' : 'border-white/10'} pt-2 mt-2`}>
          <div className="flex justify-between items-center">
            <span className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} font-medium`}>Toplam</span>
            <span className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-xl font-bold`}>
              ₺{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'all' ? `${isDayMode ? 'bg-slate-200 text-slate-900' : 'bg-white/20 text-white'}` : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Tümü ({tables.length})</button>
        <button onClick={() => setFilter('empty')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'empty' ? 'bg-green-500/30 text-green-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Boş ({tables.filter(t => t.status === 'empty').length})</button>
        <button onClick={() => setFilter('occupied')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'occupied' ? 'bg-red-500/30 text-red-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Dolu ({tables.filter(t => t.status === 'occupied').length})</button>
        <button onClick={() => setFilter('reserved')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'reserved' ? 'bg-orange-500/30 text-orange-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Rezerve ({tables.filter(t => t.status === 'reserved').length})</button>
        <button onClick={() => setFilter('broken')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'broken' ? 'bg-gray-500/30 text-gray-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Arızalı ({tables.filter(t => t.status === 'broken').length})</button>
      </div>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3 items-start">        {filteredTables.map((table) => (
          <div 
            key={table.id} 
            onClick={() => handleTableClick(table)} 
            className={`rounded-xl p-3 cursor-pointer transition-all duration-300 flex flex-col justify-between ${(table.status === 'occupied' || table.status === 'broken') ? 'h-56' : 'h-48'} ${getTableStatusColor(table.status)} shadow-lg hover:shadow-xl hover:scale-105 border ${isDayMode ? 'border-slate-200/50' : 'border-white/10'} relative`}
          >
            
<div className="h-full flex flex-col items-center text-center">              <h3 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>{table.name}</h3>
              
              {/* Masa durumu metni - her zaman görünür */}
              <div className={`mt-1 ${isDayMode ? 'text-slate-500' : 'text-white/60'} text-[10px] uppercase font-semibold`}>
                {getTableStatusText(table.status)}
              </div>

              {/* Dolu masa için sipariş özeti */}
              {table.status === 'occupied' && table.order && (
                <>
                  <div className={`mt-2 ${isDayMode ? 'text-slate-900' : 'text-white/90'} text-sm font-medium`}>
                    ₺{table.order?.toplam ?? table.order?.total ?? table.order?.tutar ?? 0}
                  </div>
                  {/* Tarih/saat gösterimi kaldırıldı */}
                  {/* Sipariş edilen ürün sayısı */}
                  {(() => {
                    const items = table.order?.siparisUrunleri || table.order?.items || [];
                    if (items.length > 0) {
                      return (
                        <div className={`${isDayMode ? 'text-slate-600' : 'text-white/60'} text-[10px] mt-1`}>
                          {items.length} ürün
                        </div>
                      );
                    }
                    return null;
                  })()}
                </>
              )}

              {/* Rezerve masa için zaman bilgisi */}
              {table.status === 'reserved' && (
                <div className={`mt-2 ${isDayMode ? 'text-slate-600' : 'text-white/80'} text-sm`}>
                  {table.time || 'Rezerve'}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStatusModal(table);
                }}
                className="w-full h-12 flex items-center justify-center px-4 text-sm rounded-xl transition border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-slate-700 shadow-sm"
              >
                Durum Değiştir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tıklandığında açılan sipariş detay modalı - GarsonPanel'den yönetiliyor */}
    </div>
  );
};

export default MasaYonetimi;