// src/Admin/components/Uye/UyeSil.js
import React, { useState, useEffect } from 'react';
import { FaTrash, FaTimes, FaSearch, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../../../api/api';

// ✅ ONAY MODALI BİLEŞENİ
const PasifYapOnayModal = ({ acik, kapat, onConfirm, uyeAdi, uyeId }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-2xl">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Üyeyi Pasife Al</h2>
            <p className="text-gray-400 text-sm">Bu işlem geri alınabilir</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-2">
          <span className="text-white font-medium">"{uyeAdi || uyeId}"</span> üyesini pasif duruma getirmek istediğinize emin misiniz?
        </p>
        
        <p className="text-gray-500 text-xs mb-6">
          ℹ️ Bu işlem üyeyi sistemden silmez, sadece pasif hale getirir. Pasif üyeler sisteme giriş yapamaz.
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
            Pasife Al
          </button>
        </div>
      </div>
    </div>
  );
};

const UyeSil = ({ acik, kapat, onSuccess }) => {
  const [uyeId, setUyeId] = useState('');
  const [uyeBilgisi, setUyeBilgisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  
  // ✅ Onay modalı state'i
  const [onayModal, setOnayModal] = useState({ acik: false, uyeAdi: '', uyeId: '' });

  // Modal kapandığında sıfırla
  useEffect(() => {
    if (!acik) {
      setUyeId('');
      setUyeBilgisi(null);
      setOnayModal({ acik: false, uyeAdi: '', uyeId: '' });
    }
  }, [acik]);

  if (!acik) return null;

  // ✅ Üye bilgilerini getir
  const handleUyeAra = async () => {
    if (!uyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }

    setAraniyor(true);
    setUyeBilgisi(null);

    try {
      const response = await userService.getById(parseInt(uyeId));
      const data = response.data || response;
      
      console.log('📋 Gelen üye verisi:', data);
      
      if (data && data.uyeId) {
        setUyeBilgisi(data);
        toast.success(`✅ ${data.uyeAdi} ${data.uyeSoyadi || ''} bulundu!`);
      } else {
        toast.error('❌ Üye bulunamadı!');
      }
    } catch (error) {
      console.error('Üye aranırken hata:', error);
      toast.error('❌ Üye bulunamadı!');
    } finally {
      setAraniyor(false);
    }
  };

  // ✅ Pasif yap butonuna tıklandığında onay modalını aç
  const pasifYapTiklandi = (e) => {
    e.preventDefault();
    
    if (!uyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }

    if (!uyeBilgisi) {
      toast.warning('Lütfen önce üyeyi arayın!');
      return;
    }

    if (uyeBilgisi.isActive === false) {
      toast.warning('⚠️ Bu üye zaten pasif durumda!');
      return;
    }

    // ✅ Onay modalını aç
    setOnayModal({
      acik: true,
      uyeAdi: `${uyeBilgisi.uyeAdi} ${uyeBilgisi.uyeSoyadi || ''}`,
      uyeId: uyeId
    });
  };

  // ✅ Pasif yap işlemini onayla
  const pasifYapOnayla = async () => {
    setOnayModal({ acik: false, uyeAdi: '', uyeId: '' });
    setLoading(true);

    try {
      await userService.delete(parseInt(uyeId));
      
      toast.success(`✅ "${uyeBilgisi?.uyeAdi} ${uyeBilgisi?.uyeSoyadi || ''}" üyesi pasif duruma getirildi!`);
      
      setUyeId('');
      setUyeBilgisi(null);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Üye pasifleştirilirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.mesaj || errorData.message) {
          toast.error(`❌ ${errorData.mesaj || errorData.message}`);
        } else {
          toast.error('❌ Üye pasif duruma getirilirken hata oluştu!');
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
    <>
      {/* Ana Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-red-400"><FaTrash /></div>
              <div>
                <h2 className="text-white font-bold text-lg">Üyeyi Pasife Al</h2>
                <p className="text-gray-400 text-xs">Silmek istediğiniz Üye ID'sini girin</p>
              </div>
            </div>
            <button onClick={kapat} className="text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={pasifYapTiklandi} className="space-y-4">
            {/* ID Girişi ve Ara Butonu */}
            <div className="flex gap-2">
              <input
                type="number"
                value={uyeId}
                onChange={(e) => {
                  setUyeId(e.target.value);
                  setUyeBilgisi(null);
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Üye ID girin (Örn: 1)"
                required
                disabled={loading || araniyor}
              />
              <button
                type="button"
                onClick={handleUyeAra}
                disabled={loading || araniyor || !uyeId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {araniyor ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ara...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>

            {/* Üye Bilgisi */}
            {uyeBilgisi && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {uyeBilgisi.uyeAdi} {uyeBilgisi.uyeSoyadi || ''}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Email: {uyeBilgisi.uyeEmail}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Telefon: {uyeBilgisi.uyeTelefon || 'Belirtilmemiş'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    uyeBilgisi.isActive !== false 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {uyeBilgisi.isActive !== false ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </div>
              </div>
            )}

            {/* Zaten pasif olan üye uyarısı */}
            {uyeBilgisi && uyeBilgisi.isActive === false && (
              <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20 flex items-start gap-3">
                <FaInfoCircle className="text-red-400 text-lg mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-medium">Bu üye zaten pasif!</p>
                  <p className="text-gray-400 text-xs">
                    #{uyeId} ID'li üye zaten pasif durumda. Tekrar işlem yapmanıza gerek yok.
                  </p>
                </div>
              </div>
            )}

            {/* Butonlar */}
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
                disabled={loading || !uyeBilgisi || uyeBilgisi?.isActive === false} 
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> İşleniyor...</>
                ) : (
                  'Pasife Al'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ PASİF YAP ONAY MODALI */}
      <PasifYapOnayModal 
        acik={onayModal.acik}
        kapat={() => setOnayModal({ acik: false, uyeAdi: '', uyeId: '' })}
        onConfirm={pasifYapOnayla}
        uyeAdi={onayModal.uyeAdi}
        uyeId={onayModal.uyeId}
      />
    </>
  );
};

export default UyeSil;