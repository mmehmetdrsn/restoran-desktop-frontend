import React, { useState, useEffect } from 'react';
import { FaTrash, FaTimes, FaSearch, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoryService, productService } from '../../../api/api';

const KategoriSil = ({ acik, kapat, onSuccess }) => {
  const [kategoriId, setKategoriId] = useState('');
  const [kategoriBilgisi, setKategoriBilgisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [urunSayisi, setUrunSayisi] = useState(0);
  const [silinebilirMi, setSilinebilirMi] = useState(true);

  useEffect(() => {
    if (!acik) {
      setKategoriId('');
      setKategoriBilgisi(null);
      setUrunSayisi(0);
      setSilinebilirMi(true);
    }
  }, [acik]);

  if (!acik) return null;

  const handleKategoriAra = async () => {
    if (!kategoriId) {
      toast.warning('Lutfen kategori ID girin!');
      return;
    }

    setAraniyor(true);
    setKategoriBilgisi(null);
    setUrunSayisi(0);
    setSilinebilirMi(true);

    try {
      const response = await categoryService.getById(parseInt(kategoriId));
      const data = response.data || response;
      
      console.log('📋 Gelen kategori verisi:', data);
      
      if (data && (data.kategoriId || data.id)) {
        const kategoriAdi = data.kategoriAdi || data.name || data.KategoriAdi || 'Bilinmiyor';
        const kategoriIdValue = data.kategoriId || data.id || data.KategoriId;
        
        setKategoriBilgisi({
          id: kategoriIdValue,
          adi: kategoriAdi
        });
        
        try {
          const urunResponse = await productService.getAll();
          const tumUrunler = urunResponse.data || [];
          
          const kategoriUrunleri = tumUrunler.filter(urun => {
            const urunKategoriAdi = urun.kategoriAdi || urun.KategoriAdi || urun.kategori || urun.Kategori;
            return urunKategoriAdi && 
                   String(urunKategoriAdi).toLowerCase().trim() === String(kategoriAdi).toLowerCase().trim();
          });
          
          const urunSayisi = kategoriUrunleri.length;
          setUrunSayisi(urunSayisi);
          
          if (urunSayisi > 0) {
            setSilinebilirMi(false);
            toast.warning(`Bu kategoride ${urunSayisi} ürün bulunuyor. Önce ürünleri taşıyın veya pasif yapın!`);
          } else {
            setSilinebilirMi(true);
            toast.success(`Kategori "${kategoriAdi}" bulundu! (Ürün yok, silinebilir)`);
          }
          
        } catch (urunError) {
          console.error('Ürünler yüklenirken hata:', urunError);
          setUrunSayisi(0);
          setSilinebilirMi(true);
        }
        
      } else {
        toast.error('Kategori bulunamadi!');
        setKategoriBilgisi(null);
      }
    } catch (error) {
      console.error('Kategori aranirken hata:', error);
      if (error.response && error.response.status === 404) {
        toast.error('Kategori bulunamadi!');
      } else {
        toast.error('Kategori aranirken hata olustu!');
      }
      setKategoriBilgisi(null);
    } finally {
      setAraniyor(false);
    }
  };

  const handleSil = async (e) => {
    e.preventDefault();
    
    if (!kategoriId) {
      toast.warning('Lutfen kategori ID girin!');
      return;
    }

    if (!kategoriBilgisi) {
      toast.warning('Lutfen once kategoriyi arayin!');
      return;
    }
    if (!silinebilirMi) {
      toast.error(
        `❌ Bu kategoride ${urunSayisi} ürün bulunduğu için silinemez!\n\n` +
        `Önce kategorideki ürünleri başka bir kategoriye taşıyın veya pasif yapın.`
      );
      return;
    }

    if (!window.confirm(`"${kategoriBilgisi.adi}" kategorisini silmek istediginize emin misiniz?`)) {
      return;
    }

    setLoading(true);
    try {
      await categoryService.delete(parseInt(kategoriId));
      toast.success(`Kategori "${kategoriBilgisi.adi}" basariyla silindi!`);
      
      setKategoriId('');
      setKategoriBilgisi(null);
      setUrunSayisi(0);
      kapat();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(`Hata: ${errorData.message}`);
        } else {
          toast.error('Kategori silinirken bir hata olustu!');
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
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-red-400"><FaTrash /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Kategori Sil</h2>
              <p className="text-gray-400 text-xs">Silmek istediginiz kategori ID'sini girin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSil} className="space-y-4">
          {/* ID Girişi ve Ara Butonu */}
          <div className="flex gap-2">
            <input
              type="number"
              value={kategoriId}
              onChange={(e) => {
                setKategoriId(e.target.value);
                setKategoriBilgisi(null);
                setUrunSayisi(0);
                setSilinebilirMi(true);
              }}
              className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
              placeholder="Kategori ID girin (Orn: 1)"
              required
              disabled={loading || araniyor}
            />
            <button
              type="button"
              onClick={handleKategoriAra}
              disabled={loading || araniyor || !kategoriId}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {araniyor ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ara...</>
              ) : (
                <><FaSearch /> Ara</>
              )}
            </button>
          </div>

          {/* Kategori Bilgisi */}
          {kategoriBilgisi && (
            <div className={`rounded-xl p-4 border ${
              silinebilirMi 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{kategoriBilgisi.adi}</p>
                  <p className="text-gray-400 text-sm">
                    ID: #{kategoriBilgisi.id}
                  </p>
                  <p className={`text-sm font-medium ${
                    urunSayisi > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {urunSayisi > 0 
                      ? `${urunSayisi} ürün bulunuyor (Silinemez!)` 
                      : 'Bu kategoride ürün yok (Silinebilir)'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  silinebilirMi 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {silinebilirMi ? 'Silinebilir' : 'Silinemez'}
                </span>
              </div>
            </div>
          )}

          {/* Uyarı - Ürün varsa */}
          {kategoriBilgisi && urunSayisi > 0 && (
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-400 text-xl mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">
                    Bu kategoride {urunSayisi} ürün bulunuyor!
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    Kategoriyi silmek için önce:
                  </p>
                  <ul className="text-gray-400 text-sm list-disc list-inside mt-1 space-y-1">
                    <li>Kategorideki ürünleri başka bir kategoriye taşıyın</li>
                    <li>Veya ürünleri pasif yapın</li>
                  </ul>
                  <p className="text-yellow-400 text-xs mt-2">
                    Bu işlemler tamamlanmadan kategori silinemez!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bilgi - Ürün yoksa */}
          {kategoriBilgisi && urunSayisi === 0 && (
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 flex items-start gap-3">
              <FaInfoCircle className="text-green-400 text-lg mt-0.5" />
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Bu kategoride ürün bulunmuyor.
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
              Iptal
            </button>
            <button 
              type="submit" 
              disabled={loading || !kategoriBilgisi || !silinebilirMi} 
              className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                silinebilirMi && kategoriBilgisi
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
              title={!silinebilirMi ? 'Kategoride ürün olduğu için silinemez' : ''}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Siliniyor...</>
              ) : (
                !silinebilirMi ? 'Silinemez' : 'Sil'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KategoriSil;