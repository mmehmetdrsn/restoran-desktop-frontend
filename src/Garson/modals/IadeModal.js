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
  processRefund
}) => {
  if (!showRefundModal) return null;

  const refundTotal = selectedRefundItems.reduce((sum, idx) => {
    const item = refundItems[idx];
    return sum + (item?.price || 0) * (item?.quantity || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">↩️ İade/İptal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white text-sm block mb-2">Masa Seç</label>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) onTableSelect(parseInt(val, 10));
              }}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
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
              <label className="text-white text-sm block mb-2">📋 İade Edilecek Ürünler</label>
              <div className="space-y-2">
                {refundItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={selectedRefundItems.includes(index)}
                      onChange={() => toggleRefundItem(index)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-white text-sm">{item.quantity}x {item.name}</span>
                      {item.note && <span className="text-yellow-400 text-xs ml-2">📝 {item.note}</span>}
                    </div>
                    <span className="text-white text-sm">₺{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-white text-sm block mb-2">İade Sebebi</label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
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
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">İade Tutarı: ₺{refundTotal}</p>
            </div>
          )}

          <button
            onClick={processRefund}
            disabled={selectedRefundItems.length === 0 || !refundReason}
            className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            İadeyi Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default IadeModal;