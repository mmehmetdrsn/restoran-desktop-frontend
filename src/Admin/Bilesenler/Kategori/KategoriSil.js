import React, { useState } from 'react';
import { FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoryService } from '../../../api/api';


const SilmeOnayModal = ({ acik, kapat, onConfirm, kategoriId }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-2xl">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Kategoriyi Sil</h2>
            <p className="text-gray-400 text-sm">Bu işlem geri alınamaz</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">
          <span className="text-white font-medium">#{kategoriId}</span> ID'li kategoriyi silmek istediğinize emin misiniz?
        </p>
        
      
        <div className="flex gap-3">
          <button 
            onClick={kapat}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all"
          >
            İptal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

const KategoriSil = ({ acik, kapat, onSuccess }) => {
  const [kategoriId, setKategoriId] = useState('');
  const [loading, setLoading] = useState(false);
  
 
  const [silmeModal, setSilmeModal] = useState({ acik: false, id: null });

  if (!acik) return null;


  const silmeTiklandi = (e) => {
    e.preventDefault();
    if (!kategoriId) {
      toast.warning('Lütfen kategori ID girin!');
      return;
    }
    setSilmeModal({ acik: true, id: kategoriId });
  };

  
  const silmeOnayla = async () => {
    const id = silmeModal.id;
    
    try {
      setLoading(true);
      await categoryService.delete(parseInt(id));
      toast.success('✅ Kategori silindi.');
      setKategoriId('');
      setSilmeModal({ acik: false, id: null });
      kapat();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('❌ Bu kategori silinemedi. Lütfen önce bu kategoriye ait ürünleri silin veya başka bir kategoriye taşıyın.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-red-400"><FaTrash /></div>
              <div>
                <h2 className="text-white font-bold text-lg">Kategori Sil</h2>
                <p className="text-gray-400 text-xs">Silmek istediğiniz kategori ID'sini girin</p>
              </div>
            </div>
            <button onClick={kapat} className="text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>
          <form onSubmit={silmeTiklandi} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori ID</label>
              <input
                type="number"
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Örn: 1"
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={kapat} 
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" 
                disabled={loading}
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Siliniyor...</>
                ) : (
                  'Sil'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SilmeOnayModal 
        acik={silmeModal.acik}
        kapat={() => setSilmeModal({ acik: false, id: null })}
        onConfirm={silmeOnayla}
        kategoriId={silmeModal.id}
      />
    </>
  );
};

export default KategoriSil;