// src/Admin/components/Masa/MasaDuzenle.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaChair } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tableService } from '../../../api/api';

const MasaDuzenle = ({ acik, kapat, onSuccess }) => {
  const [masaId, setMasaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [masaBulundu, setMasaBulundu] = useState(false);
  
  // ✅ Form state'i
  const [formData, setFormData] = useState({
    masaNo: '',
    masaDurumu: 'BOŞ'
  });

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!acik) {
      setMasaId('');
      setFormData({
        masaNo: '',
        masaDurumu: 'BOŞ'
      });
      setMasaBulundu(false);
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Masa ara ve bilgileri getir
  const handleMasaAra = async (e) => {
    e.preventDefault();
    if (!masaId) {
      toast.warning('Lütfen masa ID girin!');
      return;
    }

    setAraniyor(true);
    setMasaBulundu(false);

    try {
      const response = await tableService.getById(parseInt(masaId));
      const data = response.data;
      
      console.log('📋 Gelen masa verisi:', data);
      
      if (data && data.masaId) {
        // ✅ Forma verileri doldur
        setFormData({
          masaNo: data.masaNo || data.masaNo || '',
          masaDurumu: data.masaDurumu || 'BOŞ'
        });
        
        setMasaBulundu(true);
        toast.success(`✅ Masa #${data.masaId} bulundu!`);
      } else {
        toast.error('❌ Masa bulunamadı!');
        setMasaBulundu(false);
      }
    } catch (error) {
      console.error('Masa aranırken hata:', error);
      toast.error('❌ Masa bulunamadı!');
      setMasaBulundu(false);
    } finally {
      setAraniyor(false);
    }
  };

  // ✅ Güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!masaId) {
      toast.warning('Lütfen masa ID girin!');
      return;
    }

    if (!formData.masaNo || formData.masaNo.trim() === '') {
      toast.warning('Lütfen masa numarası girin!');
      return;
    }

    setLoading(true);
    try {
      const data = {
        masaNo: formData.masaNo.trim(),
        masaDurumu: formData.masaDurumu
      };

      console.log('📤 Güncellenen veri:', data);

      await tableService.update(parseInt(masaId), data);
      
      toast.success(`✅ Masa #${masaId} başarıyla güncellendi!`);
      setMasaId('');
      setFormData({
        masaNo: '',
        masaDurumu: 'BOŞ'
      });
      setMasaBulundu(false);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Masa güncellenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(`❌ ${errorData.message}`);
        } else {
          toast.error('❌ Masa güncellenirken bir hata oluştu!');
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

  // Masa durumu için renk seçeneği
  const getDurumRenk = (durum) => {
    const d = (durum || '').toUpperCase();
    if (d === 'DOLU') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (d === 'BOŞ') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (d === 'REZERVE') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Masa Düzenle</h2>
              <p className="text-gray-400 text-xs">Masa bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ ID ARAMA ALANI */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex gap-2">
              <input
                type="number"
                value={masaId}
                onChange={(e) => setMasaId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Masa ID girin (Örn: 5)"
                required
                disabled={araniyor || loading}
              />
              <button
                type="button"
                onClick={handleMasaAra}
                disabled={araniyor || loading || !masaId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {araniyor ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Aranıyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>
            {masaBulundu && (
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <FaChair className="text-green-400" /> Masa bulundu! Bilgileri düzenleyebilirsiniz.
              </p>
            )}
          </div>

          {/* ✅ MASA BİLGİLERİ */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaChair className="text-yellow-400" /> Masa Bilgileri
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Masa Numarası <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.masaNo}
                  onChange={(e) => setFormData({...formData, masaNo: e.target.value})}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Masa numarasını girin (Örn: İÇ-05)"
                  required
                  disabled={!masaBulundu || loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Masa Durumu <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.masaDurumu}
                    onChange={(e) => setFormData({...formData, masaDurumu: e.target.value})}
                    className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    disabled={!masaBulundu || loading}
                  >
                    <option value="BOŞ">🟢 Boş</option>
                    <option value="DOLU">🔴 Dolu</option>
                    <option value="REZERVE">🟡 Rezerve</option>
                  </select>
                  <span className={`px-3 py-2 rounded-lg text-sm flex items-center ${getDurumRenk(formData.masaDurumu)}`}>
                    {formData.masaDurumu || 'BOŞ'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ BULUNAN MASA BİLGİSİ */}
          {masaBulundu && (
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 flex items-center gap-3">
              <FaChair className="text-green-400 text-lg" />
              <div>
                <p className="text-green-400 text-sm font-medium">Masa #{masaId} düzenleniyor</p>
                <p className="text-gray-400 text-xs">
                  Numara: <span className="text-white font-medium">{formData.masaNo}</span> • 
                  Durum: <span className={`${formData.masaDurumu === 'DOLU' ? 'text-red-400' : formData.masaDurumu === 'REZERVE' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {formData.masaDurumu}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* BUTONLAR */}
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
              disabled={!masaBulundu || loading} 
              className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Güncelleniyor...</>
              ) : (
                'Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasaDuzenle;