// src/pages/AdminPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Menü items
  const menuItems = [
    { id: 'dashboard', label: ' Dashboard', icon: '📊' },
    { id: 'masa', label: ' Masa ve Rezervasyon', icon: '🪑' },
    { id: 'kategori', label: ' Kategori Yönetimi', icon: '📂' },
    { id: 'urun', label: ' Ürün ve Menü Yönetimi', icon: '🍽️' },
    { id: 'siparis', label: ' Siparişler Yönetimi', icon: '📦' },
    { id: 'personel', label: ' Personel Yönetimi', icon: '👥' },
    { id: 'finans', label: ' Finans ve Kasa Yönetimi', icon: '💰' },
    { id: 'rapor', label: ' Raporlar ve İstatistikler', icon: '📈' },
    { id: 'depo', label: ' Depo/Stok Yönetimi', icon: '📦' },
  ];

  // Aktif tab'e göre içerik render et
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'masa':
        return <MasaRezervasyonContent />;
      case 'kategori':
        return <KategoriYonetimContent />;
      case 'urun':
        return <UrunMenuContent />;
      case 'siparis':
        return <SiparisYonetimContent />;
      case 'personel':
        return <PersonelYonetimContent />;
      case 'finans':
        return <FinansKasaContent />;
      case 'rapor':
        return <RaporIstatistikContent />;
      case 'depo':
        return <DepoStokContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sol Menü */}
      <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">🍽️ Restoran Yönetim</h2>
          <p className="text-sm text-gray-600 mt-1">Admin Paneli</p>
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
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                👤 {user?.email}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Admin
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

// 1. Dashboard Content
const DashboardContent = () => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-2xl font-bold text-blue-600">₺45,890</div>
        <div className="text-gray-600 text-sm">Bugünkü Ciro</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">156</div>
        <div className="text-gray-600 text-sm">Bugünkü Sipariş</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">12</div>
        <div className="text-gray-600 text-sm">Aktif Personel</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-2xl font-bold text-orange-600">6</div>
        <div className="text-gray-600 text-sm">Dolu Masa</div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Son Siparişler</h3>
      <div className="space-y-2">
        <div className="flex justify-between p-2 border-b">
          <span>Masa 5 - 2x Pizza</span>
          <span className="text-green-600">₺120</span>
        </div>
        <div className="flex justify-between p-2 border-b">
          <span>Masa 3 - 1x Burger</span>
          <span className="text-green-600">₺85</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Masa ve Rezervasyon Content
const MasaRezervasyonContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🪑 Masa Planı</h3>
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
          <div key={num} className={`p-4 text-center rounded-lg border-2 ${num % 2 === 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="font-bold">Masa {num}</div>
            <div className="text-xs text-gray-500">{num % 2 === 0 ? '🟢 Dolu' : '🟡 Boş'}</div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📅 Rezervasyon İşlemleri</h3>
        <div className="space-y-3">
          <div className="flex justify-between p-2 border-b">
            <div>
              <div className="font-medium">Ahmet Yılmaz</div>
              <div className="text-sm text-gray-500">20:00 - Masa 4</div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Bekliyor</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <div>
              <div className="font-medium">Ayşe Demir</div>
              <div className="text-sm text-gray-500">19:30 - Masa 7</div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Onaylandı</span>
          </div>
          <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Yeni Rezervasyon
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">⚙️ Masa Ekle/Düzenle/Sil</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            ➕ Masa Ekle
          </button>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ✏️ Masa Düzenle
          </button>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            🗑️ Masa Sil
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 3. Kategori Yönetimi Content
const KategoriYonetimContent = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">📂 Kategori Yönetimi</h3>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Yeni Kategori
      </button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {['Ana Yemekler', 'Ara Sıcaklar', 'Salatalar', 'İçecekler', 'Tatlılar', 'Çorbalar'].map((cat, i) => (
        <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
          <span>{cat}</span>
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-800">✏️</button>
            <button className="text-red-600 hover:text-red-800">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 4. Ürün ve Menü Yönetimi Content
const UrunMenuContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🍽️ Ürün Listele</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Yeni Ürün
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Ürün Adı</th>
            <th className="text-left p-2">Kategori</th>
            <th className="text-left p-2">Fiyat</th>
            <th className="text-left p-2">Durum</th>
            <th className="text-left p-2">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {['Pizza Margherita', 'Cheeseburger', 'Caesar Salad', 'Cola', 'Tiramisu'].map((item, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{item}</td>
              <td className="p-2">{['Ana Yemek', 'Ana Yemek', 'Salata', 'İçecek', 'Tatlı'][i]}</td>
              <td className="p-2">₺{['95', '85', '65', '30', '55'][i]}</td>
              <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aktif</span></td>
              <td className="p-2 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">✏️</button>
                <button className="text-red-600 hover:text-red-800">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📤 Ürün Yapılış</h3>
        <p className="text-gray-600">Ürün oluşturma ve düzenleme işlemleri</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">⚡ Ürün İşlem Yapılış</h3>
        <p className="text-gray-600">Ürün silme ve güncelleme işlemleri</p>
      </div>
    </div>
  </div>
);

// 5. Siparişler Yönetimi Content
const SiparisYonetimContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📦 Siparişler Yönetimi</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Aktif</button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Geçmiş</button>
        </div>
      </div>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">Sipariş #{i}00{i}</div>
              <div className="text-sm text-gray-500">Masa 3 - 2 ürün</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Hazırlanıyor</span>
              <span className="font-semibold">₺{i}80</span>
              <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">Tamamla</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">📜 Sipariş Geçmişi</h3>
      <p className="text-gray-600">Tüm geçmiş siparişleri görüntüle</p>
    </div>
  </div>
);

// 6. Personel Yönetimi Content
const PersonelYonetimContent = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">👥 Personel Yönetimi</h3>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Personel Ekle
      </button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[
        { name: 'Ahmet Garson', role: 'Garson', status: 'Aktif' },
        { name: 'Mehmet Aşçı', role: 'Aşçı', status: 'Aktif' },
        { name: 'Ayşe Kurye', role: 'Kurye', status: 'İzinli' },
      ].map((person, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="font-medium">{person.name}</div>
          <div className="text-sm text-gray-500">{person.role}</div>
          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
            person.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {person.status}
          </span>
          <div className="flex gap-2 mt-3">
            <button className="text-blue-600 hover:text-blue-800">✏️</button>
            <button className="text-red-600 hover:text-red-800">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 7. Finans ve Kasa Yönetimi Content
const FinansKasaContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">💰 Günlük Satış Raporları</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Nakit</span>
            <span className="font-semibold">₺12,450</span>
          </div>
          <div className="flex justify-between">
            <span>Kredi Kartı</span>
            <span className="font-semibold">₺25,800</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-bold">Toplam</span>
            <span className="font-bold">₺38,250</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📊 Gün Sonu (Kasa Kapatma)</h3>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Günü Kapat
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">💳 Ödeme Geçmişi</h3>
        <p className="text-gray-600">Tüm ödeme işlemlerini görüntüle</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔄 Ödeme İade İşlemi</h3>
        <p className="text-gray-600">İade işlemleri yönetimi</p>
      </div>
    </div>
  </div>
);

// 8. Raporlar ve İstatistikler Content
const RaporIstatistikContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Aylık Gelir</h4>
        <div className="text-2xl font-bold text-green-600">₺145,200</div>
        <div className="text-sm text-green-500">↑ %12.5 artış</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Toplam Sipariş</h4>
        <div className="text-2xl font-bold text-blue-600">1,247</div>
        <div className="text-sm text-blue-500">↑ %8.3 artış</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Müşteri Memnuniyeti</h4>
        <div className="text-2xl font-bold text-purple-600">4.8 ⭐</div>
        <div className="text-sm text-purple-500">↑ %0.5 artış</div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">📈 Gelir İstatistikleri</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-400">Grafik alanı (Chart.js entegre edilebilir)</p>
      </div>
    </div>
  </div>
);

// 9. Depo/Stok Yönetimi Content
const DepoStokContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">📦 Güncel Stok Durumu</h3>
      <div className="grid grid-cols-4 gap-4">
        {[
          { name: 'Un', amount: '50kg', status: 'Yeterli' },
          { name: 'Et', amount: '25kg', status: 'Kritik' },
          { name: 'Peynir', amount: '15kg', status: 'Orta' },
          { name: 'Sebze', amount: '30kg', status: 'Yeterli' },
        ].map((item, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500">{item.amount}</div>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
              item.status === 'Kritik' ? 'bg-red-100 text-red-800' :
              item.status === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📥 Malzeme Giriş/Çıkış</h3>
        <button className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Malzeme Girişi
        </button>
        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Malzeme Çıkışı
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🛒 Malzeme Siparişi</h3>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Yeni Sipariş Oluştur
        </button>
      </div>
    </div>
  </div>
);

export default AdminPanel;