import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const YeniSiparisPage = ({
  categories,
  selectedCategory,
  onCategorySelect,
  filteredMenu,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateItemNote,
  onConfirmOrder,
  selectedTable,
  onSelectTable,
  onCancelSelection,
  tables,
  isDayMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredMenu.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const paginatedMenu = filteredMenu.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.price ?? item.fiyat ?? 0;
    const quantity = item.quantity ?? item.adet ?? 1;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${isDayMode ? 'bg-slate-50 shadow-sm border border-slate-200/60 text-slate-900' : 'bg-black/60 border-white/10'} p-4 rounded-3xl`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>Kategoriler:</p>
          <select value={selectedCategory} onChange={(e) => onCategorySelect(e.target.value)} className={`${isDayMode ? 'ml-0 sm:ml-2 p-2 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm' : 'ml-2 p-2 bg-white/5 rounded-lg text-white'}`}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {paginatedMenu.map(item => (
            <div key={item.id} className={`${isDayMode ? 'bg-white border border-slate-200 shadow-sm' : 'bg-white/5'} flex items-center justify-between p-3 rounded-2xl`}>
              <div>
                <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-medium`}>{item.name}</p>
                <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>₺{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onAddToCart(item)} className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition">Ekle</button>
              </div>
            </div>
          ))}
        </div>
        {filteredMenu.length > pageSize && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-2xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Önceki
            </button>
            <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-300'} text-sm`}>
              Sayfa {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-2xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>

      <div className={`${isDayMode ? 'bg-slate-50 shadow-sm border border-slate-200/60 text-slate-900' : 'bg-black/60 border-white/10 text-white'} p-4 rounded-3xl relative`}>
        <div className="absolute top-4 right-4">
          <button onClick={onCancelSelection} className={`${isDayMode ? 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200' : 'text-gray-400 hover:text-white bg-white/5'} p-2 rounded-full transition`}>
            <FaTimes />
          </button>
        </div>
        <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold mb-3`}>Sepet</p>
        {cart.length === 0 && <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>Sepet boş</p>}
        <div className="space-y-2">
          {cart.map(it => (
            <div key={it.id} className={`${isDayMode ? 'bg-white border border-slate-200 shadow-sm text-slate-900' : 'bg-white/5 text-white'} flex items-center justify-between p-4 rounded-2xl`}>
              <div>
                <p className="text-sm font-medium">{it.quantity}x {it.name}</p>
                {it.note && <p className={`${isDayMode ? 'text-slate-600' : 'text-yellow-400'} text-xs`}>📝 {it.note}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemoveFromCart(it.id)} className={`${isDayMode ? 'text-slate-900 text-sm px-3 py-1 bg-slate-200 rounded-lg' : 'text-sm px-3 py-1 bg-white/10 rounded-lg'}`}>-</button>
                <button onClick={() => onUpdateItemNote(it.id)} className={`${isDayMode ? 'text-slate-900 text-sm px-3 py-1 bg-slate-200 rounded-lg' : 'text-sm px-3 py-1 bg-white/10 rounded-lg'}`}>Not</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>Masa Seç</label>
            <select value={selectedTable?.id || ''} onChange={(e) => onSelectTable(tables.find(t => t.id === parseInt(e.target.value)))} className={`${isDayMode ? 'w-full mt-2 p-2 bg-white rounded-xl text-slate-900 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300' : 'w-full mt-2 p-2 bg-white/5 rounded-lg text-white'}`}>
              <option value="">Seçiniz...</option>
              {tables.map(t => <option key={t.id} value={t.id}>{t.name} - {t.status}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className={`${isDayMode ? 'rounded-xl bg-slate-100 p-3 border border-slate-200/50' : 'rounded-xl bg-white/5 p-3 border border-white/10'}`}>
            <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>Toplam</p>
            <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-2xl font-bold`}>₺{cartTotal.toFixed(2)}</p>
          </div>
          <button onClick={onConfirmOrder} className="w-full py-2.5 rounded-2xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition">Siparişi Onayla</button>
        </div>
      </div>
    </div>
  );
};

export default YeniSiparisPage;
