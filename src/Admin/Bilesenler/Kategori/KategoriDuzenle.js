import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoryService } from '../../../api/api';

const KategoriDuzenle = ({ acik, kapat, onSuccess }) => {
  const [kategoriId, setKategoriId] = useState('');
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [kategoriBulundu, setKategoriBulundu] = useState(false);
  const [kategoriBilgisi, setKategoriBilgisi] = useState(null);
  
  const [formData, setFormData] = useState({
    kategoriAdi: ''
  });

  useEffect(() => {
    if (!acik) {
      setKategoriId('');
      setFormData({ kategoriAdi: '' });
      setKategoriBulundu(false);
      setKategoriBilgisi(null);
    }
  }, [acik]);

  if (!acik) return null;

  const handleKategoriAra = async (e) => {
    e.preventDefault();
    if (!kategoriId) {
      toast.warning('Lutfen kategori ID girin!');
      return;
    }

    setAraniyor(true);
    setKategoriBulundu(false);
    setKategoriBilgisi(null);

    try {
      const response = await categoryService.getById(parseInt(kategoriId));
      const data = response.data || response;
      
      console.log('Gelen kategori verisi:', data);
      
      if (data && (data.kategoriId || data.id)) {
        const kategoriAdi = data.kategoriAdi || data.name || data.KategoriAdi || 'Bilinmiyor';
        const kategoriIdValue = data.kategoriId || data.id || data.KategoriId;
        
        setKategoriBilgisi({
          id: kategoriIdValue,
          adi: kategoriAdi
        });
        
        setFormData({
          kategoriAdi: kategoriAdi || ''
        });
        
        setKategoriBulundu(true);
        toast.success(`Kategori "${kategoriAdi}" bulundu!`);
      } else {
        toast.error('Kategori bulunamadi!');
        setKategoriBulundu(false);
      }
    } catch (error) {
      console.error('Kategori aranirken hata:', error);
      if (error.response && error.response.status === 404) {
        toast.error('Kategori bulunamadi!');
      } else {
        toast.error('Kategori aranirken hata olustu!');
      }
      setKategoriBulundu(false);
    } finally {
      setAraniyor(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!kategoriId) {
      toast.warning('Lutfen kategori ID girin!');
      return;
    }

    if (!formData.kategoriAdi || formData.kategoriAdi.trim() === '') {
      toast.warning('Lutfen yeni kategori adini girin!');
      return;
    }

    if (formData.kategoriAdi.trim() === kategoriBilgisi?.adi) {
      toast.info('Kategori adi zaten ayni, degisiklik yapilmadi.');
      return;
    }

    setLoading(true);
    try {
      await categoryService.update(parseInt(kategoriId), {
        kategoriAdi: formData.kategoriAdi.trim()
      });
      
      toast.success(`Kategori "${formData.kategoriAdi}" basariyla guncellendi!`);
      setKategoriId('');
      setFormData({ kategoriAdi: '' });
      setKategoriBulundu(false);
      setKategoriBilgisi(null);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Kategori guncellenirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(`Hata: ${errorData.message}`);
        } else {
          toast.error('Kategori guncellenirken bir hata olustu!');
        }
      } else if (error.request) {
        toast.error('Sunucuya baglanilamiyor!');
      } else {
        toast.error('Bir hata olustu: ' + error.message);
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
            <div className="text-2xl text-yellow-400"><FaEdit /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Kategori Duzenle</h2>
              <p className="text-gray-400 text-xs">Kategori bilgilerini guncelleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID ARAMA ALANI */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex gap-2">
              <input
                type="number"
                value={kategoriId}
                onChange={(e) => {
                  setKategoriId(e.target.value);
                  setKategoriBulundu(false);
                  setKategoriBilgisi(null);
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Kategori ID girin (Orn: 1)"
                required
                disabled={araniyor || loading}
              />
              <button
                type="button"
                onClick={handleKategoriAra}
                disabled={araniyor || loading || !kategoriId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {araniyor ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Araniyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </div>
            {kategoriBulundu && kategoriBilgisi && (
              <div className="mt-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                      <FaEdit className="text-green-400" /> Kategori bulundu!
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Mevcut Ad: <span className="text-white font-medium">{kategoriBilgisi.adi}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      ID: #{kategoriBilgisi.id}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                    Bulundu
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* KATEGORI BILGILERI */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> Kategori Bilgileri
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Yeni Kategori Adi <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kategoriAdi}
                  onChange={(e) => setFormData({...formData, kategoriAdi: e.target.value})}
                  className={`w-full py-2.5 px-3 bg-white/5 border rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none ${
                    kategoriBulundu ? 'border-white/10' : 'border-white/5'
                  }`}
                  placeholder="Yeni kategori adini girin"
                  required
                  disabled={!kategoriBulundu || loading}
                />
                {kategoriBulundu && kategoriBilgisi && (
                  <p className="text-gray-500 text-xs mt-1">
                    Mevcut ad: <span className="text-gray-400">{kategoriBilgisi.adi}</span>
                    {formData.kategoriAdi.trim() === kategoriBilgisi.adi && (
                      <span className="text-yellow-400 ml-2">(Ayni ad, degisiklik yok)</span>
                    )}
                  </p>
                )}
              </div>

              {kategoriBulundu && kategoriBilgisi && (
                <div className="bg-yellow-500/5 rounded-lg p-2 border border-yellow-500/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaInfoCircle className="text-yellow-400" />
                    ID: #{kategoriBilgisi.id} - Mevcut ad: {kategoriBilgisi.adi}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BULUNAN KATEGORI BILGISI */}
          {kategoriBulundu && kategoriBilgisi && (
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 flex items-center gap-3">
              <FaEdit className="text-green-400 text-lg" />
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Kategori #{kategoriBilgisi.id} duzenleniyor
                </p>
                <p className="text-gray-400 text-xs">
                  Eski ad: <span className="text-white">{kategoriBilgisi.adi}</span>
                  {formData.kategoriAdi && formData.kategoriAdi !== kategoriBilgisi.adi && (
                    <> → Yeni ad: <span className="text-yellow-400">{formData.kategoriAdi}</span></>
                  )}
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
              Iptal
            </button>
            <button 
              type="submit" 
              disabled={!kategoriBulundu || loading || !formData.kategoriAdi.trim()} 
              className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                kategoriBulundu && formData.kategoriAdi.trim()
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Guncelleniyor...</>
              ) : (
                'Guncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KategoriDuzenle;