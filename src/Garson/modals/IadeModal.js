import { FaTimes } from 'react-icons/fa';

const IadeModal = ({
  showRefundModal,
  onClose,
  tables,
  refundItems,
  refundReason,
  selectedRefundItems,
  setRefundReason,
  onTableSelect,
  toggleRefundItem,
  processRefund,
  isDayMode = false
}) => {
  if (!showRefundModal) return null;

  const refundTotal = selectedRefundItems.reduce((sum, idx) => {
    const item = refundItems[idx];
    return sum + (item?.price || 0) * (item?.quantity || 0);
  }, 0);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDayMode ? 'bg-slate-900/35 backdrop-blur-[2px]' : 'bg-black/70 backdrop-blur-sm'}`}>
      <div className={`${isDayMode ? 'iade-day bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 text-slate-900 shadow-[0_22px_60px_rgba(15,23,42,0.16)]' : 'bg-black/95 border border-white/10 text-white shadow-2xl'} backdrop-blur-sm rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>↩️ İade/İptal</h2>
          <button
            onClick={onClose}
            className={`${isDayMode ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-gray-400 hover:text-white'} p-1.5 rounded-full transition-colors`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`${isDayMode ? 'text-slate-700' : 'text-white'} text-sm block mb-2`}>Masa Seç</label>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) onTableSelect(parseInt(val, 10));
              }}
              className={`${isDayMode ? 'day-mode-select w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none' : 'w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none'}`}
            >
              <option value="">Seçiniz...</option>
              {tables.filter(t => t.status === 'occupied').map(table => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>

          {refundItems.length > 0 && (
            <div>
              <label className={`${isDayMode ? 'text-slate-700' : 'text-white'} text-sm block mb-2`}>📋 İade Edilecek Ürünler</label>
              <div className="space-y-2">
                {refundItems.map((item, index) => (
                  <div
                    key={index}
                    className={`${isDayMode ? 'flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all' : 'flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all'}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRefundItems.includes(index)}
                      onChange={() => toggleRefundItem(index)}
                      className={`${isDayMode ? 'w-4 h-4 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer' : 'w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer'}`}
                    />
                    <div className="flex-1">
                      <span className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-sm`}>{item.quantity}x {item.name}</span>
                      {item.note && <span className={`${isDayMode ? 'text-amber-700' : 'text-yellow-400'} text-xs ml-2`}>📝 {item.note}</span>}
                    </div>
                    <span className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-sm`}>₺{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={`${isDayMode ? 'text-slate-700' : 'text-white'} text-sm block mb-2`}>İade Sebebi</label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className={`${isDayMode ? 'day-mode-select w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none' : 'w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none'}`}
            >
              <option value="">Seçiniz...</option>
              <option value="Müşteri vazgeçti">Müşteri vazgeçti</option>
              <option value="Yanlış ürün">Yanlış ürün</option>
              <option value="Ürün beğenilmedi">Ürün beğenilmedi</option>
              <option value="Geç teslimat">Geç teslimat</option>
              <option value="Hatalı sipariş">Hatalı sipariş</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          {selectedRefundItems.length > 0 && (
            <div className={`${isDayMode ? 'bg-rose-50 border border-rose-200 rounded-xl p-3' : 'bg-red-500/10 border border-red-500/30 rounded-lg p-3'}`}>
              <p className={`${isDayMode ? 'text-rose-700' : 'text-red-400'} text-sm`}>İade Tutarı: ₺{refundTotal}</p>
            </div>
          )}

          <button
            onClick={processRefund}
            disabled={selectedRefundItems.length === 0 || !refundReason}
            className={`w-full py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
              isDayMode
                ? 'rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200'
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg'
            }`}
          >
            İadeyi Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default IadeModal;