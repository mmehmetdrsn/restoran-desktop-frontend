// src/Admin/components/Recete/ReceteEkle.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { receteService, materialService, productService } from '../../../api/api';

const ReceteEkle = ({ acik, kapat, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [urunler, setUrunler] = useState([]);
  const [malzemeler, setMalzemeler] = useState([]);
  const [urunAraniyor, setUrunAraniyor] = useState(false);
  const [urunId, setUrunId] = useState('');
  const [seciliUrun, setSeciliUrun] = useState(null);
  const [receteSatirlari, setReceteSatirlari] = useState([]);
  const [yeniSatir, setYeniSatir] = useState({
    malzemeId: '',
    kullanimMiktari: ''
  });

  // Modal açıldığında malzemeleri ve ürünleri getir
  useEffect(() => {
    if (acik) {
      yukleMalzemeler();
      yukleUrunler();
    }
  }, [acik]);

  // Modal kapandığında sıfırla
  useEffect(() => {
    if (!acik) {
      setUrunId('');
      setSeciliUrun(null);
      setReceteSatirlari([]);
      setYeniSatir({ malzemeId: '', kullanimMiktari: '' });
    }
  }, [acik]);

  if (!acik) return null;

  // 📦 Malzemeleri getir
  const yukleMalzemeler = async () => {
    try {
      const response = await materialService.getAll();
      const data = response?.data || response || [];
      setMalzemeler(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Malzemeler yüklenirken hata:', error);
      toast.error('Malzemeler yüklenemedi!');
    }
  };

  // 📦 Ürünleri getir
  const yukleUrunler = async () => {
    try {
      const response = await productService.getAll();
      const data = response?.data || response || [];
      setUrunler(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    }
  };

  // 🔍 Ürün ara
  const handleUrunAra = async () => {
    if (!urunId) {
      toast.warning('Lütfen ürün ID girin!');
      return;
    }

    setUrunAraniyor(true);
    setSeciliUrun(null);
    setReceteSatirlari([]);

    try {
      const response = await productService.getById(parseInt(urunId));
      const data = response.data;

      if (data && data.urunId) {
        setSeciliUrun(data);

        // 🔥 Ürünün mevcut reçetesini getir
        try {
          const receteResponse = await receteService.getByUrun(data.urunId);
          const receteData = receteResponse?.data || receteResponse;
          
          if (receteData && receteData.recete && Array.isArray(receteData.recete)) {
            // Mevcut reçete satırlarını formata uygun hale getir
            const mevcutSatirlar = receteData.recete.map(r => ({
              receteId: r.receteId,
              malzemeId: r.malzemeId,
              malzemeAdi: r.malzemeAdi,
              kullanimMiktari: r.kullanimMiktari,
              birim: r.birim,
              birimMaliyeti: r.birimMaliyeti,
              satirMaliyeti: r.satirMaliyeti
            }));
            setReceteSatirlari(mevcutSatirlar);
            toast.info(`📋 ${mevcutSatirlar.length} reçete satırı bulundu.`);
          }
        } catch (error) {
          console.log('Reçete bulunamadı, yeni reçete oluşturulacak.');
        }

        toast.success(`✅ ${data.urunAdi} bulundu!`);
      } else {
        toast.error('❌ Ürün bulunamadı!');
      }
    } catch (error) {
      console.error('Ürün aranırken hata:', error);
      toast.error('❌ Ürün bulunamadı!');
    } finally {
      setUrunAraniyor(false);
    }
  };

  // ➕ Reçete satırı ekle
  const receteSatirEkle = () => {
    if (!yeniSatir.malzemeId) {
      toast.warning('Lütfen malzeme seçin!');
      return;
    }

    if (!yeniSatir.kullanimMiktari || parseFloat(yeniSatir.kullanimMiktari) <= 0) {
      toast.warning('Lütfen geçerli bir kullanım miktarı girin!');
      return;
    }

    // Aynı malzeme zaten eklenmiş mi kontrol et
    const varMi = receteSatirlari.some(s => s.malzemeId === parseInt(yeniSatir.malzemeId));
    if (varMi) {
      toast.warning('Bu malzeme zaten reçetede var!');
      return;
    }

    const seciliMalzeme = malzemeler.find(m => m.malzemeId === parseInt(yeniSatir.malzemeId));

    const yeniSatirObj = {
      malzemeId: parseInt(yeniSatir.malzemeId),
      malzemeAdi: seciliMalzeme?.malzemeAdi || 'Bilinmiyor',
      kullanimMiktari: parseFloat(yeniSatir.kullanimMiktari),
      birim: seciliMalzeme?.birim || 'adet',
      birimMaliyeti: seciliMalzeme?.birimMaliyeti || 0,
      satirMaliyeti: parseFloat(yeniSatir.kullanimMiktari) * (seciliMalzeme?.birimMaliyeti || 0)
    };

    setReceteSatirlari([...receteSatirlari, yeniSatirObj]);
    setYeniSatir({ malzemeId: '', kullanimMiktari: '' });
    toast.success('✅ Reçete satırı eklendi!');
  };

  // ❌ Reçete satırı sil
  const receteSatirSil = (index) => {
    const silinecek = receteSatirlari[index];
    if (silinecek.receteId) {
      // Mevcut reçete satırı ise silme onayı iste
      if (!window.confirm(`"${silinecek.malzemeAdi}" reçete satırını silmek istediğinize emin misiniz?`)) {
        return;
      }
    }
    setReceteSatirlari(receteSatirlari.filter((_, i) => i !== index));
    toast.info('Reçete satırı kaldırıldı.');
  };

  // 💾 Reçeteyi kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seciliUrun) {
      toast.warning('Lütfen önce bir ürün seçin!');
      return;
    }

    if (receteSatirlari.length === 0) {
      toast.warning('En az bir reçete satırı eklemelisiniz!');
      return;
    }

    setLoading(true);

    try {
      let basarili = 0;
      let hatali = 0;

      // Her bir reçete satırını kaydet
      for (const satir of receteSatirlari) {
        try {
          // Eğer receteId varsa güncelle, yoksa ekle
          if (satir.receteId) {
            await receteService.update(satir.receteId, {
              urunId: seciliUrun.urunId,
              malzemeId: satir.malzemeId,
              kullanimMiktari: satir.kullanimMiktari
            });
          } else {
            await receteService.create({
              urunId: seciliUrun.urunId,
              malzemeId: satir.malzemeId,
              kullanimMiktari: satir.kullanimMiktari
            });
          }
          basarili++;
        } catch (error) {
          console.error('Reçete satırı kaydedilemedi:', error);
          hatali++;
        }
      }

      if (basarili > 0) {
        const mesaj = `✅ ${basarili} reçete satırı başarıyla kaydedildi!${hatali > 0 ? ` (${hatali} hata)` : ''}`;
        toast.success(mesaj);
        
        // Toplam maliyeti hesapla
        const toplamMaliyet = receteSatirlari.reduce((sum, s) => sum + s.satirMaliyeti, 0);
        toast.info(`📊 Toplam malzeme maliyeti: ₺${toplamMaliyet.toFixed(2)}`);
        
        kapat();
        if (onSuccess) onSuccess();
      } else {
        toast.error('❌ Reçete kaydedilemedi!');
      }
    } catch (error) {
      console.error('Reçete kaydedilirken hata:', error);
      toast.error('❌ Reçete kaydedilirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // 📊 Toplam maliyeti hesapla
  const toplamMaliyet = receteSatirlari.reduce((sum, s) => sum + (s.satirMaliyeti || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* BAŞLIK */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-yellow-400"><FaUtensils /></div>
            <div>
              <h2 className="text-white font-bold text-lg">📝 Reçete Ekle</h2>
              <p className="text-gray-400 text-xs">Ürüne malzeme reçetesi ekleyin</p>
            </div>
          </div>
          <button onClick={kapat} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* İÇERİK */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 🎯 ÜRÜN ARAMA */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex gap-2">
              <input
                type="number"
                value={urunId}
                onChange={(e) => setUrunId(e.target.value)}
                className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Ürün ID girin (Örn: 1)"
                required
                disabled={loading || urunAraniyor}
              />
              <button
                type="button"
                onClick={handleUrunAra}
                disabled={loading || urunAraniyor || !urunId}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {urunAraniyor ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ara...</>
                ) : (
                  '🔍 Ara'
                )}
              </button>
            </div>

            {/* Seçili Ürün Bilgisi */}
            {seciliUrun && (
              <div className="mt-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    #{seciliUrun.urunId} - {seciliUrun.urunAdi}
                  </p>
                  <p className="text-gray-400 text-sm">Fiyat: ₺{seciliUrun.fiyat}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                  ✅ Seçili
                </span>
              </div>
            )}
          </div>

          {/* 📋 REÇETE SATIRLARI */}
          {seciliUrun && (
            <>
              {/* Mevcut reçete satırları */}
              {receteSatirlari.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                    📋 Reçete Satırları ({receteSatirlari.length})
                    <span className="text-gray-400 text-xs ml-auto">
                      Toplam Maliyet: ₺{toplamMaliyet.toFixed(2)}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {receteSatirlari.map((satir, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs">{index + 1}.</span>
                          <span className="text-white text-sm">{satir.malzemeAdi}</span>
                          <span className="text-gray-400 text-xs">
                            {satir.kullanimMiktari} {satir.birim}
                          </span>
                          {satir.receteId && (
                            <span className="text-green-400 text-[10px] bg-green-500/20 px-1.5 py-0.5 rounded">
                              Kayıtlı
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-300 text-sm">
                            ₺{satir.satirMaliyeti.toFixed(2)}
                          </span>
                          <button
                            onClick={() => receteSatirSil(index)}
                            className="text-red-400 hover:text-red-300 transition"
                            disabled={loading}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ➕ Yeni Reçete Satırı Ekleme */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium text-sm mb-3">➕ Yeni Reçete Satırı Ekle</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={yeniSatir.malzemeId}
                    onChange={(e) => setYeniSatir({ ...yeniSatir, malzemeId: e.target.value })}
                    className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none"
                    disabled={loading}
                  >
                    <option value="">-- Malzeme Seç --</option>
                    {malzemeler.map((m) => (
                      <option key={m.malzemeId} value={m.malzemeId}>
                        {m.malzemeAdi} ({m.birim}) - ₺{m.birimMaliyeti || 0}/{m.birim}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={yeniSatir.kullanimMiktari}
                    onChange={(e) => setYeniSatir({ ...yeniSatir, kullanimMiktari: e.target.value })}
                    className="w-full sm:w-32 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                    placeholder="Miktar"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={receteSatirEkle}
                    disabled={loading || !yeniSatir.malzemeId || !yeniSatir.kullanimMiktari}
                    className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  >
                    <FaPlus size={14} /> Ekle
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ALT BUTONLAR */}
        <div className="p-4 border-t border-white/10 flex gap-3">
          <button
            type="button"
            onClick={kapat}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !seciliUrun || receteSatirlari.length === 0}
            className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Kaydediliyor...</>
            ) : (
              '💾 Reçeteyi Kaydet'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceteEkle;