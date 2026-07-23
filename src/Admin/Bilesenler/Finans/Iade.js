import React, { useState } from 'react';
import { 
  FaTimes, FaUndo, FaSearch, FaMoneyBillWave, FaUser, 
  FaReceipt, FaSpinner, FaBox, FaCheck, FaMinusCircle, FaPlus,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { paymentService, orderService, iadeService } from '../../../api/api';
import SiparisDetay from '../Siparis/SiparisDetay';

const IadeOnayModal = ({ acik, kapat, onConfirm, secilenUrunler, toplamTutar, siparisId }) => {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">İade Onayı</h2>
            <p className="text-gray-400 text-sm">Bu işlem geri alınamaz</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-2">
          {secilenUrunler} ürün için iade yapmak istediğinize emin misiniz?
        </p>
        
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Toplam İade Tutarı</span>
            <span className="text-yellow-400 font-bold">₺{toplamTutar.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Sipariş</span>
            <span className="text-white">#{siparisId}</span>
          </div>
        </div>
        
        <p className="text-red-400 text-xs mb-6">
          ⚠️ Bu işlem geri alınamaz!
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
            className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all"
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

const Iade = ({ acik, kapat }) => {
  const [siparisId, setSiparisId] = useState('');
  const [loading, setLoading] = useState(false);
  const [siparisBilgisi, setSiparisBilgisi] = useState(null);
  const [seciliUrunler, setSeciliUrunler] = useState([]);
  const [iadeAciklama, setIadeAciklama] = useState('');
  const [onayModal, setOnayModal] = useState({ acik: false });
  
  // Kullanıcı bilgilerini localStorage'dan al
  const [userData, setUserData] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return { personelId: null };
    } catch {
      return { personelId: null };
    }
  });

  if (!acik) return null;

  const handleSiparisAra = async () => {
    if (!siparisId) {
      toast.warning('Lütfen sipariş ID girin!');
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getById(parseInt(siparisId));
      const data = response.data;
      
      console.log('📋 Gelen sipariş verisi:', data);
      console.log('📋 Detaylar:', data?.detaylar);  
      console.log('📋 Detay sayısı:', data?.detaylar?.length || 0);  
      
      if (data && data.siparisId) {
        const odemeResponse = await paymentService.getAll();
        const odeme = odemeResponse.data?.find(o => o.siparisId === parseInt(siparisId));
        
        setSiparisBilgisi({
          ...data,
          odeme: odeme || null
        });
        
        if (data.detaylar && data.detaylar.length > 0) {
          setSeciliUrunler(data.detaylar.map((urun) => ({
            ...urun,
            secili: false,
            iadeAdet: 0
          })));
          toast.success(`✅ ${data.detaylar.length} ürün bulundu!`);
        } else {
          toast.warning('⚠️ Bu siparişe ait ürün detayı bulunamadı!');
          setSeciliUrunler([]);
        }
        
        if (!odeme) {
          toast.warning('⚠️ Bu siparişe ait ödeme bulunamadı! İade işlemi yapılamaz.');
        } else {
          toast.success('✅ Sipariş bulundu!');
        }
      } else {
        toast.error('❌ Sipariş bulunamadı!');
        setSiparisBilgisi(null);
        setSeciliUrunler([]);
      }
    } catch (error) {
      console.error('Sipariş aranırken hata:', error);
      toast.error('❌ Sipariş bulunamadı!');
      setSiparisBilgisi(null);
      setSeciliUrunler([]);
    } finally {
      setLoading(false);
    }
  };

  // Ürün seçimini değiştir
  const toggleUrunSecim = (index) => {
    const yeniSecili = [...seciliUrunler];
    yeniSecili[index].secili = !yeniSecili[index].secili;
    if (!yeniSecili[index].secili) {
      yeniSecili[index].iadeAdet = 0;
    } else {
      yeniSecili[index].iadeAdet = 1;
    }
    setSeciliUrunler(yeniSecili);
  };

  // İade adetini değiştir
  const changeIadeAdet = (index, yeniAdet) => {
    const yeniSecili = [...seciliUrunler];
    const maxAdet = yeniSecili[index].adet || 1;
    
    if (yeniAdet >= 0 && yeniAdet <= maxAdet) {
      yeniSecili[index].iadeAdet = yeniAdet;
      if (yeniAdet === 0) {
        yeniSecili[index].secili = false;
      } else {
        yeniSecili[index].secili = true;
      }
      setSeciliUrunler(yeniSecili);
    }
  };

  // Toplam iade tutarı
  const toplamIadeTutari = seciliUrunler
    .filter(u => u.secili && u.iadeAdet > 0)
    .reduce((toplam, u) => {
      return toplam + ((u.birimFiyat || 0) * (u.iadeAdet || 0));
    }, 0);

  const seciliUrunSayisi = seciliUrunler.filter(u => u.secili && u.iadeAdet > 0).length;

  // İade işlemi - Önce onay modalını aç
const handleIadeOnay = () => {
  const secilenUrunler = seciliUrunler.filter(u => u.secili && u.iadeAdet > 0);
  
  if (secilenUrunler.length === 0) {
    toast.warning('Lütfen iade edilecek en az bir ürün seçin!');
    return;
  }

  if (!siparisBilgisi?.odeme) {
    toast.error('❌ Bu siparişe ait ödeme bulunamadı! İade işlemi yapılamaz.');
    return;
  }

  setOnayModal({ acik: true });
};

const handleIadeOnayla = async () => {
  setOnayModal({ acik: false });
  
  const secilenUrunler = seciliUrunler.filter(u => u.secili && u.iadeAdet > 0);

  try {
    setLoading(true);

    // 1. İade kayıtlarını oluştur VE hemen onayla
    //    (Onay olmadan IadeDurumu "BEKLEMEDE" kalır, SiparisDetay.IadeEdildi hiç
    //    true olmaz ve bu iade ciro raporunda hiç görünmez.)
    for (const urun of secilenUrunler) {
      const olusturulan = await iadeService.create({
        siparisDetayId: urun.siparisDetayId || urun.SiparisDetayId,
        urunId: urun.urunId,
        iadeTutari: (urun.birimFiyat || 0) * (urun.iadeAdet || 0),
        iadeSebebi: iadeAciklama || 'Ürün iadesi',
        personelId: userData?.personelId || userData?.PersonelId || null
      });

      const yeniIadeId = olusturulan?.data?.iadeId || olusturulan?.data?.IadeId;
      if (yeniIadeId) {
        await iadeService.updateStatus(yeniIadeId, 'ONAYLANDI');
      }
    }

    // 2. Ödemeyi sil (SADECE iade edilen ürünün tutarı kadar)
    if (siparisBilgisi?.odeme?.odemeId) {
      await paymentService.delete(siparisBilgisi.odeme.odemeId);
    }

    // 3. Sipariş durumu artık burada zorlanmıyor.
    //    IadeController.DurumGuncelle, iade ONAYLANDI olduğunda
    //    siparişin KISMI_IADE mi yoksa IADE mi olacağına kendisi karar veriyor
    //    (hepsiIadeEdildi kontrolü). Bunu burada elle ezmek, backend'deki
    //    doğru mantığı devre dışı bırakıyor ve iki durumun senkronunu bozuyordu.
    
    toast.success(`✅ ${secilenUrunler.length} ürün iade edildi! Toplam: ₺${toplamIadeTutari.toFixed(2)}`);
    
    // Formu sıfırla
    setSiparisId('');
    setSiparisBilgisi(null);
    setSeciliUrunler([]);
    setIadeAciklama('');
    kapat();
    
  } catch (error) {
    console.error('İade yapılırken hata:', error);
    toast.error('❌ İade yapılırken hata oluştu!');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Ana Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h2 className="text-white font-bold text-lg">🔄 Ürün Bazlı İade</h2>
              <p className="text-gray-400 text-xs">Siparişten ürün seçerek iade yapın</p>
            </div>
            <button onClick={kapat} className="text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Sipariş ID Ara */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Sipariş ID</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={siparisId}
                  onChange={(e) => {
                    setSiparisId(e.target.value);
                    setSiparisBilgisi(null);
                    setSeciliUrunler([]);
                  }}
                  className="flex-1 py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Sipariş ID girin"
                  disabled={loading}
                />
                <button
                  onClick={handleSiparisAra}
                  disabled={loading || !siparisId}
                  className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                </button>
              </div>
              {siparisBilgisi && !siparisBilgisi?.odeme && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <FaExclamationTriangle size={12} /> Bu siparişe ait ödeme bulunamadı! İade yapılamaz.
                </p>
              )}
            </div>

            {/* Sipariş Bilgisi */}
            {siparisBilgisi && (
              <div className="space-y-4">
                {/* Sipariş Özeti */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Sipariş #{siparisBilgisi.siparisId}</p>
                      <p className="text-gray-400 text-sm">
                        Müşteri: {siparisBilgisi.uyeAdi || 'Ziyaretçi'} • 
                        Masa: {siparisBilgisi.masaNo || 'Paket'}
                      </p>
                      {siparisBilgisi.odeme ? (
                        <p className="text-green-400 text-sm">
                          💰 Ödeme: ₺{siparisBilgisi.odeme.odemeTutari?.toFixed(2) || 0} • 
                          Tip: {siparisBilgisi.odeme.odemeTipi || 'Bilinmiyor'}
                        </p>
                      ) : (
                        <p className="text-red-400 text-sm">
                          ❌ Ödeme bulunamadı!
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Seçilen İade Tutarı</p>
                      <p className="text-yellow-400 font-bold text-2xl">₺{toplamIadeTutari.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Ürün Listesi */}
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5">
                    <FaBox className="text-yellow-400" />
                    <h4 className="text-white font-medium">İade Edilecek Ürünler</h4>
                    <span className="text-gray-400 text-xs bg-white/10 px-2 py-0.5 rounded ml-auto">
                      {seciliUrunSayisi} seçili
                    </span>
                  </div>
                  
                  <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                    {seciliUrunler.map((urun, index) => {
                      const isSecili = urun.secili && urun.iadeAdet > 0;
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            isSecili ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5 border border-white/10 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleUrunSecim(index)}
                              className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                isSecili ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
                              }`}
                            >
                              {isSecili && <FaCheck size={12} />}
                            </button>
                            <div>
                              <p className="text-white font-medium">{urun.urunAdi || 'Bilinmiyor'}</p>
                              <p className="text-gray-400 text-sm">₺{urun.birimFiyat?.toFixed(2) || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => changeIadeAdet(index, (urun.iadeAdet || 0) - 1)}
                                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                disabled={urun.iadeAdet <= 0}
                              >
                                <FaMinusCircle size={12} />
                              </button>
                              <span className={`font-medium w-8 text-center ${isSecili ? 'text-white' : 'text-gray-400'}`}>
                                {urun.iadeAdet || 0}
                              </span>
                              <button
                                onClick={() => changeIadeAdet(index, (urun.iadeAdet || 0) + 1)}
                                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                disabled={urun.iadeAdet >= (urun.adet || 1)}
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            <span className={`font-medium min-w-[70px] text-right ${isSecili ? 'text-yellow-400' : 'text-gray-400'}`}>
                              ₺{((urun.birimFiyat || 0) * (urun.iadeAdet || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {seciliUrunler.length === 0 && (
                      <p className="text-gray-400 text-center py-4">Bu siparişe ait ürün bulunmuyor.</p>
                    )}
                  </div>

                  <div className="bg-yellow-500/10 p-3 border-t border-yellow-500/20 flex items-center justify-between">
                    <span className="text-white font-bold">İade Toplamı</span>
                    <span className="text-yellow-400 font-bold text-xl">₺{toplamIadeTutari.toFixed(2)}</span>
                  </div>
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    İade Açıklaması
                    <span className="text-gray-500 text-xs ml-1">(opsiyonel)</span>
                  </label>
                  <input
                    type="text"
                    value={iadeAciklama}
                    onChange={(e) => setIadeAciklama(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                    placeholder="İade nedeni (örn: Müşteri memnuniyetsizliği)"
                    disabled={loading}
                  />
                </div>

                {/* İade Butonu */}
                <button
                  onClick={handleIadeOnay}
                  disabled={loading || seciliUrunSayisi === 0 || !siparisBilgisi?.odeme}
                  className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    seciliUrunSayisi > 0 && siparisBilgisi?.odeme
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin" /> İşleniyor...</>
                  ) : (
                    <><FaUndo /> İade Yap (₺{toplamIadeTutari.toFixed(2)})</>
                  )}
                </button>
                {!siparisBilgisi?.odeme && seciliUrunSayisi > 0 && (
                  <p className="text-red-400 text-xs text-center mt-1">
                    ⚠️ Ödeme bulunamadığı için iade yapılamaz!
                  </p>
                )}
              </div>
            )}

            {!siparisBilgisi && (
              <div className="text-center py-12 text-gray-400">
                <FaReceipt className="text-6xl mx-auto mb-4 text-gray-600" />
                <p>Sipariş ID girerek ürün bazlı iade yapın</p>
                <p className="text-xs text-gray-500 mt-1">İade edilecek ürünleri seçin ve miktarını belirleyin</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex justify-end">
            <button onClick={kapat} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
              Kapat
            </button>
          </div>
        </div>
      </div>

      {/* ONAY MODALI */}
      <IadeOnayModal
        acik={onayModal.acik}
        kapat={() => setOnayModal({ acik: false })}
        onConfirm={handleIadeOnayla}
        secilenUrunler={seciliUrunSayisi}
        toplamTutar={toplamIadeTutari}
        siparisId={siparisId}
      />
    </>
  );
};

export default Iade;