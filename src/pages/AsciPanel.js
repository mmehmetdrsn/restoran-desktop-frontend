// src/pages/AsciPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AsciPanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('siparisler');
  const [siparisler, setSiparisler] = useState([]);
  const [selectedSiparis, setSelectedSiparis] = useState(null);
  const [showDetayModal, setShowDetayModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [stokDurumu, setStokDurumu] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'asci') {
      navigate('/');
    }

    // Örnek sipariş verileri - Mutfağa gelen siparişler
    setSiparisler([
      { 
        id: 101, 
        masaNo: 3, 
        kaynak: 'QR', 
        urunler: [
          { ad: 'Pizza Margherita', adet: 2, not: 'Ekstra peynir' },
          { ad: 'Cola', adet: 1, not: '' }
        ],
        durum: 'Bekliyor',
        zaman: '12:30',
        ozelNot: 'Ekstra peynirli pizza lütfen'
      },
      { 
        id: 102, 
        masaNo: 5, 
        kaynak: 'Garson', 
        urunler: [
          { ad: 'Cheeseburger', adet: 1, not: 'Soğansız' },
          { ad: 'Patates Kızartması', adet: 1, not: '' }
        ],
        durum: 'Hazırlanıyor',
        zaman: '12:25',
        ozelNot: 'Soğansız burger'
      },
      { 
        id: 103, 
        masaNo: 2, 
        kaynak: 'Online', 
        urunler: [
          { ad: 'Caesar Salad', adet: 1, not: '' },
          { ad: 'Mercimek Çorbası', adet: 1, not: '' }
        ],
        durum: 'Bekliyor',
        zaman: '12:20',
        ozelNot: ''
      },
    ]);

    // Örnek stok verileri
    setStokDurumu([
      { id: 1, ad: 'Un', miktar: 50, birim: 'kg', kritik: 10 },
      { id: 2, ad: 'Et', miktar: 25, birim: 'kg', kritik: 5 },
      { id: 3, ad: 'Peynir', miktar: 15, birim: 'kg', kritik: 3 },
      { id: 4, ad: 'Sebze', miktar: 30, birim: 'kg', kritik: 5 },
      { id: 5, ad: 'Domates', miktar: 8, birim: 'kg', kritik: 3 },
      { id: 6, ad: 'Patates', miktar: 20, birim: 'kg', kritik: 5 },
    ]);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Sipariş durumu güncelle
  const siparisDurumuGuncelle = (siparisId, yeniDurum) => {
    setSiparisler(siparisler.map(siparis =>
      siparis.id === siparisId ? { ...siparis, durum: yeniDurum } : siparis
    ));
    
    const durumMesajlari = {
      'Hazırlanıyor': 'Sipariş hazırlanmaya başlandı 🍳',
      'Hazır': 'Sipariş hazır! Servise çıkabilir ✅',
      'İptal': 'Sipariş iptal edildi ❌'
    };
    
    alert(durumMesajlari[yeniDurum] || `Sipariş durumu: ${yeniDurum}`);
  };

  // Stok kontrolü
  const stokKontrol = (siparis) => {
    const yetersizStoklar = [];
    
    siparis.urunler.forEach(urun => {
      // Örnek: Her ürün için stok kontrolü
      const stokItem = stokDurumu.find(s => 
        s.ad.toLowerCase().includes(urun.ad.split(' ')[0].toLowerCase())
      );
      
      if (stokItem && stokItem.miktar < urun.adet * 0.5) {
        yetersizStoklar.push({
          urun: urun.ad,
          mevcut: stokItem.miktar,
          gerekli: urun.adet
        });
      }
    });

    if (yetersizStoklar.length > 0) {
      let mesaj = '⚠️ Aşağıdaki malzemelerde stok yetersiz:\n\n';
      yetersizStoklar.forEach(item => {
        mesaj += `• ${item.urun}: Mevcut ${item.mevcut}kg, Gerekli ${item.gerekli}kg\n`;
      });
      mesaj += '\nSiparişe devam etmek istiyor musunuz?';
      return window.confirm(mesaj);
    }
    
    return true;
  };

  // Sipariş hazırlama
  const siparisHazirla = (siparis) => {
    // Stok kontrolü
    if (!stokKontrol(siparis)) {
      return;
    }

    // Özel not kontrolü
    if (siparis.ozelNot) {
      const devam = window.confirm(
        `📝 Siparişte özel not var:\n"${siparis.ozelNot}"\n\nBu notu dikkate alarak hazırlayacak mısınız?`
      );
      if (!devam) return;
    }

    // Sipariş durumunu güncelle
    siparisDurumuGuncelle(siparis.id, 'Hazırlanıyor');
    
    // Simüle edilmiş hazırlık süresi
    setTimeout(() => {
      siparisDurumuGuncelle(siparis.id, 'Hazır');
      
      // Sipariş kaynağına göre bildirim
      if (siparis.kaynak === 'QR') {
        alert('✅ Sipariş hazır! Müşteriye QR ile bildirim gönderildi.');
      } else if (siparis.kaynak === 'Garson') {
        alert('✅ Sipariş hazır! Garsona bildirim gönderildi.');
      } else if (siparis.kaynak === 'Online') {
        alert('✅ Sipariş hazır! Müşteriye bildirim gönderildi.');
        // Online sipariş için kurye bildirimi
        if (siparis.teslimatTuru === 'Eve Teslim') {
          alert('🚴 Kuryeye bildirim gönderildi.');
        } else {
          alert('🏪 Müşteriye gel-al bildirimi gönderildi.');
        }
      }
    }, 3000);
  };

  // Sipariş detayını göster
  const siparisDetayGoster = (siparis) => {
    setSelectedSiparis(siparis);
    setShowDetayModal(true);
  };

  // Menü items
  const menuItems = [
    { id: 'siparisler', label: ' Siparişler', icon: '📋' },
    { id: 'hazirlanan', label: 'Hazırlananlar', icon: '🍳' },
    { id: 'stok', label: 'Stok Durumu', icon: '📦' },
    { id: 'tamamlanan', label: 'Tamamlananlar', icon: '✅' },
  ];

  // Aktif tab'e göre içerik render et
  const renderContent = () => {
    switch(activeTab) {
      case 'siparisler':
        return <SiparislerContent 
          siparisler={siparisler.filter(s => s.durum === 'Bekliyor')} 
          siparisDetayGoster={siparisDetayGoster}
          siparisHazirla={siparisHazirla}
        />;
      case 'hazirlanan':
        return <HazirlananContent 
          siparisler={siparisler.filter(s => s.durum === 'Hazırlanıyor')} 
          siparisDetayGoster={siparisDetayGoster}
          siparisDurumuGuncelle={siparisDurumuGuncelle}
        />;
      case 'stok':
        return <StokContent stokDurumu={stokDurumu} />;
      case 'tamamlanan':
        return <TamamlananContent siparisler={siparisler.filter(s => s.durum === 'Hazır')} />;
      default:
        return <SiparislerContent 
          siparisler={siparisler.filter(s => s.durum === 'Bekliyor')} 
          siparisDetayGoster={siparisDetayGoster}
          siparisHazirla={siparisHazirla}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sipariş Detay Modal */}
      {showDetayModal && selectedSiparis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">📋 Sipariş Detayı</h3>
              <button
                onClick={() => {
                  setShowDetayModal(false);
                  setSelectedSiparis(null);
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
                  <p className="font-semibold">#{selectedSiparis.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Masa</p>
                  <p className="font-semibold">Masa {selectedSiparis.masaNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kaynak</p>
                  <p className="font-semibold">
                    {selectedSiparis.kaynak === 'QR' && '📱 QR Kod'}
                    {selectedSiparis.kaynak === 'Garson' && '👨‍🍳 Garson'}
                    {selectedSiparis.kaynak === 'Online' && '💻 Online'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zaman</p>
                  <p className="font-semibold">{selectedSiparis.zaman}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Ürünler</p>
                <div className="space-y-2">
                  {selectedSiparis.urunler.map((urun, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-medium">{urun.ad}</p>
                        <p className="text-sm text-gray-500">Adet: {urun.adet}</p>
                        {urun.not && (
                          <p className="text-sm text-blue-600 mt-1">📝 Not: {urun.not}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSiparis.ozelNot && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">📝 Sipariş Özel Notu:</p>
                  <p className="text-yellow-700">{selectedSiparis.ozelNot}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    siparisHazirla(selectedSiparis);
                    setShowDetayModal(false);
                    setSelectedSiparis(null);
                  }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  🍳 Hazırlamaya Başla
                </button>
                <button
                  onClick={() => {
                    setShowDetayModal(false);
                    setSelectedSiparis(null);
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

      {/* Sol Menü */}
      <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4 border-b bg-orange-600">
          <h2 className="text-xl font-bold text-white">🍳 Aşçı Paneli</h2>
          <p className="text-sm text-orange-100 mt-1">{user?.email}</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id 
                  ? 'bg-orange-50 text-orange-700 font-medium' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
              {item.id === 'siparisler' && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {siparisler.filter(s => s.durum === 'Bekliyor').length}
                </span>
              )}
              {item.id === 'hazirlanan' && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {siparisler.filter(s => s.durum === 'Hazırlanıyor').length}
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
              {menuItems.find(item => item.id === activeTab)?.label || 'Aşçı'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Aşçı
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

// 1. Siparişler Content (Bekleyen Siparişler)
const SiparislerContent = ({ siparisler, siparisDetayGoster, siparisHazirla }) => {
  const kaynakIcon = {
    'QR': '📱',
    'Garson': '👨‍🍳',
    'Online': '💻'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📋 Bekleyen Siparişler</h2>
        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          {siparisler.length} sipariş bekliyor
        </span>
      </div>

      {siparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">Bekleyen sipariş bulunmuyor</p>
          <p className="text-gray-400 text-sm">Yeni siparişler burada görünecek</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {siparisler.map((siparis) => (
            <div key={siparis.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">Sipariş #{siparis.id}</div>
                  <div className="text-sm text-gray-600">
                    {kaynakIcon[siparis.kaynak] || '📋'} {siparis.kaynak} • Masa {siparis.masaNo} • {siparis.zaman}
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  ⏳ Bekliyor
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {siparis.urunler.map((urun, index) => (
                  <div key={index} className="text-sm flex justify-between items-center">
                    <span>
                      {urun.ad} <span className="text-gray-500">x{urun.adet}</span>
                    </span>
                    {urun.not && (
                      <span className="text-blue-500 text-xs">📝 {urun.not}</span>
                    )}
                  </div>
                ))}
              </div>

              {siparis.ozelNot && (
                <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm mb-3">
                  <span className="text-yellow-800">📝 {siparis.ozelNot}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => siparisDetayGoster(siparis)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Detay
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Sipariş #${siparis.id} hazırlanmaya başlansın mı?`)) {
                      siparisHazirla(siparis);
                    }
                  }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  🍳 Hazırla
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Hazırlananlar Content
const HazirlananContent = ({ siparisler, siparisDetayGoster, siparisDurumuGuncelle }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">🍳 Hazırlanan Siparişler</h2>
        <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg">
          {siparisler.length} sipariş hazırlanıyor
        </span>
      </div>

      {siparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔪</div>
          <p className="text-gray-500 text-lg">Hazırlanan sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {siparisler.map((siparis) => (
            <div key={siparis.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">Sipariş #{siparis.id}</div>
                  <div className="text-sm text-gray-600">Masa {siparis.masaNo} • {siparis.zaman}</div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm animate-pulse">
                  🍳 Hazırlanıyor
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {siparis.urunler.map((urun, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{urun.ad} <span className="text-gray-500">x{urun.adet}</span></span>
                    {urun.not && <span className="text-blue-500 text-xs">📝 {urun.not}</span>}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => siparisDetayGoster(siparis)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Detay
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Sipariş #${siparis.id} hazır mı?`)) {
                      siparisDurumuGuncelle(siparis.id, 'Hazır');
                    }
                  }}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  ✅ Hazır
                </button>
              </div>

              {/* İlerleme çubuğu */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Hazırlanıyor...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Stok Durumu Content
const StokContent = ({ stokDurumu }) => {
  const getStokDurumu = (miktar, kritik) => {
    if (miktar <= kritik) return { text: 'Kritik', color: 'bg-red-100 text-red-800' };
    if (miktar <= kritik * 2) return { text: 'Düşük', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Yeterli', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📦 Stok Durumu</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          🔄 Stok Güncelle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stokDurumu.map((item) => {
          const durum = getStokDurumu(item.miktar, item.kritik);
          const yuzde = Math.min((item.miktar / (item.kritik * 3)) * 100, 100);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{item.ad}</h3>
                  <p className="text-sm text-gray-500">
                    {item.miktar} {item.birim}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${durum.color}`}>
                  {durum.text}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      durum.text === 'Kritik' ? 'bg-red-500' :
                      durum.text === 'Düşük' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${yuzde}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Kritik seviye: {item.kritik} {item.birim}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700">💡 Stok Durumu Göstergeleri:</p>
        <div className="flex gap-4 mt-2">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Yeterli
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Düşük
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Kritik
          </span>
        </div>
      </div>
    </div>
  );
};

// 4. Tamamlananlar Content
const TamamlananContent = ({ siparisler }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">✅ Tamamlanan Siparişler</h2>
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          {siparisler.length} sipariş tamamlandı
        </span>
      </div>

      {siparisler.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-500 text-lg">Tamamlanan sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sipariş No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Masa</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ürünler</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kaynak</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {siparisler.map((siparis) => (
                <tr key={siparis.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{siparis.id}</td>
                  <td className="px-4 py-3">Masa {siparis.masaNo}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {siparis.urunler.map((urun, index) => (
                        <div key={index} className="text-sm">
                          {urun.ad} x{urun.adet}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {siparis.kaynak === 'QR' && '📱 QR'}
                      {siparis.kaynak === 'Garson' && '👨‍🍳 Garson'}
                      {siparis.kaynak === 'Online' && '💻 Online'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{siparis.zaman}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AsciPanel;