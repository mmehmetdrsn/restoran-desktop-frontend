// src/pages/GarsonPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GarsonPanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('masalar');
  const [selectedMasa, setSelectedMasa] = useState(null);
  const [siparisler, setSiparisler] = useState([]);
  const [sepet, setSepet] = useState([]);
  const [showSiparisModal, setShowSiparisModal] = useState(false);
  const [showIadeModal, setShowIadeModal] = useState(false);
  const [selectedSiparis, setSelectedSiparis] = useState(null);
  const [iadeSebep, setIadeSebep] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'garson') {
      navigate('/');
    }
    // Örnek sipariş verileri
    setSiparisler([
      { id: 1, masaNo: 3, urunler: ['Pizza', 'Kola'], durum: 'Hazırlanıyor', tutar: 120 },
      { id: 2, masaNo: 5, urunler: ['Burger', 'Patates'], durum: 'Hazır', tutar: 85 },
      { id: 3, masaNo: 2, urunler: ['Salata', 'Su'], durum: 'Serviste', tutar: 45 },
    ]);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Menü items
  const menuItems = [
    { id: 'masalar', label: ' Masa Planı', icon: '🪑' },
    { id: 'siparis', label: ' Sipariş Al', icon: '📋' },
    { id: 'aktif', label: ' Aktif Siparişler', icon: '🔄' },
    { id: 'iade', label: 'İade/İptal', icon: '↩️' },
    { id: 'odeme', label: ' Ödeme Al', icon: '💰' },
  ];

  // Masa durumları
  const masalar = [
    { no: 1, durum: 'Dolu', musteri: 'Ahmet Y.' },
    { no: 2, durum: 'Boş', musteri: null },
    { no: 3, durum: 'Dolu', musteri: 'Mehmet D.' },
    { no: 4, durum: 'Boş', musteri: null },
    { no: 5, durum: 'Dolu', musteri: 'Ayşe K.' },
    { no: 6, durum: 'Boş', musteri: null },
    { no: 7, durum: 'Rezervasyon', musteri: 'Ali Y.' },
    { no: 8, durum: 'Boş', musteri: null },
  ];

  // Örnek menü ürünleri
  const menuUrunler = [
    { id: 1, ad: 'Pizza Margherita', kategori: 'Ana Yemek', fiyat: 95, stok: true },
    { id: 2, ad: 'Cheeseburger', kategori: 'Ana Yemek', fiyat: 85, stok: true },
    { id: 3, ad: 'Caesar Salad', kategori: 'Salata', fiyat: 65, stok: true },
    { id: 4, ad: 'Cola', kategori: 'İçecek', fiyat: 30, stok: true },
    { id: 5, ad: 'Tiramisu', kategori: 'Tatlı', fiyat: 55, stok: false },
    { id: 6, ad: 'Mercimek Çorbası', kategori: 'Çorba', fiyat: 45, stok: true },
  ];

  // Sepete ürün ekle
  const sepeteEkle = (urun, not = '') => {
    if (!urun.stok) {
      alert('Bu ürün stokta yok!');
      return;
    }
    const mevcut = sepet.find(item => item.id === urun.id);
    if (mevcut) {
      setSepet(sepet.map(item =>
        item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
      ));
    } else {
      setSepet([...sepet, { ...urun, adet: 1, not: not }]);
    }
  };

  // Sepetten ürün çıkar
  const sepettenCikar = (urunId) => {
    const mevcut = sepet.find(item => item.id === urunId);
    if (mevcut.adet > 1) {
      setSepet(sepet.map(item =>
        item.id === urunId ? { ...item, adet: item.adet - 1 } : item
      ));
    } else {
      setSepet(sepet.filter(item => item.id !== urunId));
    }
  };

  // Sipariş oluştur
  const siparisOlustur = () => {
    if (sepet.length === 0) {
      alert('Sepet boş!');
      return;
    }
    if (!selectedMasa) {
      alert('Lütfen bir masa seçin!');
      return;
    }
    // Siparişi mutfağa gönder
    const yeniSiparis = {
      id: Date.now(),
      masaNo: selectedMasa,
      urunler: sepet.map(item => `${item.ad} x${item.adet}${item.not ? ` (${item.not})` : ''}`),
      durum: 'Hazırlanıyor',
      tutar: sepet.reduce((toplam, item) => toplam + (item.fiyat * item.adet), 0),
    };
    setSiparisler([...siparisler, yeniSiparis]);
    setSepet([]);
    setSelectedMasa(null);
    setShowSiparisModal(false);
    alert('Sipariş mutfağa iletildi! 🍳');
  };

  // İade işlemi - Modal ile
  const iadeBaslat = (siparis) => {
    setSelectedSiparis(siparis);
    setShowIadeModal(true);
  };

  const iadeOnayla = () => {
    if (!iadeSebep) {
      alert('Lütfen bir iade sebebi seçin!');
      return;
    }
    
    const sebepList = {
      'yanlis': 'Yanlış Ürün',
      'gec': 'Geç Teslimat',
      'vazgecti': 'Müşteri Vazgeçti',
      'hatali': 'Hatalı Sipariş',
      'begenilmedi': 'Ürün Beğenilmedi',
      'diger': 'Diğer'
    };

    setSiparisler(siparisler.map(s =>
      s.id === selectedSiparis.id ? { ...s, durum: 'İptal', iadeSebep: sebepList[iadeSebep] } : s
    ));
    
    setShowIadeModal(false);
    setSelectedSiparis(null);
    setIadeSebep('');
    alert('İade/İptal işlemi başlatıldı!');
  };

  // Ödeme al
  const odemeAl = (siparis) => {
    const yontem = window.prompt('Ödeme Yöntemi:\n1. Nakit\n2. Kart (POS)\n3. Online');
    if (yontem) {
      const yontemList = {
        '1': 'Nakit',
        '2': 'Kart (POS)',
        '3': 'Online'
      };
      alert(`${yontemList[yontem] || 'Belirtilmedi'} ile ${siparis.tutar} TL ödeme alındı! ✅`);
      setSiparisler(siparisler.map(s =>
        s.id === siparis.id ? { ...s, durum: 'Tamamlandı' } : s
      ));
    }
  };

  // Aktif tab'e göre içerik render et
  const renderContent = () => {
    switch(activeTab) {
      case 'masalar':
        return <MasaPlaniContent masalar={masalar} setSelectedMasa={setSelectedMasa} />;
      case 'siparis':
        return (
          <SiparisAlContent 
            menuUrunler={menuUrunler}
            sepet={sepet}
            sepeteEkle={sepeteEkle}
            sepettenCikar={sepettenCikar}
            selectedMasa={selectedMasa}
            siparisOlustur={siparisOlustur}
            showModal={showSiparisModal}
            setShowModal={setShowSiparisModal}
          />
        );
      case 'aktif':
        return <AktifSiparislerContent siparisler={siparisler} />;
      case 'iade':
        return <IadeIptalContent siparisler={siparisler} iadeBaslat={iadeBaslat} />;
      case 'odeme':
        return <OdemeContent siparisler={siparisler} odemeAl={odemeAl} />;
      default:
        return <MasaPlaniContent masalar={masalar} setSelectedMasa={setSelectedMasa} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* İade Modal */}
      {showIadeModal && selectedSiparis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">↩️ İade/İptal Sebebi</h3>
            <p className="text-sm text-gray-600 mb-2">
              Sipariş #{selectedSiparis.id} - Masa {selectedSiparis.masaNo}
            </p>
            <select
              value={iadeSebep}
              onChange={(e) => setIadeSebep(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Seçiniz...</option>
              <option value="yanlis">Yanlış Ürün</option>
              <option value="gec">Geç Teslimat</option>
              <option value="vazgecti">Müşteri Vazgeçti</option>
              <option value="hatali">Hatalı Sipariş</option>
              <option value="begenilmedi">Ürün Beğenilmedi</option>
              <option value="diger">Diğer</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={iadeOnayla}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Onayla
              </button>
              <button
                onClick={() => {
                  setShowIadeModal(false);
                  setSelectedSiparis(null);
                  setIadeSebep('');
                }}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sol Menü */}
      <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4 border-b bg-green-600">
          <h2 className="text-xl font-bold text-white">🍽️ Garson Paneli</h2>
          <p className="text-sm text-green-100 mt-1">{user?.email}</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id 
                  ? 'bg-green-50 text-green-700 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
          
          <div className="border-t mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              🚪 Çıkış Yap
            </button>
          </div>
        </nav>
      </div>

      {/* Ana İçerik */}
      <div className="ml-64 flex-1">
        <header className="bg-white shadow-sm p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Garson'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Garson
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// ============ ALT BİLEŞENLER ============

// 1. Masa Planı Content
const MasaPlaniContent = ({ masalar, setSelectedMasa }) => {
  const masaSec = (masa) => {
    if (masa.durum === 'Boş') {
      setSelectedMasa(masa.no);
      alert(`Masa ${masa.no} seçildi! Sipariş almak için "Sipariş Al" sekmesine gidin.`);
    } else {
      alert(`Masa ${masa.no} şu an ${masa.durum.toLowerCase()}.`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">🪑 Masa Planı</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">🟢 Dolu</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">⚪ Boş</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🟡 Rezervasyon</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {masalar.map((masa) => (
          <div
            key={masa.no}
            onClick={() => masaSec(masa)}
            className={`p-6 rounded-lg shadow cursor-pointer transition-all hover:scale-105 ${
              masa.durum === 'Dolu' ? 'bg-green-100 border-2 border-green-500' :
              masa.durum === 'Boş' ? 'bg-gray-50 border-2 border-gray-300 hover:border-green-400' :
              'bg-yellow-100 border-2 border-yellow-500'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">Masa {masa.no}</div>
              <div className="text-sm mt-1">
                {masa.durum === 'Dolu' && `👤 ${masa.musteri}`}
                {masa.durum === 'Boş' && '🪑 Boş'}
                {masa.durum === 'Rezervasyon' && `📅 ${masa.musteri}`}
              </div>
              <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                masa.durum === 'Dolu' ? 'bg-green-200 text-green-800' :
                masa.durum === 'Boş' ? 'bg-gray-200 text-gray-600' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {masa.durum}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700">💡 İpucu: Boş bir masaya tıklayarak sipariş almaya başlayabilirsiniz.</p>
        {masalar.some(m => m.durum === 'Boş') && (
          <p className="text-green-600 text-sm mt-1">✅ {masalar.filter(m => m.durum === 'Boş').length} boş masa mevcut.</p>
        )}
      </div>
    </div>
  );
};

// 2. Sipariş Al Content
const SiparisAlContent = ({ 
  menuUrunler, 
  sepet, 
  sepeteEkle, 
  sepettenCikar, 
  selectedMasa, 
  siparisOlustur,
  showModal,
  setShowModal
}) => {
  const [selectedKategori, setSelectedKategori] = useState('Tümü');
  const [urunNotu, setUrunNotu] = useState('');
  const [seciliUrun, setSeciliUrun] = useState(null);
  const [showNotModal, setShowNotModal] = useState(false);

  const kategoriler = ['Tümü', ...new Set(menuUrunler.map(u => u.kategori))];
  
  const filtrelenmisUrunler = selectedKategori === 'Tümü' 
    ? menuUrunler 
    : menuUrunler.filter(u => u.kategori === selectedKategori);

  const toplamTutar = sepet.reduce((toplam, item) => toplam + (item.fiyat * item.adet), 0);

  // Ürün notu ekle
  const urunNotuEkle = () => {
    if (seciliUrun) {
      sepeteEkle(seciliUrun, urunNotu);
      setShowNotModal(false);
      setSeciliUrun(null);
      setUrunNotu('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📋 Sipariş Al</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Seçili Masa: {selectedMasa ? `Masa ${selectedMasa}` : '⚠️ Masa seçilmedi'}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🛒 Sepeti Görüntüle ({sepet.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menü Listesi */}
        <div className="lg:col-span-2">
          {/* Kategori Filtresi */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {kategoriler.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setSelectedKategori(kategori)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedKategori === kategori
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>

          {/* Ürün Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filtrelenmisUrunler.map((urun) => (
              <div
                key={urun.id}
                className={`p-4 rounded-lg shadow border ${
                  urun.stok ? 'bg-white hover:shadow-md cursor-pointer' : 'bg-gray-100 opacity-60'
                }`}
                onClick={() => {
                  if (urun.stok) {
                    setSeciliUrun(urun);
                    setShowNotModal(true);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${!urun.stok && 'line-through'}`}>{urun.ad}</h3>
                    <p className="text-sm text-gray-500">{urun.kategori}</p>
                  </div>
                  <span className="text-green-600 font-bold">₺{urun.fiyat}</span>
                </div>
                {!urun.stok && (
                  <div className="mt-2 text-xs text-red-500">Stokta Yok</div>
                )}
                {urun.stok && (
                  <div className="mt-2 text-xs text-green-500">✓ Stokta Var</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sepet Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="font-semibold text-lg mb-4">🛒 Sepet</h3>
            {sepet.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Sepet boş</p>
            ) : (
              <>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sepet.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{item.ad}</div>
                        <div className="text-sm text-gray-500">
                          {item.adet} x ₺{item.fiyat} = ₺{item.fiyat * item.adet}
                        </div>
                        {item.not && (
                          <div className="text-xs text-blue-500">📝 {item.not}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sepettenCikar(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          -
                        </button>
                        <span className="font-bold">{item.adet}</span>
                        <button
                          onClick={() => sepeteEkle(item)}
                          className="text-green-500 hover:text-green-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Toplam:</span>
                    <span>₺{toplamTutar}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!selectedMasa) {
                        alert('Lütfen önce Masa Planından bir masa seçin!');
                        return;
                      }
                      siparisOlustur();
                    }}
                    className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Sipariş Oluştur 🚀
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ürün Notu Modal */}
      {showNotModal && seciliUrun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">📝 Ürün Notu Ekle</h3>
            <p className="text-sm text-gray-600 mb-2">{seciliUrun.ad}</p>
            <p className="text-sm text-gray-500 mb-2">Fiyat: ₺{seciliUrun.fiyat}</p>
            <textarea
              value={urunNotu}
              onChange={(e) => setUrunNotu(e.target.value)}
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Örn: Soğansız, az tuzlu, vb."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={urunNotuEkle}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sepete Ekle
              </button>
              <button
                onClick={() => {
                  sepeteEkle(seciliUrun);
                  setShowNotModal(false);
                  setSeciliUrun(null);
                }}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Not Ekleme
              </button>
            </div>
            <button
              onClick={() => {
                setShowNotModal(false);
                setSeciliUrun(null);
                setUrunNotu('');
              }}
              className="w-full mt-2 py-2 text-red-500 hover:text-red-700"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Aktif Siparişler Content
const AktifSiparislerContent = ({ siparisler }) => {
  const aktifSiparisler = siparisler.filter(s => s.durum !== 'Tamamlandı' && s.durum !== 'İptal');
  const durumRenkleri = {
    'Hazırlanıyor': 'bg-yellow-100 text-yellow-800',
    'Hazır': 'bg-blue-100 text-blue-800',
    'Serviste': 'bg-purple-100 text-purple-800',
    'Tamamlandı': 'bg-green-100 text-green-800',
    'İptal': 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">🔄 Aktif Siparişler</h2>
      {aktifSiparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Aktif sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {aktifSiparisler.map((siparis) => (
            <div key={siparis.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <div className="font-semibold text-lg">Sipariş #{siparis.id}</div>
                <div className="text-sm text-gray-600">Masa {siparis.masaNo}</div>
                <div className="text-sm text-gray-600">
                  {siparis.urunler.map((urun, i) => (
                    <span key={i}>{urun}{i < siparis.urunler.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
                {siparis.iadeSebep && (
                  <div className="text-sm text-red-500">İptal Sebebi: {siparis.iadeSebep}</div>
                )}
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm ${durumRenkleri[siparis.durum] || 'bg-gray-100 text-gray-800'}`}>
                    {siparis.durum}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-600">₺{siparis.tutar}</div>
                <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  Detay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. İade/İptal Content
const IadeIptalContent = ({ siparisler, iadeBaslat }) => {
  const iadeSiparisler = siparisler.filter(s => s.durum !== 'İptal' && s.durum !== 'Tamamlandı');
  const durumRenkleri = {
    'Hazırlanıyor': 'bg-yellow-100 text-yellow-800',
    'Hazır': 'bg-blue-100 text-blue-800',
    'Serviste': 'bg-purple-100 text-purple-800',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">↩️ İade/İptal İşlemleri</h2>
      {iadeSiparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">İade/iptal edilebilecek sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {iadeSiparisler.map((siparis) => (
            <div key={siparis.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <div className="font-semibold text-lg">Sipariş #{siparis.id}</div>
                <div className="text-sm text-gray-600">Masa {siparis.masaNo}</div>
                <div className="text-sm text-gray-600">
                  {siparis.urunler.map((urun, i) => (
                    <span key={i}>{urun}{i < siparis.urunler.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm ${durumRenkleri[siparis.durum] || 'bg-gray-100 text-gray-800'}`}>
                    {siparis.durum}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">₺{siparis.tutar}</div>
                <button
                  onClick={() => iadeBaslat(siparis)}
                  className="mt-2 px-4 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  İade/İptal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700">📋 İade Sebepleri:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Yanlış Ürün', 'Geç Teslimat', 'Müşteri Vazgeçti', 'Hatalı Sipariş', 'Ürün Beğenilmedi', 'Diğer'].map((sebep, i) => (
            <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
              {i+1}. {sebep}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Ödeme Content
const OdemeContent = ({ siparisler, odemeAl }) => {
  const odenecekSiparisler = siparisler.filter(s => s.durum === 'Serviste' || s.durum === 'Hazır');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">💰 Ödeme Al</h2>
      {odenecekSiparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Ödeme alınacak sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {odenecekSiparisler.map((siparis) => (
            <div key={siparis.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <div className="font-semibold text-lg">Sipariş #{siparis.id}</div>
                <div className="text-sm text-gray-600">Masa {siparis.masaNo} - {siparis.durum}</div>
                <div className="text-sm text-gray-600">
                  {siparis.urunler.map((urun, i) => (
                    <span key={i}>{urun}{i < siparis.urunler.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-600">₺{siparis.tutar}</div>
                <button
                  onClick={() => odemeAl(siparis)}
                  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Ödeme Al
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700">💳 Ödeme Yöntemleri:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Nakit', 'Kart (POS)', 'Online'].map((yontem, i) => (
            <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
              {i+1}. {yontem}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GarsonPanel;