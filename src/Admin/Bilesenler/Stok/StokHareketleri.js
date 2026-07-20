// src/Admin/components/Stok/StokHareketleri.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowUp, FaArrowDown, FaFire, FaSearch, FaSync, FaUser, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const StokHareketleri = ({ acik, kapat }) => {
  const [hareketler, setHareketler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtre, setFiltre] = useState('');

  // Modal açıldığında otomatik verileri getir
  useEffect(() => {
    if (acik) {
      console.log('🔍 StokHareketleri modal açıldı, veriler getiriliyor...');
      handleGetir();
    }
  }, [acik]);

  if (!acik) return null;

  const getIslemTipiIcon = (tip) => {
    const t = (tip || '').toUpperCase();
    if (t === 'GIRIS') return <FaArrowUp className="text-green-400" />;
    if (t === 'CIKIS') return <FaArrowDown className="text-red-400" />;
    if (t === 'FIRE') return <FaFire className="text-orange-400" />;
    return null;
  };

  const getIslemTipiRenk = (tip) => {
    const t = (tip || '').toUpperCase();
    if (t === 'GIRIS') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (t === 'CIKIS') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (t === 'FIRE') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-gray-500/20 text-gray-400';
  };

  const getIslemTipiText = (tip) => {
    const t = (tip || '').toUpperCase();
    if (t === 'GIRIS') return 'Stok Girişi';
    if (t === 'CIKIS') return 'Stok Çıkışı';
    if (t === 'FIRE') return 'Fire';
    return tip;
  };

  const formatTarih = (tarih) => {
    if (!tarih) return '-';
    const date = new Date(tarih);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGetir = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token);
      
      const response = await axios.get(`${API_URL}/StokHareketleri`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('📊 Gelen stok hareketleri:', response.data);
      setHareketler(response.data || []);
      
      if (response.data?.length > 0) {
        toast.info(`📋 ${response.data.length} stok hareketi bulundu`);
      } else {
        toast.info('📋 Henüz stok hareketi yok');
      }
    } catch (error) {
      console.error('❌ Stok hareketleri yüklenirken hata:', error);
      if (error.response) {
        console.error('Backend hatası:', error.response.data);
        toast.error(`❌ ${error.response.data?.title || 'Stok hareketleri yüklenirken hata oluştu!'}`);
      } else if (error.request) {
        toast.error('❌ Sunucuya bağlanılamıyor!');
      } else {
        toast.error('❌ Stok hareketleri yüklenirken hata oluştu!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const filteredHareketler = filtre
    ? hareketler.filter(h => h.stokIslemTipi?.toUpperCase() === filtre)
    : hareketler;

  // Özet bilgiler
  const toplamGiris = filteredHareketler
    .filter(h => h.stokIslemTipi?.toUpperCase() === 'GIRIS')
    .reduce((sum, h) => sum + (h.stokMiktari || 0), 0);

  const toplamCikis = filteredHareketler
    .filter(h => h.stokIslemTipi?.toUpperCase() === 'CIKIS')
    .reduce((sum, h) => sum + (h.stokMiktari || 0), 0);

  const toplamFire = filteredHareketler
    .filter(h => h.stokIslemTipi?.toUpperCase() === 'FIRE')
    .reduce((sum, h) => sum + (h.stokMiktari || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📊 Stok Hareketleri</h2>
            <p className="text-gray-400 text-xs">
              Toplam {filteredHareketler.length} hareket 
              {hareketler.length !== filteredHareketler.length && ` (Filtrelenmiş: ${filteredHareketler.length})`}
            </p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Özet Kartları */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
              <p className="text-green-400 text-xs">📥 Toplam Giriş</p>
              <p className="text-white text-xl font-bold">{toplamGiris}</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20">
              <p className="text-red-400 text-xs">📤 Toplam Çıkış</p>
              <p className="text-white text-xl font-bold">{toplamCikis}</p>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-3 text-center border border-orange-500/20">
              <p className="text-orange-400 text-xs">🔥 Toplam Fire</p>
              <p className="text-white text-xl font-bold">{toplamFire}</p>
            </div>
          </div>
        </div>

        {/* Filtre */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-3">
            <select
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
            >
              <option value="">Tümü</option>
              <option value="GIRIS">📥 Giriş</option>
              <option value="CIKIS">📤 Çıkış</option>
              <option value="FIRE">🔥 Fire</option>
            </select>
            <button
              onClick={handleGetir}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Yükleniyor...</>
              ) : (
                <><FaSync /> Yenile</>
              )}
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-gray-400 border-t-white rounded-full"></div>
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : filteredHareketler.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaBox className="text-5xl mx-auto mb-4 text-gray-600" />
              <p>Henüz stok hareketi yok</p>
              <p className="text-xs text-gray-500 mt-1">Yeni stok girişi, çıkışı veya fire kaydı ekleyin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHareketler.map((h, index) => (
                <div key={index} className={`bg-white/5 rounded-xl p-4 border ${getIslemTipiRenk(h.stokIslemTipi)} hover:bg-white/10 transition-colors`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIslemTipiRenk(h.stokIslemTipi)}`}>
                        {getIslemTipiIcon(h.stokIslemTipi)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">#{h.stokHareketId}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getIslemTipiRenk(h.stokIslemTipi)}`}>
                            {getIslemTipiText(h.stokIslemTipi)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <FaBox size={12} /> {h.urunAdi || 'Ürün bilinmiyor'}
                          {h.personelIsim && (
                            <span className="flex items-center gap-1">
                              <FaUser size={10} /> {h.personelIsim}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        h.stokIslemTipi?.toUpperCase() === 'GIRIS' ? 'text-green-400' :
                        h.stokIslemTipi?.toUpperCase() === 'CIKIS' ? 'text-red-400' :
                        'text-orange-400'
                      }`}>
                        {h.stokIslemTipi?.toUpperCase() === 'GIRIS' ? '+' : '-'}{h.stokMiktari}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatTarih(h.isleminTarihSaati)}
                      </p>
                    </div>
                  </div>
                  {h.isleminAciklamasi && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-gray-400 text-sm">
                      📝 {h.isleminAciklamasi}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alt Bilgi */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-gray-400 text-xs">
            Toplam: {filteredHareketler.length} hareket
            {filtre && ` (Filtre: ${filtre})`}
          </span>
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default StokHareketleri;