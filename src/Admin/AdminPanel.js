// src/pages/AdminPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaUser, FaUsers, FaUtensils, FaClipboardList, 
  FaCog, FaChartBar, FaBoxes, FaMoneyBillWave, FaTable, 
  FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaChevronRight, FaHome, FaBell, FaEnvelope,
  FaShoppingCart, FaDollarSign, FaAngleDown, FaBars,
  FaTimes, FaKey, FaLock, FaEyeSlash, FaSpinner,
  FaLayerGroup, FaReceipt, FaUndo, FaChartLine, FaFileAlt,
  FaClock, FaFire, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Kullanıcı bilgileri
  const [userData, setUserData] = useState({
    name: 'Admin',
    email: 'admin@restoran.com',
    role: 'admin'
  });

  // Dashboard verileri
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 42850,
    totalOrders: 342,
    activeTables: '18/24',
    avgPrepTime: 14,
    revenueChange: 12,
    ordersChange: 8
  });

  // En çok satanlar
  const [topProducts, setTopProducts] = useState([
    { name: 'Adana Kebap', quantity: 145, revenue: 34800 },
    { name: 'Lahmacun', quantity: 280, revenue: 19600 },
    { name: 'Künefe', quantity: 98, revenue: 14700 },
    { name: 'Mercimek Çorbası', quantity: 112, revenue: 6720 }
  ]);

  // Son siparişler
  const [recentOrders, setRecentOrders] = useState([
    { id: '#1482', table: 'Masa 12', content: '2x Adana, 1x Künefe...', time: '14:23', amount: 840, status: 'Tamamlandı' },
    { id: '#1481', table: 'Masa 5', content: '3x Lahmacun, 2x Ayran', time: '14:15', amount: 560, status: 'Hazırlanıyor' },
    { id: '#1480', table: 'Masa 8', content: '1x Mercimek, 1x Adana', time: '14:02', amount: 320, status: 'Bekliyor' },
    { id: '#1479', table: 'Masa 3', content: '2x Künefe, 1x Çay', time: '13:48', amount: 210, status: 'Tamamlandı' }
  ]);

  // Saatlik satış verileri
  const hourlySales = [10, 15, 25, 35, 45, 55, 65, 70, 60, 50, 40, 30];
  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  // Sidebar menü öğeleri
  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, title: 'Genel Bakış', subtitle: 'Özet gösterge paneli' },
    { id: 'products', icon: <FaUtensils />, title: 'Ürün Yönetimi', subtitle: 'Ekle, güncelle, sil, liste' },
    { id: 'categories', icon: <FaLayerGroup />, title: 'Kategori Yönetimi', subtitle: 'Menü kategorilerini düzenle' },
    { id: 'members', icon: <FaUsers />, title: 'Üye Yönetimi', subtitle: 'Personel ve müşteri kayıtları' },
    { id: 'finance', icon: <FaMoneyBillWave />, title: 'Kasa Yönetimi', subtitle: 'Kasa hareketleri, kapatma...' },
    { id: 'stock', icon: <FaBoxes />, title: 'Depo / Stok Yönetimi', subtitle: 'Stok seviyeleri ve girişler' },
    { id: 'refunds', icon: <FaUndo />, title: 'İade Yönetimi', subtitle: 'İade / iptal talepleri ve geç...' },
    { id: 'reports', icon: <FaChartBar />, title: 'Satış Raporları', subtitle: 'Günlük ve ürün bazlı raporlar' }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchUserData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock veriler zaten set edildi
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || 'Admin',
          email: parsed.email || 'admin@restoran.com',
          role: parsed.role || 'admin'
        });
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    toast.success('Başarıyla çıkış yapıldı!');
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Yeni şifre en az 6 karakter olmalıdır!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor!');
      return;
    }

    setPasswordLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Şifreniz başarıyla değiştirildi! 🎉');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Şifre değiştirilemedi!');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Tamamlandı': return 'bg-green-500/20 text-green-400';
      case 'Hazırlanıyor': return 'bg-yellow-500/20 text-yellow-400';
      case 'Bekliyor': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Veriler yükleniyor...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Yönetim Paneli Başlığı */}
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h1 className="text-2xl font-bold text-white">Yönetim Paneli</h1>
          <p className="text-gray-400 text-sm">Yönetimin yapabileceği tüm işlemler</p>
        </div>

        {/* Restoran Özeti */}
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Restoran Özeti</h2>
          <p className="text-gray-400 text-sm mb-4">İşletmenizin anlık durumu ve performans metrikleri.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Toplam Ciro</p>
              <p className="text-white text-2xl font-bold">₺{dashboardData.totalRevenue.toLocaleString()}</p>
              <p className="text-green-500 text-xs mt-1">↑ %{dashboardData.revenueChange}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Toplam Sipariş</p>
              <p className="text-white text-2xl font-bold">{dashboardData.totalOrders}</p>
              <p className="text-green-500 text-xs mt-1">↑ %{dashboardData.ordersChange}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Aktif Masalar</p>
              <p className="text-white text-2xl font-bold">{dashboardData.activeTables}</p>
              <p className="text-yellow-500 text-xs mt-1">%75 dolu</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Ort. Hazırlık Süresi</p>
              <p className="text-white text-2xl font-bold">{dashboardData.avgPrepTime} dk</p>
              <p className="text-green-500 text-xs mt-1">↓ %5</p>
            </div>
          </div>
        </div>

        {/* Saatlik Satış Grafiği */}
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Saatlik Satış Grafiği</h2>
          <div className="h-48 flex items-end gap-2">
            {hourlySales.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500/50 to-blue-400/80 rounded-t transition-all duration-500 hover:from-blue-400 hover:to-blue-300"
                  style={{ height: `${(value / 70) * 100}%` }}
                />
                <span className="text-gray-500 text-[10px]">{hours[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* En Çok Satanlar ve Son Siparişler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* En Çok Satanlar */}
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">En Çok Satanlar</h2>
              <FaFire className="text-orange-500" />
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {index + 1}. {product.name}
                    </p>
                    <p className="text-gray-400 text-xs">{product.quantity} porsiyon</p>
                  </div>
                  <p className="text-white font-semibold">₺{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-all">
              Tüm Menüyü Gör
              <FaArrowRight size={12} />
            </button>
          </div>

          {/* Son Siparişler */}
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Son Siparişler</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-white/5">
                    <th className="text-left py-2 px-2">Sipariş No</th>
                    <th className="text-left py-2 px-2">Masa/Tür</th>
                    <th className="text-left py-2 px-2">İçerik</th>
                    <th className="text-left py-2 px-2">Saat</th>
                    <th className="text-left py-2 px-2">Tutar</th>
                    <th className="text-left py-2 px-2">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 px-2 text-white text-xs">{order.id}</td>
                      <td className="py-2 px-2 text-gray-300 text-xs">{order.table}</td>
                      <td className="py-2 px-2 text-gray-400 text-xs">{order.content}</td>
                      <td className="py-2 px-2 text-gray-400 text-xs">{order.time}</td>
                      <td className="py-2 px-2 text-white text-xs font-medium">₺{order.amount}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded text-[10px] ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedMenu === 'dashboard') {
      return renderDashboard();
    }

    const menuItem = menuItems.find(item => item.id === selectedMenu);
    if (!menuItem) return renderDashboard();

    return (
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl text-gray-500">{menuItem.icon}</div>
          <div>
            <h2 className="text-white text-2xl font-bold">{menuItem.title}</h2>
            <p className="text-gray-400">{menuItem.subtitle}</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📌 {menuItem.title} modülü</p>
          <p className="text-gray-600 text-sm mt-2">Backend entegrasyonu için hazır</p>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative lg:flex lg:flex-col
          ${sidebarOpen ? 'w-72' : 'w-20'}
          bg-black/90 backdrop-blur-sm border-r border-white/10
          h-screen transition-all duration-300 overflow-y-auto
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-50 flex-shrink-0
        `}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="text-3xl">🍽️</div>
                <div>
                  <h1 className="text-white font-bold text-lg">SekerRestoran</h1>
                  <p className="text-gray-400 text-[10px]">{userData.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-3xl mx-auto">🍽️</div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white hidden lg:block"
            >
              {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="py-4 px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedMenu(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${selectedMenu === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  ${!sidebarOpen && 'justify-center'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                  </div>
                )}
              </button>
            ))}

            <div className="border-t border-white/10 my-3"></div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                text-gray-400 hover:text-white hover:bg-white/5
                ${!sidebarOpen && 'justify-center'}
              `}
            >
              <FaKey size={18} />
              {sidebarOpen && <span className="text-sm">Şifre Değiştir</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                text-red-400 hover:text-red-300 hover:bg-red-500/10
                ${!sidebarOpen && 'justify-center'}
              `}
            >
              <FaSignOutAlt size={18} />
              {sidebarOpen && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-black/80 backdrop-blur-sm rounded-lg text-white"
        >
          <FaBars size={20} />
        </button>

        {mobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
                >
                  <FaKey size={14} />
                  <span className="hidden sm:inline">Şifre Değiştir</span>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <FaBell size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">3</span>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FaEnvelope size={18} />
                </button>
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">{userData.name}</p>
                  <p className="text-gray-400 text-[10px]">{userData.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-6">
            {renderContent()}
          </div>

          <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <p className="text-gray-400 text-[10px] text-center">
                © 2024 SekerRestoran Yönetim Sistemi | Yönetim Paneli
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-gray-400"><FaKey /></div>
                <div>
                  <h2 className="text-white font-bold text-lg">Şifre Değiştir</h2>
                  <p className="text-gray-400 text-xs">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Mevcut Şifre</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                    placeholder="Mevcut şifrenizi girin"
                    disabled={passwordLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                    placeholder="Yeni şifrenizi girin (min 6 karakter)"
                    disabled={passwordLoading}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre Tekrar</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                    placeholder="Yeni şifrenizi tekrar girin"
                    disabled={passwordLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all text-sm"
                  disabled={passwordLoading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Değiştiriliyor...
                    </>
                  ) : (
                    'Şifreyi Değiştir'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;