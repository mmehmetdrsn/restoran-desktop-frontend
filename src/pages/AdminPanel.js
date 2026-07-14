// src/pages/AdminPanel.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaUser, FaUsers, FaUtensils, FaClipboardList, 
  FaCog, FaChartBar, FaBoxes, FaMoneyBillWave, FaTable, 
  FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaChevronRight, FaHome, FaBell, FaEnvelope,
  FaShoppingCart, FaDollarSign, FaAngleDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedAction, setSelectedAction] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Kullanıcı bilgilerini al
  const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  
  // Çıkış yap
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    toast.success('Başarıyla çıkış yapıldı!');
    navigate('/login');
  };

  // Admin menü öğeleri
  const menuItems = [
    {
      id: 'tables',
      icon: <FaTable />,
      title: 'Masa ve Rezervasyon Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Masa Ekle/Düzenle/Sil', icon: <FaEdit /> },
        { label: 'Masa Planı', icon: <FaTable /> },
        { label: 'Rezervasyon Listesi', icon: <FaCalendarAlt /> },
        { label: 'Rezervasyon İşlemleri', icon: <FaPlus /> }
      ]
    },
    {
      id: 'products',
      icon: <FaUtensils />,
      title: 'Ürün ve Menü Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Ürün Ekle/Düzenle/Sil', icon: <FaEdit /> },
        { label: 'Ürün Listele', icon: <FaEye /> },
        { label: 'Kategori Yönetimi', icon: <FaCog /> }
      ]
    },
    {
      id: 'orders',
      icon: <FaClipboardList />,
      title: 'Siparişler Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Aktif Siparişleri Göster', icon: <FaEye /> },
        { label: 'Sipariş Detayı İşlemleri', icon: <FaSearch /> },
        { label: 'Sipariş Geçmişi', icon: <FaClipboardList /> },
        { label: 'İade ve İptal İşlemleri', icon: <FaTrash /> }
      ]
    },
    {
      id: 'members',
      icon: <FaUsers />,
      title: 'Üye Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Üye Listele', icon: <FaEye /> },
        { label: 'Üye Detay ve Düzenleme', icon: <FaEdit /> },
        { label: 'Üye Ekle/Sil', icon: <FaPlus /> }
      ]
    },
    {
      id: 'staff',
      icon: <FaUser />,
      title: 'Personel Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Personel Ekle/Düzenle/Sil', icon: <FaEdit /> },
        { label: 'Personel Listele', icon: <FaEye /> },
        { label: 'Rol ve Yetki Yönetimi', icon: <FaCog /> },
        { label: 'Personel İzin Yönetimi', icon: <FaCalendarAlt /> }
      ]
    },
    {
      id: 'finance',
      icon: <FaMoneyBillWave />,
      title: 'Finans ve Kasa Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Günlük Satış Raporları', icon: <FaChartBar /> },
        { label: 'Gün Sonu (Kasa Kapatma)', icon: <FaMoneyBillWave /> },
        { label: 'Ödeme İade İşlemi', icon: <FaTrash /> },
        { label: 'Gelir İstatistikleri', icon: <FaChartBar /> },
        { label: 'Kasa Hareketleri', icon: <FaSearch /> }
      ]
    },
    {
      id: 'reports',
      icon: <FaChartBar />,
      title: 'Raporlar ve İstatistikler',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Günlük Satış Raporları', icon: <FaChartBar /> },
        { label: 'Ürün Satış Raporu', icon: <FaUtensils /> },
        { label: 'Rezervasyon Raporu', icon: <FaCalendarAlt /> }
      ]
    },
    {
      id: 'stock',
      icon: <FaBoxes />,
      title: 'Depo/Stok Yönetimi',
      subtitle: 'Hangi işlem Yapılacak?',
      actions: [
        { label: 'Güncel Stok Durumu', icon: <FaBoxes /> },
        { label: 'Malzeme Giriş/Çıkış İşlemleri', icon: <FaPlus /> }
      ]
    }
  ];

  // Action butonuna tıklandığında
  const handleActionClick = (sectionTitle, actionLabel) => {
    setSelectedAction({ section: sectionTitle, action: actionLabel });
    toast.info(`${sectionTitle} - ${actionLabel} işlemi seçildi`);
    console.log(`İşlem: ${sectionTitle} - ${actionLabel}`);
  };

  // Dropdown toggle
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Dashboard içeriği
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bugünkü Sipariş</p>
              <p className="text-white text-3xl font-bold mt-1">42</p>
              <p className="text-green-500 text-xs mt-2">↑ %12 artış</p>
            </div>
            <div className="text-3xl text-gray-500">
              <FaShoppingCart />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bugünkü Ciro</p>
              <p className="text-white text-3xl font-bold mt-1">₺8.450</p>
              <p className="text-green-500 text-xs mt-2">↑ %8 artış</p>
            </div>
            <div className="text-3xl text-gray-500">
              <FaDollarSign />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Aktif Masalar</p>
              <p className="text-white text-3xl font-bold mt-1">18/25</p>
              <p className="text-yellow-500 text-xs mt-2">%72 dolu</p>
            </div>
            <div className="text-3xl text-gray-500">
              <FaTable />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bekleyen Sipariş</p>
              <p className="text-white text-3xl font-bold mt-1">6</p>
              <p className="text-orange-500 text-xs mt-2">⏳ 3 dakika</p>
            </div>
            <div className="text-3xl text-gray-500">
              <FaBell />
            </div>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all">
            <FaPlus className="text-gray-400 text-2xl mx-auto mb-2" />
            <span className="text-white text-sm">Yeni Sipariş</span>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all">
            <FaTable className="text-gray-400 text-2xl mx-auto mb-2" />
            <span className="text-white text-sm">Masa Aç</span>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all">
            <FaUtensils className="text-gray-400 text-2xl mx-auto mb-2" />
            <span className="text-white text-sm">Ürün Ekle</span>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all">
            <FaChartBar className="text-gray-400 text-2xl mx-auto mb-2" />
            <span className="text-white text-sm">Rapor Al</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Menü içeriği render
  const renderContent = () => {
    if (selectedMenu === 'dashboard') {
      return renderDashboard();
    }

    const menuItem = menuItems.find(item => item.id === selectedMenu);
    if (!menuItem) return renderDashboard();

    return (
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl text-gray-500">{menuItem.icon}</div>
          <div>
            <h2 className="text-white text-xl font-bold">{menuItem.title}</h2>
            <p className="text-gray-400 text-sm">{menuItem.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {menuItem.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(menuItem.title, action.label)}
              className="flex items-center justify-between px-4 py-3 
                       bg-white/5 hover:bg-white/10 rounded-xl 
                       transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 group-hover:text-gray-300">
                  {action.icon}
                </span>
                <span className="text-gray-300 text-sm group-hover:text-white">
                  {action.label}
                </span>
              </div>
              <FaChevronRight className="text-gray-600 text-xs group-hover:text-gray-400" />
            </button>
          ))}
        </div>

        {selectedAction && selectedAction.section === menuItem.title && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">
              Seçili İşlem: <span className="text-white">{selectedAction.action}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              İşlem detayları burada gösterilecek.
            </p>
          </div>
        )}
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
      {/* Arka plan overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      
      <div className="relative z-10">
        {/* Üst Navbar - Tek bar */}
        <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h1 className="text-white font-bold text-base">SekerRestoran</h1>
                  <p className="text-gray-400 text-[10px]">{userData.email || 'admin@restoran.com'}</p>
                </div>
              </div>

              {/* Menü - Dropdown'lu navbar */}
              <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center px-4">
                {/* Ana Sayfa */}
                <button
                  onClick={() => setSelectedMenu('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedMenu === 'dashboard' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaHome />
                  Ana Sayfa
                </button>

                {/* Her menü için dropdown */}
                {menuItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                        selectedMenu === item.id || openDropdown === item.id
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      <span className="hidden lg:inline">{item.title}</span>
                      <span className="inline lg:hidden">{item.title.split(' ').slice(0, 2).join(' ')}</span>
                      <FaAngleDown className={`text-[10px] transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menü */}
                    {openDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-white text-sm font-medium">{item.title}</p>
                          <p className="text-gray-400 text-xs">{item.subtitle}</p>
                        </div>
                        {item.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleActionClick(item.title, action.label);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                          >
                            <span className="text-gray-500">{action.icon}</span>
                            <span className="text-gray-300 text-sm">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sağ Menü */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <FaBell size={16} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
                  <FaEnvelope size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 
                           text-white rounded-lg transition-all duration-300 text-sm"
                >
                  <FaSignOutAlt size={14} />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {renderContent()}
        </div>

        {/* Alt Bilgi - Sarı bar kaldırıldı */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-[10px]">
                © 2024 SekerRestoran Yönetim Sistemi v2.0 | Admin Paneli
              </p>
              <p className="text-gray-400 text-[10px] mt-1 md:mt-0">
                Hoş geldiniz, <span className="text-white">{userData.name || 'Admin'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;