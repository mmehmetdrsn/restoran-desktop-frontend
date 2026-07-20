import { FaTimes, FaArrowRight } from 'react-icons/fa';

const MasaTasiModal = ({
  showMoveTableModal,
  onClose,
  tables,
  moveFromTable,
  moveToTable,
  setMoveFromTable,
  setMoveToTable,
  handleMoveTable
}) => {
  if (!showMoveTableModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">📦 Masa Taşı</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white text-sm block mb-2">📍 Kaynak Masa (Dolu)</label>
            <select
              value={moveFromTable}
              onChange={(e) => setMoveFromTable(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            >
              <option value="">Seçiniz...</option>
              {tables.filter(t => t.status === 'occupied').map(table => (
                <option key={table.id} value={table.id}>{table.name} (₺{table.order?.total || 0})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white text-sm block mb-2">📍 Hedef Masa (Boş)</label>
            <select
              value={moveToTable}
              onChange={(e) => setMoveToTable(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            >
              <option value="">Seçiniz...</option>
              {tables.filter(t => t.status === 'empty').map(table => (
                <option key={table.id} value={table.id}>{table.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleMoveTable}
            className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaArrowRight /> Taşı
          </button>
          <p className="text-gray-500 text-xs text-center">⚠️ Dolu masa boş masaya taşınacaktır.</p>
        </div>
      </div>
    </div>
  );
};

export default MasaTasiModal;
