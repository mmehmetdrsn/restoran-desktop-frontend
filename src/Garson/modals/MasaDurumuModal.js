import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tableService } from '../../api/api';

const MasaDurumuModal = ({
  showStatusModal,
  onClose,
  selectedTable,
  verileriYukle
}) => {
  if (!showStatusModal || !selectedTable) return null;

  const handleStatusChange = async (yeniDurum) => {
    try {
      await tableService.updateStatus(selectedTable.id, yeniDurum);
      toast.success("Masa durumu güncellendi");
      await verileriYukle();
      onClose();
    } catch (err) {
      console.error("Hata:", err);
      toast.error(err.response?.data?.Mesaj || "Güncellenemedi");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">📊 Masa Durumu Değiştir</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Seçili Masa:</p>
          <p className="text-white font-bold text-lg">{selectedTable.name}</p>
          <p className="text-gray-400 text-sm mt-2">
            Mevcut Durum: <span className="text-yellow-400 font-semibold">
              {selectedTable.status === 'occupied' ? '🔴 DOLU' :
               selectedTable.status === 'reserved' ? '🟡 REZERVE' :
               selectedTable.status === 'broken' ? '⚠️ ARIZALI' :
               '🟢 BOŞ'}
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleStatusChange("BOŞ")}
            className="w-full py-3 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 text-green-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Boş Yap
          </button>
          
          <button
            onClick={() => handleStatusChange("DOLU")}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Dolu Yap
          </button>
          
          <button
            onClick={() => handleStatusChange("REZERVE")}
            className="w-full py-3 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 text-yellow-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Rezerve Yap
          </button>
          
          <button
            onClick={() => handleStatusChange("ARIZALI")}
            className="w-full py-3 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/50 text-orange-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Arızalı Yap
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          ⚠️ Masa durumu değişecektir.
        </p>
      </div>
    </div>
  );
};

export default MasaDurumuModal;