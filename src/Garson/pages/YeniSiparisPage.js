import React from 'react';

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
  tables
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-black/60 p-4 rounded-xl border border-white/10">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-white font-semibold">Kategoriler:</p>
          <select value={selectedCategory} onChange={(e) => onCategorySelect(e.target.value)} className="ml-2 p-2 bg-white/5 rounded-lg text-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredMenu.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-gray-400 text-sm">₺{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onAddToCart(item)} className="px-3 py-2 bg-white/10 rounded-lg text-sm">Ekle</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/60 p-4 rounded-xl border border-white/10">
        <p className="text-white font-semibold mb-3">Sepet</p>
        {cart.length === 0 && <p className="text-gray-400 text-sm">Sepet boş</p>}
        <div className="space-y-2">
          {cart.map(it => (
            <div key={it.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div>
                <p className="text-white text-sm">{it.quantity}x {it.name}</p>
                {it.note && <p className="text-yellow-400 text-xs">📝 {it.note}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemoveFromCart(it.id)} className="text-sm px-2 py-1 bg-white/10 rounded">-</button>
                <button onClick={() => onUpdateItemNote(it.id)} className="text-sm px-2 py-1 bg-white/10 rounded">Not</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-gray-400 text-sm">Masa Seç</label>
          <select value={selectedTable?.id || ''} onChange={(e) => onSelectTable(tables.find(t => t.id === parseInt(e.target.value)))} className="w-full mt-2 p-2 bg-white/5 rounded-lg text-white">
            <option value="">Seçiniz...</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} - {t.status}</option>)}
          </select>
        </div>

        <div className="mt-4">
          <button onClick={onConfirmOrder} className="w-full py-2.5 bg-white text-black rounded-lg font-semibold">Siparişi Onayla</button>
        </div>
      </div>
    </div>
  );
};

export default YeniSiparisPage;
