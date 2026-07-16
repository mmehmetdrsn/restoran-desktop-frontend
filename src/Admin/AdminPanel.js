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
  FaClock, FaFire, FaArrowRight, FaList, FaWarehouse,
  FaChair, FaUserPlus, FaUserMinus, FaUserEdit, FaUserCheck,
  FaCreditCard, FaHistory, FaExchangeAlt, FaPlusCircle,
  FaMinusCircle, FaTruck, FaCheckDouble, FaCalendarCheck,
  FaUserCog, FaUserTimes, FaShieldAlt, FaUmbrella,
  FaStar, FaPizzaSlice, FaWineBottle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  const [userData, setUserData] = useState({
    name: 'Admin',
    email: 'admin@restoran.com',
    role: 'admin'
  });

  // Önceki günün tarihi
  const getPreviousDay = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 42850,
    totalOrders: 342,
    date: getPreviousDay()
  });

  const [topProducts, setTopProducts] = useState([
    { name: 'Adana Kebap', quantity: 145, revenue: 34800 },
    { name: 'Lahmacun', quantity: 280, revenue: 19600 },
    { name: 'Künefe', quantity: 98, revenue: 14700 },
    { name: 'Mercimek Çorbası', quantity: 112, revenue: 6720 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: '#1482', table: 'Masa 12', content: '2x Adana, 1x Künefe...', time: '14:23', amount: 840, status: 'Tamamlandı' },
    { id: '#1481', table: 'Masa 5', content: '3x Lahmacun, 2x Ayran', time: '14:15', amount: 560, status: 'Hazırlanıyor' },
    { id: '#1480', table: 'Masa 8', content: '1x Mercimek, 1x Adana', time: '14:02', amount: 320, status: 'Bekliyor' },
    { id: '#1479', table: 'Masa 3', content: '2x Künefe, 1x Çay', time: '13:48', amount: 210, status: 'Tamamlandı' }
  ]);

  // Sidebar menü öğeleri
  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, title: 'Genel Bakış' },
    { id: 'product_menu', icon: <FaUtensils />, title: 'Ürün ve Menü Yönetimi' },
    { id: 'members', icon: <FaUsers />, title: 'Üye Yönetimi' },
    { id: 'finance', icon: <FaMoneyBillWave />, title: 'Finans ve Kasa Yönetimi' },
    { id: 'stock', icon: <FaBoxes />, title: 'Depo / Stok Yönetimi' },
    { id: 'orders', icon: <FaClipboardList />, title: 'Sipariş Yönetimi' },
    { id: 'tables', icon: <FaTable />, title: 'Masa ve Rezervasyon Yönetimi' },
    { id: 'personnel', icon: <FaUserCog />, title: 'Personel Yönetimi' },
    { id: 'reports', icon: <FaChartBar />, title: 'Raporlar ve İstatistikler Yönetimi' }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchUserData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
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

  // ============ BUTON BİLEŞENİ ============
  const ActionButton = ({ icon, label, onClick }) => (
    <button 
      onClick={onClick || (() => {})}
      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-all border border-white/5 hover:border-white/20 w-full"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl text-yellow-500">{icon}</div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
    </div>
  );

  // ============ DASHBOARD ============
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
        {/* Restoran Özeti */}
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-2">{dashboardData.date} - Restoran Özeti</h2>
          <p className="text-gray-400 text-sm mb-4">İşletmenizin geçmiş gün verileri</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-gray-400 text-xs">Toplam Ciro</p>
              <p className="text-white text-3xl font-bold">₺{dashboardData.totalRevenue.toLocaleString()}</p>
              <p className="text-green-500 text-xs mt-1">↑ %12</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-gray-400 text-xs">Toplam Sipariş</p>
              <p className="text-white text-3xl font-bold">{dashboardData.totalOrders}</p>
              <p className="text-green-500 text-xs mt-1">↑ %8</p>
            </div>
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

  // ============ ÜRÜN VE MENÜ YÖNETİMİ ============
  const renderProductMenu = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaUtensils />} title="Ürün ve Menü Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Ürün ve menü işlemlerinizi buradan yönetin.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionButton icon={<FaPlus />} label="Ürün Ekle" />
        <ActionButton icon={<FaTrash />} label="Ürün Sil" />
        <ActionButton icon={<FaEdit />} label="Ürün Düzenle" />
        <ActionButton icon={<FaList />} label="Ürün Listele" />
        <ActionButton icon={<FaPizzaSlice />} label="Menü Listele" />
      </div>

      {/* Kategori Yönetimi Butonları */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs mb-3">Kategori İşlemleri</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ActionButton icon={<FaPlusCircle />} label="Kategori Ekle" />
          <ActionButton icon={<FaTrash />} label="Kategori Sil" />
          <ActionButton icon={<FaEdit />} label="Kategori Düzenle" />
          <ActionButton icon={<FaList />} label="Kategori Listele" />
        </div>
      </div>
    </div>
  );

  // ============ ÜYE YÖNETİMİ ============
  const renderMembers = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaUsers />} title="Üye Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel ve müşteri üye işlemlerini yönetin.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionButton icon={<FaUserPlus />} label="Üye Ekle" />
        <ActionButton icon={<FaUserMinus />} label="Üye Sil" />
        <ActionButton icon={<FaUserEdit />} label="Üye Düzenle" />
        <ActionButton icon={<FaList />} label="Üye Listele" />
        <ActionButton icon={<FaEye />} label="Üye Detay" />
      </div>
    </div>
  );

  // ============ FİNANS VE KASA YÖNETİMİ ============
  const renderFinance = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaMoneyBillWave />} title="Finans ve Kasa Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Kasa hareketleri ve finansal işlemler.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaHistory />} label="Ödeme Geçmişi" />
        <ActionButton icon={<FaCheckDouble />} label="Gün Sonu İşlemleri" />
        <ActionButton icon={<FaUndo />} label="Ödeme İade İşlemleri" />
        <ActionButton icon={<FaExchangeAlt />} label="Kasa Hareketleri" />
      </div>
    </div>
  );

  // ============ DEPO / STOK YÖNETİMİ ============
  const renderStock = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaBoxes />} title="Depo / Stok Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Stok seviyeleri ve malzeme işlemleri.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaWarehouse />} label="Güncel Stok Durumları" />
        <ActionButton icon={<FaPlusCircle />} label="Malzeme Giriş" />
        <ActionButton icon={<FaMinusCircle />} label="Malzeme Çıkış" />
        <ActionButton icon={<FaTruck />} label="Malzeme Sipariş" />
      </div>
    </div>
  );

  // ============ SİPARİŞ YÖNETİMİ ============
  const renderOrders = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaClipboardList />} title="Sipariş Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Aktif siparişler ve sipariş işlemleri.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaShoppingCart />} label="Aktif Siparişleri Göster" />
        <ActionButton icon={<FaEye />} label="Sipariş Detay İşlemleri" />
        <ActionButton icon={<FaHistory />} label="Sipariş Geçmişi" />
        <ActionButton icon={<FaUndo />} label="Sipariş İade ve İptal" />
      </div>
    </div>
  );

  // ============ MASA VE REZERVASYON YÖNETİMİ ============
  const renderTables = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaTable />} title="Masa ve Rezervasyon Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Masa ve rezervasyon işlemlerini yönetin.</p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionButton icon={<FaPlus />} label="Masa Ekle" />
          <ActionButton icon={<FaTrash />} label="Masa Sil" />
          <ActionButton icon={<FaEdit />} label="Masa Düzenle" />
          <ActionButton icon={<FaChair />} label="Masa Planı" />
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs mb-3">Rezervasyon İşlemleri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ActionButton icon={<FaCalendarCheck />} label="Rezervasyon Ekle" />
            <ActionButton icon={<FaTrash />} label="Rezervasyon Sil" />
            <ActionButton icon={<FaEdit />} label="Rezervasyon Düzenle" />
            <ActionButton icon={<FaList />} label="Rezervasyon Listele" />
          </div>
        </div>
      </div>
    </div>
  );

  // ============ PERSONEL YÖNETİMİ ============
  const renderPersonnel = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaUserCog />} title="Personel Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel işlemleri ve yetki yönetimi.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionButton icon={<FaUserPlus />} label="Personel Ekle" />
        <ActionButton icon={<FaUserEdit />} label="Personel Düzenle" />
        <ActionButton icon={<FaUserMinus />} label="Personel Sil" />
        <ActionButton icon={<FaShieldAlt />} label="Rol / Yetki Yönetimi" />
        <ActionButton icon={<FaUmbrella />} label="İzin Yönetimi" />
      </div>
    </div>
  );

// ============ RAPORLAR VE İSTATİSTİKLER ============
const renderReports = () => (
  <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <SectionHeader icon={<FaChartBar />} title="Raporlar ve İstatistikler" />
    <p className="text-gray-400 text-sm mb-6">İşletmenizin tüm rapor ve istatistiklerine buradan ulaşın.</p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ActionButton 
        icon={<FaChartLine />} 
        label="Günlük Satış Raporları" 
      />
      <ActionButton 
        icon={<FaPizzaSlice />} 
        label="Ürün Satış Raporu" 
      />
      <ActionButton 
        icon={<FaCalendarCheck />} 
        label="Rezervasyon Raporu" 
      />
      <ActionButton 
        icon={<FaMoneyBillWave />} 
        label="Gelir İstatistikleri" 
      />
    </div>

    {/* Rapor önizleme alanı - backend entegrasyonu için hazır */}
    <div className="mt-6 p-8 bg-white/5 rounded-xl border border-white/5 text-center">
      <p className="text-gray-500 text-sm">📊 Raporlar burada görüntülenecek</p>
      <p className="text-gray-600 text-xs mt-1">Backend entegrasyonu için hazır</p>
    </div>
  </div>
);

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    if (selectedMenu === 'dashboard') return renderDashboard();
    if (selectedMenu === 'product_menu') return renderProductMenu();
    if (selectedMenu === 'members') return renderMembers();
    if (selectedMenu === 'finance') return renderFinance();
    if (selectedMenu === 'stock') return renderStock();
    if (selectedMenu === 'orders') return renderOrders();
    if (selectedMenu === 'tables') return renderTables();
    if (selectedMenu === 'personnel') return renderPersonnel();
    if (selectedMenu === 'reports') return renderReports();
    
    return renderDashboard();
  };

  // ============ ANA RENDER ============
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