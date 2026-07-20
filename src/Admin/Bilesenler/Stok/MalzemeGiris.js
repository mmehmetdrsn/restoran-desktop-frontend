// src/Admin/components/Stok/MalzemeGiris.js
import React, { useState } from 'react';
import { FaPlusCircle, FaTimes, FaBox, FaArrowUp, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { materialService } from '../../../api/api';

const MalzemeGiris = ({ acik, kapat, onSuccess, malzemeler }) => {
  const [isYeniMalzeme, setIsYeniMalzeme] = useState(true); // true: yeni ekle, false: var olana ekle
  const [selectedMalzemeId, setSelectedMalzemeId] = useState('');
  const [selectedMalzeme, setSelectedMalzeme] = useState(null);
  const [formData, setFormData] = useState({
    malzemeAdi: '',
    stokMiktari: '',
    birim: 'Adet',
    birimMaliyeti: ''
  });
  const [loading, setLoading] = useState(false);

  if (!acik) return null;

  // Malzeme seçildiğinde bilgilerini göster
  const handleMalzemeSec = (id) => {
    if (!id) {
      setSelectedMalzeme(null);
      setSelectedMalzemeId('');
      return;
    }
    const malzeme = malzemeler.find(m => m.malzemeId === parseInt(id));
    setSelectedMalzeme(malzeme);
    setSelectedMalzemeId(id);
  };

  // ✅ Mevcut malzemeye stok ekleme
  const handleStokEkle = async (e) => {
    e.preventDefault();
    
    if (!selectedMalzemeId) {
      toast.warning('Lütfen bir malzeme seçin!');
      return;
    }

    const eklenecekMiktar = parseFloat(formData.stokMiktari);
    if (!eklenecekMiktar || eklenecekMiktar <= 0) {
      toast.warning('Geçerli bir miktar girin!');
      return;
    }

    setLoading(true);
    try {
      // Mevcut malzemeyi güncelle
      const yeniStok = (selectedMalzeme?.stokMiktari || 0) + eklenecekMiktar;
      await materialService.update(parseInt(selectedMalzemeId), {
        malzemeAdi: selectedMalzeme?.malzemeAdi,
        stokMiktari: yeniStok,
        birim: selectedMalzeme?.birim,
        birimMaliyeti: selectedMalzeme?.birimMaliyeti
      });
      
      toast.success(`✅ ${eklenecekMiktar} ${selectedMalzeme?.birim} stok eklendi!`);
      setFormData({ ...formData, stokMiktari: '' });
      setSelectedMalzemeId('');
      setSelectedMalzeme(null);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Stok eklenirken hata:', error);
      toast.error('❌ Stok eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Yeni malzeme ekleme
  const handleYeniMalzemeEkle = async (e) => {
    e.preventDefault();
    
    if (!formData.malzemeAdi) {
      toast.warning('Lütfen malzeme adını girin!');
      return;
    }

    const miktar = parseFloat(formData.stokMiktari);
    if (!miktar || miktar < 0) {
      toast.warning('Geçerli bir miktar girin!');
      return;
    }

    setLoading(true);
    try {
      await materialService.create({
        malzemeAdi: formData.malzemeAdi.trim(),
        stokMiktari: miktar || 0,
        birim: formData.birim || 'Adet',
        birimMaliyeti: parseFloat(formData.birimMaliyeti) || null
      });
      
      toast.success('✅ Yeni malzeme başarıyla eklendi!');
      setFormData({
        malzemeAdi: '',
        stokMiktari: '',
        birim: 'Adet',
        birimMaliyeti: ''
      });
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Malzeme eklenirken hata:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.Mesaj) {
          if (errorData.MevcutMalzemeId) {
            toast.error(
              `❌ ${errorData.Mesaj}\nMevcut Malzeme ID: ${errorData.MevcutMalzemeId}`
            );
          } else {
            toast.error(`❌ ${errorData.Mesaj}`);
          }
        } else {
          toast.error('❌ Malzeme eklenirken hata oluştu!');
        }
      } else if (error.request) {
        toast.error('❌ Sunucuya bağlanılamıyor!');
      } else {
        toast.error('❌ Bir hata oluştu: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-green-400"><FaPlusCircle /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Malzeme Girişi</h2>
              <p className="text-gray-400 text-xs">Stok ekle veya yeni malzeme oluştur</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* ✅ İŞLEM TİPİ SEÇİMİ */}
        <div className="flex gap-2 mb-4 bg-white/5 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setIsYeniMalzeme(true)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isYeniMalzeme 
                ? 'bg-green-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaPlusCircle className="inline mr-2" size={14} />
            Yeni Malzeme
          </button>
          <button
            type="button"
            onClick={() => setIsYeniMalzeme(false)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !isYeniMalzeme 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaArrowUp className="inline mr-2" size={14} />
            Stok Ekle
          </button>
        </div>

        {/* ✅ YENİ MALZEME EKLEME FORMU */}
        {isYeniMalzeme ? (
          <form onSubmit={handleYeniMalzemeEkle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Malzeme Adı <span className="text-red-400">*</span>
              </label>
              <input
                value={formData.malzemeAdi}
                onChange={(e) => setFormData({...formData, malzemeAdi: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Örn: Un, Şeker, Yağ"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Stok Miktarı <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.stokMiktari}
                onChange={(e) => setFormData({...formData, stokMiktari: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="0"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Birim <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.birim}
                onChange={(e) => setFormData({...formData, birim: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                required
                disabled={loading}
              >
                <option value="Adet">Adet</option>
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Litre">Litre</option>
                <option value="Paket">Paket</option>
                <option value="Kutu">Kutu</option>
                <option value="Demet">Demet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Birim Maliyeti (₺)
                <span className="text-gray-500 text-xs ml-1">(opsiyonel)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.birimMaliyeti}
                onChange={(e) => setFormData({...formData, birimMaliyeti: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="0.00"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={kapat} 
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all" 
                disabled={loading}
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ekleniyor...</>
                ) : (
                  'Yeni Malzeme Ekle'
                )}
              </button>
            </div>
          </form>
        ) : (
          // ✅ MEVCUT MALZEMEYE STOK EKLEME FORMU
          <form onSubmit={handleStokEkle} className="space-y-4">
            {/* Malzeme Seçimi - Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Malzeme Seçin <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedMalzemeId}
                onChange={(e) => handleMalzemeSec(e.target.value)}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                required
                disabled={loading}
              >
                <option value="">-- Malzeme Seçin --</option>
                {malzemeler.map((m) => (
                  <option key={m.malzemeId} value={m.malzemeId}>
                    #{m.malzemeId} - {m.malzemeAdi} (Stok: {m.stokMiktari} {m.birim})
                  </option>
                ))}
              </select>
            </div>

            {/* Seçilen Malzeme Bilgisi */}
            {selectedMalzeme && (
              <div className="bg-white/5 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{selectedMalzeme.malzemeAdi}</p>
                    <p className="text-gray-400 text-sm">
                      Mevcut Stok: <span className="text-white font-semibold">{selectedMalzeme.stokMiktari} {selectedMalzeme.birim}</span>
                    </p>
                    {selectedMalzeme.birimMaliyeti && (
                      <p className="text-gray-500 text-xs">
                        Birim Maliyeti: ₺{selectedMalzeme.birimMaliyeti}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs bg-white/10 px-2 py-1 rounded">
                    #{selectedMalzeme.malzemeId}
                  </span>
                </div>
              </div>
            )}

            {/* Eklenecek Miktar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Eklenecek Miktar <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.stokMiktari}
                onChange={(e) => setFormData({...formData, stokMiktari: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="0"
                required
                disabled={loading}
              />
              {selectedMalzeme && (
                <p className="text-gray-500 text-xs mt-1">
                  Yeni stok miktarı: <span className="text-white font-semibold">
                    {(selectedMalzeme.stokMiktari + parseFloat(formData.stokMiktari || 0)).toFixed(2)} {selectedMalzeme.birim}
                  </span>
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Açıklama
                <span className="text-gray-500 text-xs ml-1">(opsiyonel)</span>
              </label>
              <input
                value={formData.aciklama}
                onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Neden stok ekleniyor?"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={kapat} 
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all" 
                disabled={loading}
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading || !selectedMalzemeId} 
                className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ekleniyor...</>
                ) : (
                  <><FaCheck /> Stok Ekle</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MalzemeGiris;