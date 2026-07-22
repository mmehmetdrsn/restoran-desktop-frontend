// src/Admin/Bilesenler/Siparis/SiparisDetay.js
import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaShoppingCart, FaUser, FaTable, FaMoneyBillWave, 
  FaCalendarAlt, FaClipboardList, FaBox, FaInfoCircle,
  FaCheckCircle, FaClock, FaUtensils,FaExchangeAlt, FaReceipt, FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { orderService } from '../../../api/api';

const SiparisDetay = ({ acik, kapat }) => {
  const [siparisId, setSiparisId] = useState('');
  const [siparis, setSiparis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [araniyor, setAraniyor] = useState(false);
  const [siparisBulundu, setSiparisBulundu] = useState(false);

  if (!acik) return null;

  const handleAra = async (e) => {
    e.preventDefault();
    if (!siparisId) {
      toast.warning('Lütfen sipariş ID girin!');
      return;
    }

    setLoading(true);
    setAraniyor(true);
    setSiparis(null);
    setSiparisBulundu(false);

    try {
      const response = await orderService.getById(parseInt(siparisId));
      const data = response.data;
      
      console.log('📋 Gelen sipariş detayı:', data);
      
      if (data && data.siparisId) {
        setSiparis(data);
        setSiparisBulundu(true);
        toast.success('✅ Sipariş bulundu!');
      } else {
        toast.error('❌ Sipariş bulunamadı!');
        setSiparisBulundu(false);
      }
    } catch (error) {
      console.error('Sipariş detay alınırken hata:', error);
      toast.error('❌ Sipariş bulunamadı!');
      setSiparisBulundu(false);
    } finally {
      setLoading(false);
      setAraniyor(false);
    }
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

  const getDurumRenk = (durum) => {
    const d = (durum || '').toUpperCase();
    if (d === 'TAMAMLANDI') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (d === 'ODENDI') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (d === 'BEKLEMEDE') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (d === 'HAZIRLANIYOR') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (d === 'HAZIR') return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    if (d === 'TESLIM EDILDI') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    if (d === 'IPTAL') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (d == 'IADE') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getDurumIcon = (durum) => {
    const d = (durum || '').toUpperCase();
    if (d === 'TAMAMLANDI') return <FaCheckCircle className="text-green-400" />;
    if (d === 'ODENDI') return <FaMoneyBillWave className="text-purple-400" />;
    if (d === 'BEKLEMEDE') return <FaClock className="text-yellow-400" />;
    if (d === 'HAZIRLANIYOR') return <FaUtensils className="text-blue-400" />;
    if (d === 'HAZIR') return <FaCheckCircle className="text-cyan-400" />;
    if (d === 'TESLIM EDILDI') return <FaBox className="text-indigo-400" />;
    if (d === 'IPTAL') return <FaTimes className="text-red-400" />;
    if (d === 'IADE') return <FaExchangeAlt className="text-orange-400" />;
    return <FaInfoCircle className="text-gray-400" />;
  };

  // Toplam ürün sayısını hesapla
  const toplamUrun = siparis?.detaylar?.reduce((sum, d) => sum + (d.adet || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">📋 Sipariş Detay</h2>
            <p className="text-gray-400 text-xs">Sipariş bilgilerini görüntüleyin</p>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Arama Formu */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
            <form onSubmit={handleAra} className="flex gap-3">
              <input
                type="number"
                value={siparisId}
                onChange={(e) => {
                  setSiparisId(e.target.value);
                  setSiparis(null);
                  setSiparisBulundu(false);  // ✅ YENİ
                }}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Sipariş ID girin (Örn: 1)"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !siparisId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {araniyor ? (  // ✅ YENİ
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Aranıyor...</>
                ) : (
                  <><FaSearch /> Ara</>
                )}
              </button>
            </form>
            {/* ✅ Başarılı arama mesajı - YENİ */}
            {siparisBulundu && (
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <FaCheckCircle className="text-green-400" /> Sipariş bulundu! Detaylar aşağıda.
              </p>
            )}
          </div>

          {siparis ? (
            <div className="space-y-4">
              {/* Sipariş Başlığı - Kart */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-2xl">
                      <FaShoppingCart />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">
                        Sipariş #{siparis.siparisId}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getDurumRenk(siparis.siparisDurumu)}`}>
                          {getDurumIcon(siparis.siparisDurumu)}
                          {siparis.siparisDurumu || 'Bilinmiyor'}
                        </span>
                        <span className="text-gray-400 text-xs bg-white/5 px-2 py-0.5 rounded">
                          {siparis.siparisTipi || 'SALON'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Toplam Tutar</p>
                    <p className="text-yellow-400 font-bold text-2xl">
                      ₺{siparis.toplamTutar?.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sipariş Bilgileri - Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaTable size={12} /> Masa
                  </p>
                  <p className="text-white font-medium mt-1">
                    {siparis.masaNo || 'Paket / Gel-Al'}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaUser size={12} /> Müşteri
                  </p>
                  <p className="text-white font-medium mt-1">
                    {siparis.uyeAdi || 'Ziyaretçi'}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaCalendarAlt size={12} /> Tarih
                  </p>
                  <p className="text-white font-medium mt-1 text-sm">
                    {formatTarih(siparis.siparisTarihi)}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaReceipt size={12} /> Ürün
                  </p>
                  <p className="text-white font-medium mt-1">
                    {siparis.detaylar?.length || 0} ürün ({toplamUrun} adet)
                  </p>
                </div>
              </div>

              {/* Ürün Detayları */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5">
                  <FaClipboardList className="text-yellow-400" />
                  <h4 className="text-white font-medium">Sipariş Ürünleri</h4>
                  <span className="text-gray-400 text-xs bg-white/10 px-2 py-0.5 rounded ml-auto">
                    {siparis.detaylar?.length || 0} ürün
                  </span>
                </div>
                
                {siparis.detaylar && siparis.detaylar.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {/* Tablo Başlığı */}
                    <div className="grid grid-cols-12 gap-2 text-gray-500 text-xs px-2 py-1 border-b border-white/5">
                      <span className="col-span-1">#</span>
                      <span className="col-span-5">Ürün Adı</span>
                      <span className="col-span-2 text-center">Adet</span>
                      <span className="col-span-2 text-right">Birim Fiyat</span>
                      <span className="col-span-2 text-right">Toplam</span>
                    </div>
                    
                    {siparis.detaylar.map((detay, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="col-span-1 text-gray-500 text-xs">{index + 1}</span>
                        <div className="col-span-5">
                          <p className="text-white text-sm font-medium">{detay.urunAdi || 'Bilinmiyor'}</p>
                          {detay.detayNot && (
                            <p className="text-gray-400 text-xs flex items-center gap-1">
                              <FaInfoCircle size={10} /> {detay.detayNot}
                            </p>
                          )}
                        </div>
                        <span className="col-span-2 text-center text-white text-sm">{detay.adet || 1}</span>
                        <span className="col-span-2 text-right text-gray-300 text-sm">₺{detay.birimFiyat?.toFixed(2) || 0}</span>
                        <span className="col-span-2 text-right text-yellow-400 font-medium text-sm">
                          ₺{detay.satirToplami?.toFixed(2) || 0}
                        </span>
                      </div>
                    ))}
                    
                    {/* Toplam Satırı */}
                    <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 flex items-center justify-between mt-2">
                      <span className="text-white font-bold flex items-center gap-2">
                        <FaMoneyBillWave className="text-yellow-400" />
                        GENEL TOPLAM
                      </span>
                      <span className="text-yellow-400 font-bold text-xl">
                        ₺{siparis.toplamTutar?.toFixed(2) || 0}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Bu siparişe ait ürün bulunmuyor.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FaShoppingCart className="text-6xl mx-auto mb-4 text-gray-600" />
              <p>Sipariş ID girerek detayları görüntüleyin</p>
              <p className="text-xs text-gray-500 mt-1">Örn: 1, 2, 3...</p>
            </div>
          )}
        </div>

        {/* Alt Kısım */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiparisDetay;