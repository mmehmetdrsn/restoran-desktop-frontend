// src/Admin/components/Personel/PersonelSil.js
import React, { useState } from 'react';
import { FaTrash, FaTimes, FaSearch, FaUser, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { personnelService } from '../../../api/api';

const PersonelSil = ({ acik, kapat, onSuccess }) => {
  const [personelId, setPersonelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [arananPersonel, setArananPersonel] = useState(null);
  const [aramaLoading, setAramaLoading] = useState(false);

  if (!acik) return null;

  // Personel ara
  const handlePersonelAra = async () => {
    if (!personelId) {
      toast.warning('Lütfen personel ID girin!');
      return;
    }

    setAramaLoading(true);
    try {
      const response = await personnelService.getById(parseInt(personelId));
      const data = response.data;
      
      if (data) {
        setArananPersonel({
          id: data.personelId || data.PersonelId || data.id,
          adi: data.personelAdi || data.PersonelAdi || data.adi || 'Bilinmiyor',
          soyadi: data.personelSoyadi || data.PersonelSoyadi || data.soyadi || '',
          kullaniciAdi: data.kullaniciAdi || data.KullaniciAdi || '-',
          rol: data.rolAdi || data.RolAdi || data.rol || 'Bilinmiyor',
          telefon: data.personelTelefon || data.PersonelTelefon || '-',
          durum: data.isActive !== false ? 'Aktif' : 'Pasif'
        });
        toast.success(`✅ Personel bulundu!`);
      } else {
        toast.error('❌ Personel bulunamadı!');
        setArananPersonel(null);
      }
    } catch (error) {
      console.error('Personel aranırken hata:', error);
      toast.error('❌ Personel bulunamadı!');
      setArananPersonel(null);
    } finally {
      setAramaLoading(false);
    }
  };

  // Personeli pasife al (sil)
  const handlePersoneliPasifeAl = async () => {
    if (!arananPersonel) {
      toast.warning('Lütfen önce personel arayın!');
      return;
    }

    if (!window.confirm(
      `${arananPersonel.adi} ${arananPersonel.soyadi} personelini pasif yapmak istediğinize emin misiniz?\n\nBu işlem geri alınabilir.`
    )) return;

    setLoading(true);
    try {
      // 🔥 Personeli pasife al (isActive = false)
      await personnelService.update(arananPersonel.id, {
        isActive: false
      });
      
      toast.success(`✅ ${arananPersonel.adi} ${arananPersonel.soyadi} pasif duruma alındı!`);
      setPersonelId('');
      setArananPersonel(null);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Personel pasifleştirilirken hata:', error);
      toast.error('❌ Personel pasif duruma alınırken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-red-400"><FaTrash /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Personel Pasife Al</h2>
              <p className="text-gray-400 text-xs">Silmek istediğiniz Personel ID'sini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Personel ID Ara */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Personel ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={personelId}
                onChange={(e) => {
                  setPersonelId(e.target.value);
                  setArananPersonel(null);
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Personel ID girin"
                disabled={loading || aramaLoading}
              />
              <button
                onClick={handlePersonelAra}
                disabled={loading || aramaLoading || !personelId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {aramaLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              </button>
            </div>
          </div>

          {/* Personel Bilgileri */}
          {arananPersonel && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                  <FaUser />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {arananPersonel.adi} {arananPersonel.soyadi}
                  </p>
                  <p className="text-gray-400 text-sm">@{arananPersonel.kullaniciAdi}</p>
                </div>
                <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                  arananPersonel.durum === 'Aktif' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {arananPersonel.durum}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Rol:</span>
                  <span className="text-white ml-2">{arananPersonel.rol}</span>
                </div>
                <div>
                  <span className="text-gray-400">Telefon:</span>
                  <span className="text-white ml-2">{arananPersonel.telefon}</span>
                </div>
              </div>

              {arananPersonel.durum === 'Pasif' && (
                <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/20">
                  <p className="text-yellow-400 text-xs text-center">
                    ⚠️ Bu personel zaten pasif durumda!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pasife Al Butonu */}
          <button
            onClick={handlePersoneliPasifeAl}
            disabled={loading || !arananPersonel || arananPersonel.durum === 'Pasif'}
            className={`w-full py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading || !arananPersonel || arananPersonel.durum === 'Pasif'
                ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> İşleniyor...</>
            ) : (
              <><FaCheck /> Pasife Al</>
            )}
          </button>
          
          {arananPersonel && arananPersonel.durum === 'Pasif' && (
            <p className="text-yellow-400 text-xs text-center">
              Bu personel zaten pasif durumda. Aktif etmek için personel düzenle sayfasını kullanın.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonelSil;