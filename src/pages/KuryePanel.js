// src/pages/KuryePanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KuryePanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('teslimatlar');
  const [teslimatlar, setTeslimatlar] = useState([]);
  const [selectedTeslimat, setSelectedTeslimat] = useState(null);
  const [showDetayModal, setShowDetayModal] = useState(false);
  const [showOdemeModal, setShowOdemeModal] = useState(false);
  const [kuryeDurum, setKuryeDurum] = useState('Müsait');
  const [konum, setKonum] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'kurye') {
      navigate('/');
    }

    // Kurye konumunu simüle et
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setKonum({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Konum izni yoksa varsayılan konum
          setKonum({ lat: 41.0082, lng: 28.9784 });
        }
      );
    }

    // Örnek teslimat verileri
    setTeslimatlar([
      { 
        id: 201,
        siparisNo: 101,
        musteri: 'Ahmet Yılmaz',
        adres: 'Bağdat Caddesi No:123 D:4, Kadıköy/İstanbul',
        telefon: '0555 123 4567',
        urunler: ['Pizza Margherita x2', 'Cola x1'],
        tutar: 220,
        durum: 'Bekliyor',
        teslimatTuru: 'Eve Teslim',
        mesafe: '2.3 km',
        tahminiSure: '15 dk',
        siparisZamani: '12:30',
        odemeTipi: 'Kapıda Ödeme'
      },
      { 
        id: 202,
        siparisNo: 103,
        musteri: 'Ayşe Demir',
        adres: 'İstiklal Caddesi No:45, Beyoğlu/İstanbul',
        telefon: '0555 987 6543',
        urunler: ['Caesar Salad x1', 'Mercimek Çorbası x1'],
        tutar: 110,
        durum: 'Yolda',
        teslimatTuru: 'Eve Teslim',
        mesafe: '4.1 km',
        tahminiSure: '25 dk',
        siparisZamani: '12:45',
        odemeTipi: 'Online'
      },
      { 
        id: 203,
        siparisNo: 105,
        musteri: 'Mehmet Kaya',
        adres: 'Kadıköy Rıhtım Cad. No:67, Kadıköy/İstanbul',
        telefon: '0555 456 7890',
        urunler: ['Cheeseburger x1', 'Patates x1'],
        tutar: 130,
        durum: 'Teslim Edildi',
        teslimatTuru: 'Eve Teslim',
        mesafe: '1.8 km',
        tahminiSure: '10 dk',
        siparisZamani: '12:15',
        odemeTipi: 'Kapıda Ödeme'
      },
    ]);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Sipariş teslim al
  const teslimAl = (teslimat) => {
    if (window.confirm(`Sipariş #${teslimat.siparisNo} teslim alınsın mı?`)) {
      setTeslimatlar(teslimatlar.map(t =>
        t.id === teslimat.id ? { ...t, durum: 'Yolda' } : t
      ));
      setKuryeDurum('Yolda');
      alert('🚴 Sipariş teslim alındı! Müşteri adresine gidiliyor...');
      
      // Simüle edilmiş teslimat süresi
      setTimeout(() => {
        setTeslimatlar(prev => prev.map(t =>
          t.id === teslimat.id ? { ...t, durum: 'Teslim Edildi' } : t
        ));
        setKuryeDurum('Müsait');
        alert('✅ Sipariş teslim edildi!');
      }, 5000);
    }
  };

  // Kapıda ödeme
  const odemeAl = (teslimat) => {
    setSelectedTeslimat(teslimat);
    setShowOdemeModal(true);
  };

  const odemeOnayla = (yontem) => {
    if (selectedTeslimat) {
      alert(`💰 ${yontem} ile ${selectedTeslimat.tutar} TL ödeme alındı!`);
      setTeslimatlar(teslimatlar.map(t =>
        t.id === selectedTeslimat.id ? { ...t, durum: 'Teslim Edildi' } : t
      ));
      setShowOdemeModal(false);
      setSelectedTeslimat(null);
    }
  };

  // Teslimat detayını göster
  const teslimatDetayGoster = (teslimat) => {
    setSelectedTeslimat(teslimat);
    setShowDetayModal(true);
  };

  // Teslimat durumu güncelle
  const teslimatDurumuGuncelle = (teslimatId, yeniDurum) => {
    setTeslimatlar(teslimatlar.map(t =>
      t.id === teslimatId ? { ...t, durum: yeniDurum } : t
    ));
  };

  // Menü items
  const menuItems = [
    { id: 'teslimatlar', label: 'Teslimatlar', icon: '📦' },
    { id: 'yolda', label: 'Yoldakiler', icon: '🚴' },
    { id: 'tamamlanan', label: 'Tamamlanan', icon: '✅' },
    { id: 'durum', label: 'Durum', icon: '📊' },
  ];

  // Aktif tab'e göre içerik render et
  const renderContent = () => {
    switch(activeTab) {
      case 'teslimatlar':
        return <TeslimatlarContent 
          teslimatlar={teslimatlar.filter(t => t.durum === 'Bekliyor')} 
          teslimAl={teslimAl}
          teslimatDetayGoster={teslimatDetayGoster}
          setActiveTab={setActiveTab}
        />;
      case 'yolda':
        return <YoldakiTeslimatlarContent 
          teslimatlar={teslimatlar.filter(t => t.durum === 'Yolda')} 
          teslimatDetayGoster={teslimatDetayGoster}
          odemeAl={odemeAl}
          setActiveTab={setActiveTab}
        />;
      case 'tamamlanan':
        return <TamamlananTeslimatlarContent 
          teslimatlar={teslimatlar.filter(t => t.durum === 'Teslim Edildi')} 
        />;
      case 'durum':
        return <KuryeDurumContent 
          kuryeDurum={kuryeDurum} 
          teslimatlar={teslimatlar}
          konum={konum}
          setActiveTab={setActiveTab}
        />;
      default:
        return <TeslimatlarContent 
          teslimatlar={teslimatlar.filter(t => t.durum === 'Bekliyor')} 
          teslimAl={teslimAl}
          teslimatDetayGoster={teslimatDetayGoster}
          setActiveTab={setActiveTab}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Teslimat Detay Modal */}
      {showDetayModal && selectedTeslimat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">📦 Teslimat Detayı</h3>
              <button
                onClick={() => {
                  setShowDetayModal(false);
                  setSelectedTeslimat(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sipariş No</p>
                  <p className="font-semibold">#{selectedTeslimat.siparisNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durum</p>
                  <p className="font-semibold">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedTeslimat.durum === 'Bekliyor' ? 'bg-yellow-100 text-yellow-800' :
                      selectedTeslimat.durum === 'Yolda' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedTeslimat.durum}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Müşteri</p>
                  <p className="font-semibold">{selectedTeslimat.musteri}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-semibold text-blue-600">{selectedTeslimat.telefon}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">📍 Adres</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p>{selectedTeslimat.adres}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    🚗 Mesafe: {selectedTeslimat.mesafe} • ⏱️ {selectedTeslimat.tahminiSure}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">📋 Ürünler</p>
                <div className="space-y-1">
                  {selectedTeslimat.urunler.map((urun, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {urun}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-500">Ödeme Tipi</p>
                  <p className="font-semibold">
                    {selectedTeslimat.odemeTipi === 'Kapıda Ödeme' ? '💰 Kapıda Ödeme' : '💳 Online'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tutar</p>
                  <p className="font-bold text-lg text-green-600">₺{selectedTeslimat.tutar}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedTeslimat.durum === 'Bekliyor' && (
                  <button
                    onClick={() => {
                      teslimAl(selectedTeslimat);
                      setShowDetayModal(false);
                      setSelectedTeslimat(null);
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    🚴 Teslim Al
                  </button>
                )}
                {selectedTeslimat.durum === 'Yolda' && selectedTeslimat.odemeTipi === 'Kapıda Ödeme' && (
                  <button
                    onClick={() => {
                      odemeAl(selectedTeslimat);
                      setShowDetayModal(false);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    💰 Ödeme Al
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetayModal(false);
                    setSelectedTeslimat(null);
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Modal */}
      {showOdemeModal && selectedTeslimat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">💰 Ödeme Al</h3>
            <p className="text-sm text-gray-600 mb-2">
              Sipariş #{selectedTeslimat.siparisNo} - {selectedTeslimat.musteri}
            </p>
            <p className="text-2xl font-bold text-green-600 mb-4">₺{selectedTeslimat.tutar}</p>
            
            <div className="space-y-2">
              <button
                onClick={() => odemeOnayla('Nakit')}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                💵 Nakit
              </button>
              <button
                onClick={() => odemeOnayla('Kart (POS)')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                💳 Kart (POS)
              </button>
              <button
                onClick={() => odemeOnayla('Online')}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                📱 Online
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowOdemeModal(false);
                setSelectedTeslimat(null);
              }}
              className="w-full mt-4 py-2 text-red-500 hover:text-red-700"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Sol Menü */}
      <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4 border-b bg-blue-600">
          <h2 className="text-xl font-bold text-white">🚴 Kurye Paneli</h2>
          <p className="text-sm text-blue-100 mt-1">{user?.email}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              kuryeDurum === 'Müsait' ? 'bg-green-500 text-white' :
              kuryeDurum === 'Yolda' ? 'bg-yellow-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
              {kuryeDurum}
            </span>
          </div>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
              {item.id === 'teslimatlar' && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {teslimatlar.filter(t => t.durum === 'Bekliyor').length}
                </span>
              )}
              {item.id === 'yolda' && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {teslimatlar.filter(t => t.durum === 'Yolda').length}
                </span>
              )}
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
              {menuItems.find(item => item.id === activeTab)?.label || 'Kurye'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Kurye
              </span>
              {konum && (
                <span className="text-xs text-gray-500">
                  📍 {konum.lat.toFixed(4)}, {konum.lng.toFixed(4)}
                </span>
              )}
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

// 1. Teslimatlar Content (Bekleyen Teslimatlar)
const TeslimatlarContent = ({ teslimatlar, teslimAl, teslimatDetayGoster, setActiveTab }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📦 Bekleyen Teslimatlar</h2>
        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          {teslimatlar.length} teslimat bekliyor
        </span>
      </div>

      {teslimatlar.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🛵</div>
          <p className="text-gray-500 text-lg">Bekleyen teslimat bulunmuyor</p>
          <p className="text-gray-400 text-sm">Yeni teslimatlar burada görünecek</p>
          <button
            onClick={() => setActiveTab('durum')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📊 Durumu Görüntüle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {teslimatlar.map((teslimat) => (
            <div key={teslimat.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow border-l-4 border-yellow-400">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">Sipariş #{teslimat.siparisNo}</div>
                  <div className="text-sm text-gray-600">
                    👤 {teslimat.musteri} • {teslimat.siparisZamani}
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  ⏳ Bekliyor
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                📍 {teslimat.adres.split(',')[0]}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>🚗 {teslimat.mesafe}</span>
                <span>⏱️ {teslimat.tahminiSure}</span>
                <span>💰 ₺{teslimat.tutar}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => teslimatDetayGoster(teslimat)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Detay
                </button>
                <button
                  onClick={() => teslimAl(teslimat)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  🚴 Teslim Al
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Yoldaki Teslimatlar Content
const YoldakiTeslimatlarContent = ({ teslimatlar, teslimatDetayGoster, odemeAl, setActiveTab }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">🚴 Yoldaki Teslimatlar</h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          {teslimatlar.length} teslimat yolda
        </span>
      </div>

      {teslimatlar.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-500 text-lg">Yolda teslimat bulunmuyor</p>
          <button
            onClick={() => setActiveTab('teslimatlar')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            📦 Yeni Teslimatları Gör
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {teslimatlar.map((teslimat) => (
            <div key={teslimat.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-400">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">Sipariş #{teslimat.siparisNo}</div>
                  <div className="text-sm text-gray-600">
                    👤 {teslimat.musteri} • {teslimat.siparisZamani}
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm animate-pulse">
                  🚴 Yolda
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                📍 {teslimat.adres.split(',')[0]}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>🚗 {teslimat.mesafe}</span>
                <span>⏱️ {teslimat.tahminiSure}</span>
                <span>💰 ₺{teslimat.tutar}</span>
              </div>

              {/* İlerleme çubuğu */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Teslimata yaklaşılıyor...</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => teslimatDetayGoster(teslimat)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Detay
                </button>
                {teslimat.odemeTipi === 'Kapıda Ödeme' && (
                  <button
                    onClick={() => odemeAl(teslimat)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    💰 Ödeme Al
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm(`Sipariş #${teslimat.siparisNo} teslim edildi mi?`)) {
                      alert('✅ Teslimat tamamlandı!');
                      // Durum güncelleme işlemi burada yapılacak
                    }
                  }}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  ✅ Teslim Et
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Tamamlanan Teslimatlar Content
const TamamlananTeslimatlarContent = ({ teslimatlar }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">✅ Tamamlanan Teslimatlar</h2>
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          {teslimatlar.length} teslimat tamamlandı
        </span>
      </div>

      {teslimatlar.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-500 text-lg">Tamamlanan teslimat bulunmuyor</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sipariş No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Müşteri</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Adres</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tutar</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Saat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teslimatlar.map((teslimat) => (
                <tr key={teslimat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{teslimat.siparisNo}</td>
                  <td className="px-4 py-3">{teslimat.musteri}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {teslimat.adres.split(',')[0]}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">₺{teslimat.tutar}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{teslimat.siparisZamani}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 4. Kurye Durum Content
const KuryeDurumContent = ({ kuryeDurum, teslimatlar, konum, setActiveTab }) => {
  const toplamTeslimat = teslimatlar.length;
  const tamamlanan = teslimatlar.filter(t => t.durum === 'Teslim Edildi').length;
  const bekleyen = teslimatlar.filter(t => t.durum === 'Bekliyor').length;
  const yolda = teslimatlar.filter(t => t.durum === 'Yolda').length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">📊 Kurye Durumu</h2>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">{toplamTeslimat}</div>
          <div className="text-sm text-gray-500">Toplam Teslimat</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-yellow-600">{bekleyen}</div>
          <div className="text-sm text-gray-500">Bekleyen</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">{yolda}</div>
          <div className="text-sm text-gray-500">Yolda</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600">{tamamlanan}</div>
          <div className="text-sm text-gray-500">Tamamlanan</div>
        </div>
      </div>

      {/* Kurye Durumu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">🚴 Kurye Bilgileri</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Durum</span>
              <span className={`font-semibold ${
                kuryeDurum === 'Müsait' ? 'text-green-600' :
                kuryeDurum === 'Yolda' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {kuryeDurum}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bugünkü Teslimat</span>
              <span className="font-semibold">{tamamlanan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Toplam Kazanç</span>
              <span className="font-semibold text-green-600">
                ₺{teslimatlar
                  .filter(t => t.durum === 'Teslim Edildi')
                  .reduce((toplam, t) => toplam + t.tutar, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">📍 Konum Bilgisi</h3>
          {konum ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Enlem</span>
                <span className="font-mono">{konum.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Boylam</span>
                <span className="font-mono">{konum.lng.toFixed(6)}</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">📌 Aktif olarak takip ediliyorsunuz</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Konum bilgisi alınamadı</p>
          )}
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-4">⚡ Hızlı İşlemler</h3>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => setActiveTab('teslimatlar')}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            📦 Yeni Teslimatları Gör
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Bugünkü tüm teslimatları tamamladınız mı?')) {
                alert('✅ Bugünkü işlemler tamamlandı!');
              }
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ✅ Günü Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KuryePanel;