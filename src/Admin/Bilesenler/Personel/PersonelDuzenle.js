import React, { useState } from 'react';
import { FaEdit, FaTimes, FaSearch, FaUser, FaSpinner, FaSave, FaCheck, FaTimes as FaClose } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { personnelService } from '../../../api/api';

const PersonelDuzenle = ({ acik, kapat, onSuccess }) => {
  const [personelId, setPersonelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [aramaLoading, setAramaLoading] = useState(false);
  const [arananPersonel, setArananPersonel] = useState(null);
  const [formData, setFormData] = useState({
    adi: '',
    soyadi: '',
    kullaniciAdi: '',
    rolId: '',
    telefon: '',
    cinsiyet: '',
    maas: '',
    isActive: true
  });

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
        const personel = {
          id: data.personelId || data.PersonelId || data.id,
          adi: data.personelAdi || data.PersonelAdi || data.adi || 'Bilinmiyor',
          soyadi: data.personelSoyadi || data.PersonelSoyadi || data.soyadi || '',
          kullaniciAdi: data.kullaniciAdi || data.KullaniciAdi || '-',
          rolId: data.rolId || data.RolId || '',
          rol: data.rolAdi || data.RolAdi || data.rol || 'Bilinmiyor',
          telefon: data.personelTelefon || data.PersonelTelefon || '',
          cinsiyet: data.cinsiyet || data.Cinsiyet || '',
          maas: data.maas || data.Maas || '',
          isActive: data.isActive !== false
        };
        
        setArananPersonel(personel);
        setFormData({
          adi: personel.adi,
          soyadi: personel.soyadi,
          kullaniciAdi: personel.kullaniciAdi,
          rolId: personel.rolId || '',
          telefon: personel.telefon || '',
          cinsiyet: personel.cinsiyet || '',
          maas: personel.maas || '',
          isActive: personel.isActive
        });
        
        if (personel.isActive) {
          toast.success(`${personel.adi} ${personel.soyadi} bulundu! (Aktif)`);
        } else {
          toast.warning(`${personel.adi} ${personel.soyadi} bulundu! (Pasif)`);
        }
      } else {
        toast.error('Personel bulunamadı!');
        setArananPersonel(null);
        resetForm();
      }
    } catch (error) {
      console.error('Personel aranırken hata:', error);
      toast.error('Personel bulunamadı!');
      setArananPersonel(null);
      resetForm();
    } finally {
      setAramaLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      adi: '',
      soyadi: '',
      kullaniciAdi: '',
      rolId: '',
      telefon: '',
      cinsiyet: '',
      maas: '',
      isActive: true
    });
  };

  // Personel güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!arananPersonel) {
      toast.warning('Lütfen önce personel arayın!');
      return;
    }

    if (!formData.adi || !formData.soyadi || !formData.kullaniciAdi) {
      toast.warning('Ad, Soyad ve Kullanıcı Adı zorunludur!');
      return;
    }

    if (!formData.rolId) {
      toast.warning('Lütfen bir rol seçin!');
      return;
    }

    setLoading(true);
    try {
      await personnelService.update(arananPersonel.id, {
        PersonelAdi: formData.adi.trim(),
        PersonelSoyadi: formData.soyadi.trim(),
        KullaniciAdi: formData.kullaniciAdi.trim(),
        RolId: parseInt(formData.rolId),
        PersonelTelefon: formData.telefon || null,
        Cinsiyet: formData.cinsiyet || null,
        Maas: formData.maas ? parseFloat(formData.maas) : null,
        IsActive: formData.isActive // AKTİF/PASİF DURUMU
      });
      
      toast.success(`✅ ${formData.adi} ${formData.soyadi} başarıyla güncellendi!`);
      
      // Formu sıfırla
      setPersonelId('');
      setArananPersonel(null);
      resetForm();
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Personel güncellenirken hata:', error);
      toast.error('❌ Personel güncellenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Form değişiklikleri
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, isActive: status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Personel Düzenle</h2>
              <p className="text-gray-400 text-xs">Personel bilgilerini güncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  resetForm();
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Personel ID girin"
                disabled={loading || aramaLoading}
              />
              <button
                type="button"
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
            <>
              <div className={`rounded-xl p-4 border ${arananPersonel.isActive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
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
                  <span className={`ml-auto px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                    arananPersonel.isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {arananPersonel.isActive ? <FaCheck size={10} /> : <FaClose size={10} />}
                    {arananPersonel.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              {/* Düzenleme Formu */}
              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Ad *</label>
                    <input
                      type="text"
                      name="adi"
                      value={formData.adi}
                      onChange={handleChange}
                      className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                      placeholder="Ad"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Soyad *</label>
                    <input
                      type="text"
                      name="soyadi"
                      value={formData.soyadi}
                      onChange={handleChange}
                      className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                      placeholder="Soyad"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Kullanıcı Adı *</label>
                  <input
                    type="text"
                    name="kullaniciAdi"
                    value={formData.kullaniciAdi}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                    placeholder="Kullanıcı adı"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol *</label>
                  <select
                    name="rolId"
                    value={formData.rolId}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Rol Seçin</option>
                    <option value="1">Admin</option>
                    <option value="2">Garson</option>
                    <option value="3">Aşçı</option>
                    <option value="4">Kurye</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">1:Admin | 2:Garson | 3:Aşçı | 4:Kurye</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefon</label>
                  <input
                    type="text"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                    placeholder="05XX XXX XX XX"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Cinsiyet</label>
                  <select
                    name="cinsiyet"
                    value={formData.cinsiyet}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    disabled={loading}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Maaş</label>
                  <input
                    type="number"
                    step="0.01"
                    name="maas"
                    value={formData.maas}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                    placeholder="15000"
                    disabled={loading}
                  />
                </div>

                {/* AKTİF / PASİF DURUM DEĞİŞTİRME */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Personel Durumu</label>
                  
                  {arananPersonel && !arananPersonel.isActive ? (
                    // SADECE PASİF İSE AKTİF YAPMA BUTONU GÖSTER
                    <button
                      type="button"
                      onClick={() => handleStatusChange(true)}
                      className="w-full px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaCheck size={16} /> Bu Personeli Aktif Yap
                    </button>
                  ) : arananPersonel && arananPersonel.isActive ? (
                    // AKTİF İSE SADECE BİLGİ GÖSTER DEĞİŞTİRİLEMEZ
                    <div className="w-full px-4 py-2.5 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center justify-center gap-2">
                      <FaCheck size={16} /> Bu personel aktif durumda
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}

          {/* Güncelle Butonu */}
          <button
            type="submit"
            disabled={loading || !arananPersonel}
            className={`w-full py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading || !arananPersonel
                ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
            }`}
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Güncelleniyor...</>
            ) : (
              <><FaSave /> Personeli Güncelle</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonelDuzenle;