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

  // 🔥 Toplam fiyat hesaplama - düzeltildi
  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price ?? item.fiyat ?? 0);
    const quantity = parseInt(item.quantity ?? item.adet ?? 1);
    return sum + (price * quantity);
  }, 0);

  // Sepetteki her bir ürün için toplam fiyat hesapla
  const getItemTotal = (item) => {
    const price = parseFloat(item.price ?? item.fiyat ?? 0);
    const quantity = parseInt(item.quantity ?? item.adet ?? 1);
    return price * quantity;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sol Taraf - Menü */}
      <div className={`${isDayMode ? 'bg-slate-50 shadow-sm border border-slate-200/60 text-slate-900' : 'bg-black/60 border-white/10'} p-4 rounded-3xl`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>Kategoriler:</p>
          <select 
            value={selectedCategory} 
            onChange={(e) => onCategorySelect(e.target.value)} 
            className={`${isDayMode ? 'ml-0 sm:ml-2 p-2 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm' : 'ml-2 p-2 bg-white/5 rounded-lg text-white'}`}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {paginatedMenu.map(item => (
            <div key={item.id} className={`${isDayMode ? 'bg-white border border-slate-200 shadow-sm' : 'bg-white/5'} flex items-center justify-between p-3 rounded-2xl hover:shadow-md transition-all`}>
              <div>
                <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-medium`}>{item.name}</p>
                <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>₺{parseFloat(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onAddToCart(item)} 
                  className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                >
                  Ekle
                </button>
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

      {/* Sağ Taraf - Sepet */}
      <div className={`${isDayMode ? 'bg-slate-50 shadow-sm border border-slate-200/60 text-slate-900' : 'bg-black/60 border-white/10 text-white'} p-4 rounded-3xl relative`}>
        <div className="absolute top-4 right-4">
          <button 
            onClick={onCancelSelection} 
            className={`${isDayMode ? 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200' : 'text-gray-400 hover:text-white bg-white/5'} p-2 rounded-full transition`}
            title="Siparişi iptal et"
          >
            <FaTimes />
          </button>
        </div>

        <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold mb-3 flex items-center gap-2`}>
          🛒 Sepet
          {cart.length > 0 && (
            <span className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
              ({cart.length} ürün)
            </span>
          )}
        </p>

        {cart.length === 0 && (
          <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm text-center py-8`}>
            Sepet boş. Ürün eklemek için sol taraftaki menüyü kullanın.
          </p>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {cart.map(it => {
            const itemTotal = getItemTotal(it);
            return (
              <div key={it.id} className={`${isDayMode ? 'bg-white border border-slate-200 shadow-sm text-slate-900' : 'bg-white/5 text-white'} flex items-center justify-between p-3 rounded-2xl`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{it.quantity}x</span>
                    <span className="font-medium">{it.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      ₺{parseFloat(it.price ?? 0).toFixed(2)} / adet
                    </span>
                    <span className={`${isDayMode ? 'text-slate-700' : 'text-white'} font-semibold`}>
                      = ₺{itemTotal.toFixed(2)}
                    </span>
                  </div>
                  {it.note && (
                    <p className={`${isDayMode ? 'text-slate-600' : 'text-yellow-400'} text-xs mt-1`}>
                      📝 {it.note}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button 
                    onClick={() => onRemoveFromCart(it.id)} 
                    className={`${isDayMode ? 'text-slate-900 text-sm px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg' : 'text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg'} transition`}
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onUpdateItemNote(it.id)} 
                    className={`${isDayMode ? 'text-slate-900 text-sm px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg' : 'text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg'} transition`}
                  >
                    Not
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Masa Seçimi */}
        <div className="mt-4 space-y-3">
          <div>
            <label className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm font-medium block mb-1`}>
              🪑 Masa Seç
            </label>
            <select 
              value={selectedTable?.id || ''} 
              onChange={(e) => {
                const table = tables.find(t => t.id === parseInt(e.target.value));
                onSelectTable(table);
              }} 
              className={`${isDayMode ? 'w-full p-2 bg-white rounded-xl text-slate-900 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300' : 'w-full p-2 bg-white/5 rounded-lg text-white border border-white/10 focus:ring-2 focus:ring-white/20'} transition`}
            >
              <option value="">Seçiniz...</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.status === 'empty' ? '🟢 Boş' : t.status === 'occupied' ? '🔴 Dolu' : t.status === 'reserved' ? '🟡 Rezerve' : '⚫ Arızalı'}
                </option>
              ))}
            </select>
            {selectedTable && (
              <p className={`text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                ✅ Seçili masa: <span className="font-semibold">{selectedTable.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Toplam ve Onayla */}
        <div className="mt-4 space-y-3">
          <div className={`${isDayMode ? 'rounded-xl bg-slate-100 p-3 border border-slate-200/50' : 'rounded-xl bg-white/5 p-3 border border-white/10'}`}>
            <div className="flex justify-between items-center">
              <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>Toplam Tutar</p>
              <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-2xl font-bold`}>
                ₺{cartTotal.toFixed(2)}
              </p>
            </div>
            {cart.length > 0 && (
  <div className={`mt-2 p-2 rounded-lg ${isDayMode ? 'bg-amber-50 border border-amber-200' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
    <p className={`text-xs ${isDayMode ? 'text-amber-700' : 'text-yellow-400'}`}>
       Sipariş oluşturulurken stok kontrolü yapılacaktır. 
      Stokta yeterli malzeme yoksa sipariş oluşturulamaz.
    </p>
  </div>
)}s
          </div>

          <button 
            onClick={onConfirmOrder} 
            disabled={cart.length === 0 || !selectedTable}
            className={`w-full py-3 rounded-2xl font-semibold transition ${
              cart.length > 0 && selectedTable
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : `${isDayMode ? 'bg-slate-200 text-slate-400' : 'bg-white/10 text-gray-500'} cursor-not-allowed`
            }`}
          >
            {cart.length === 0 
              ? 'Sepet Boş' 
              : !selectedTable 
                ? 'Masa Seçin' 
                : '✅ Siparişi Onayla'
            }
          </button>

          {cart.length > 0 && !selectedTable && (
            <p className={`text-xs text-center ${isDayMode ? 'text-amber-600' : 'text-amber-400'}`}>
              ⚠️ Lütfen siparişi göndermek için bir masa seçin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YeniSiparisPage;