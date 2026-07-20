// src/Admin/components/Kategori/KategoriListele.js
import React, { useState } from 'react';
import { FaTimes, FaTrash, FaChevronDown, FaChevronRight, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoryService, productService } from '../../../api/api';

const KategoriListele = ({ acik, kapat, kategoriler, onKategoriSil }) => {
  const [genisletilmisKategoriler, setGenisletilmisKategoriler] = useState({});
  const [kategoriUrunleri, setKategoriUrunleri] = useState({});
  const [yukleniyor, setYukleniyor] = useState({});

  if (!acik) return null;

  // Kategoriye ait ürünleri getir
  const kategoriUrunleriniGetir = async (kategoriId) => {
    if (kategoriUrunleri[kategoriId]) {
      // Zaten yüklendi, sadece aç/kapa
      setGenisletilmisKategoriler(prev => ({
        ...prev,
        [kategoriId]: !prev[kategoriId]
      }));
      return;
    }

    try {
      setYukleniyor(prev => ({ ...prev, [kategoriId]: true }));
      
      // Tüm ürünleri getir
      const response = await productService.getAll();
      const tumUrunler = response.data || [];
      
      console.log('📦 Tüm ürünler:', tumUrunler);
      console.log('🔍 Aranan kategori ID:', kategoriId);
      
      // Backend'deki alan adlarına göre filtreleme yap
      const kategoriUrunleri = tumUrunler.filter(urun => {
        // Farklı alan adlarını kontrol et
        const urunKategoriId = urun.kategoriId || urun.kategoriID || urun.KategoriId || urun.kategori_id;
        const urunKategori = urun.kategori || urun.Kategori || urun.kategoriAdi;
        
        // ID ile eşleşme kontrolü
        if (urunKategoriId && Number(urunKategoriId) === Number(kategoriId)) {
          return true;
        }
        // İsim ile eşleşme kontrolü (kategori adıyla)
        if (urunKategori) {
          const kategori = kategoriler.find(k => (k.kategoriId || k.id) === kategoriId);
          const kategoriAdi = kategori?.kategoriAdi || kategori?.name || '';
          if (urunKategori.toLowerCase() === kategoriAdi.toLowerCase()) {
            return true;
          }
        }
        return false;
      });
      
      console.log(`✅ Kategori ${kategoriId} için ${kategoriUrunleri.length} ürün bulundu:`, kategoriUrunleri);
      
      setKategoriUrunleri(prev => ({
        ...prev,
        [kategoriId]: kategoriUrunleri
      }));
      
      setGenisletilmisKategoriler(prev => ({
        ...prev,
        [kategoriId]: true
      }));
      
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast.error('❌ Ürünler yüklenirken hata oluştu!');
    } finally {
      setYukleniyor(prev => ({ ...prev, [kategoriId]: false }));
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await categoryService.delete(id);
      toast.success('✅ Kategori silindi.');
      if (onKategoriSil) onKategoriSil();
    } catch (err) {
      toast.error('Kategori silinirken hata oluştu!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Kategori Listesi</h2>
            <p className="text-gray-400 text-xs">Toplam {kategoriler.length} kategori</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {kategoriler.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz kategori eklenmemiş</p>
          ) : (
            <div className="space-y-3">
              {kategoriler.map((kategori) => {
                const kategoriId = kategori.kategoriId || kategori.id || kategori.KategoriId;
                const kategoriAdi = kategori.kategoriAdi || kategori.name || kategori.KategoriAdi || 'Bilinmiyor';
                const acikMi = genisletilmisKategoriler[kategoriId];
                const urunler = kategoriUrunleri[kategoriId] || [];
                const yukleniyorMu = yukleniyor[kategoriId];
                
                console.log(`📂 Kategori: ${kategoriAdi} (ID: ${kategoriId}) - ${urunler.length} ürün`);
                
                return (
                  <div key={kategoriId} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    {/* Kategori Başlığı */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => kategoriUrunleriniGetir(kategoriId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-500 text-lg">
                          {acikMi ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                        <span className="text-white font-medium">{kategoriAdi}</span>
                        <span className="text-gray-400 text-xs bg-white/10 px-2 py-0.5 rounded">
                          #{kategoriId}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs">
                          {urunler.length > 0 && `${urunler.length} ürün`}
                          {yukleniyorMu && '...'}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSil(kategoriId);
                          }} 
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {/* Kategori Altındaki Ürünler */}
                    {acikMi && (
                      <div className="border-t border-white/5 p-3 space-y-2 bg-white/5">
                        {yukleniyorMu ? (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full mr-2"></div>
                            Ürünler yükleniyor...
                          </div>
                        ) : urunler.length === 0 ? (
                          <p className="text-center py-4 text-gray-500 text-sm">
                            <FaUtensils className="inline mr-2" />
                            Bu kategoride henüz ürün yok
                          </p>
                        ) : (
                          urunler.map((urun, index) => {
                            const urunAdi = urun.urunAdi || urun.name || urun.UrunAdi || 'Bilinmiyor';
                            const urunFiyat = urun.fiyat || urun.price || urun.Fiyat || 0;
                            const urunId = urun.urunId || urun.id || urun.UrunId;
                            
                            return (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-500 text-xs">{index + 1}.</span>
                                  <span className="text-white text-sm">{urunAdi}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-yellow-400 text-sm font-medium">
                                    ₺{urunFiyat}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    #{urunId}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between">
          <span className="text-gray-400 text-xs">Toplam: {kategoriler.length} kategori</span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KategoriListele;