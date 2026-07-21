import React from 'react';
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
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'all' ? `${isDayMode ? 'bg-slate-200 text-slate-900' : 'bg-white/20 text-white'}` : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Tümü ({tables.length})</button>
        <button onClick={() => setFilter('empty')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'empty' ? 'bg-green-500/30 text-green-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Boş ({tables.filter(t => t.status === 'empty').length})</button>
        <button onClick={() => setFilter('occupied')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'occupied' ? 'bg-red-500/30 text-red-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Dolu ({tables.filter(t => t.status === 'occupied').length})</button>
        <button onClick={() => setFilter('reserved')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'reserved' ? 'bg-orange-500/30 text-orange-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Rezerve ({tables.filter(t => t.status === 'reserved').length})</button>
        <button onClick={() => setFilter('broken')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'broken' ? 'bg-gray-500/30 text-gray-400' : `${isDayMode ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}`}>Arızalı ({tables.filter(t => t.status === 'broken').length})</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTables.map((table) => (
          <div key={table.id} onClick={() => handleTableClick(table)} className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 ${getTableStatusColor(table.status)} shadow-lg hover:shadow-xl hover:scale-105 border ${isDayMode ? 'border-slate-200/50' : 'border-white/10'}`}>
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-2">{getStatusIcon(table.status)}</div>
              <h3 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>{table.name}</h3>
              <div className={`flex items-center gap-1 ${isDayMode ? 'text-slate-600' : 'text-white/80'} text-sm`}><FaChair size={12} /><span>{table.capacity} Kişi</span></div>
              {table.status === 'occupied' && table.order && (
                <>
                  <div className={`mt-2 ${isDayMode ? 'text-slate-900' : 'text-white/90'} text-sm font-medium`}>₺{table.order?.total ?? table.order?.toplam ?? table.order?.tutar ?? 0}</div>
                  <div className={`${isDayMode ? 'text-slate-500' : 'text-white/70'} text-xs`}>{table.time}</div>
                </>
              )}
              {table.status === 'reserved' && <div className={`mt-2 ${isDayMode ? 'text-slate-600' : 'text-white/80'} text-sm`}>{table.time}</div>}
              <div className={`mt-2 ${isDayMode ? 'text-slate-500' : 'text-white/60'} text-[10px] uppercase`}>{getTableStatusText(table.status)}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStatusModal(table);
                }}
                className={`mt-4 w-full py-2 text-sm rounded-xl transition ${isDayMode ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-white/10 hover:bg-white/15 text-white'}`}
              >
                Durum Değiştir
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MasaYonetimi;
