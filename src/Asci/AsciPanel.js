// src/Asci/AsciPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaHome, FaBell, FaEnvelope, FaKey,
  FaTimes, FaBars, FaUtensils, FaClipboardList, 
  FaCheck, FaTimesCircle, FaClock, FaSpinner,
  FaPrint, FaSearch, FaFilter, FaEye, FaEdit,
  FaArrowLeft, FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AsciPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      table: 'Masa 02', 
      items: ['Adana Kebap', 'Lahmacun', 'Ayran'], 
      status: 'pending', 
      time: '14:23',
      note: 'Acılı olsun',
      quantity: 3
    },
    { 
      id: 2, 
      table: 'Masa 05', 
      items: ['Karışık Izgara', 'Künefe', 'Su'], 
      status: 'preparing', 
      time: '14:15',
      note: 'Izgara iyi pişsin',
      quantity: 3
    },
    { 
      id: 3, 
      table: 'Teras 01', 
      items: ['Balık Tabağı', 'Salata', 'Limonata'], 
      status: 'ready', 
      time: '14:02',
      note: 'Limonlu olsun',
      quantity: 3
    },
    { 
      id: 4, 
      table: 'Masa 03', 
      items: ['Mercimek Çorbası', 'Pizza'], 
      status: 'pending', 
      time: '13:48',
      note: 'Çorba sıcak olsun',
      quantity: 2
    }
  ]);

  const [userData, setUserData] = useState({
    name: 'Aşçı',
    email: 'asci@restoran.com',
    role: 'asci'
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || 'Aşçı',
          email: parsed.email || 'asci@restoran.com',
          role: parsed.role || 'asci'
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

  // Sipariş durumunu güncelle
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const statusMessages = {
      'preparing': 'Hazırlanmaya başlandı',
      'ready': 'Hazır! Servis edilebilir'
    };
    
    toast.success(`Sipariş ${statusMessages[newStatus] || 'güncellendi'}`);
  };

  // Bildirimler
  const [notifications] = useState([
    { id: 1, message: 'Masa 02 yeni sipariş verdi', time: '5 dk önce', read: false },
    { id: 2, message: 'Masa 05 sipariş hazır', time: '10 dk önce', read: false }
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': 
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' };
      case 'preparing': 
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Hazırlanıyor' };
      case 'ready': 
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hazır' };
      default: 
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Bilinmiyor' };
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative lg:flex lg:flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'}
          bg-black/90 backdrop-blur-sm border-r border-white/10
          h-screen transition-all duration-300 overflow-y-auto
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-50 flex-shrink-0
        `}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h1 className="text-white font-bold text-sm">SekerRestoran</h1>
                  <p className="text-gray-400 text-[9px]">Aşçı Paneli</p>
                </div>
              </div>
            ) : (
              <div className="text-2xl mx-auto">🍽️</div>
            )}
            <button 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white hidden lg:block"
            >
              {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Sidebar Menü */}
          <div className="py-4 px-3">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-white bg-white/10">
              <FaUtensils size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Sipariş Yönetimi</p>
                  <p className="text-[10px] text-gray-500">Gelen siparişler</p>
                </div>
              )}
            </button>

            <div className="border-t border-white/10 my-3"></div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5"
            >
              <FaKey size={18} />
              {sidebarOpen && <span className="text-sm">Şifre Değiştir</span>}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
            >
              <FaSignOutAlt size={18} />
              {sidebarOpen && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
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

        {/* Ana İçerik */}
        <div className="flex-1">
          {/* Üst Navbar */}
          <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-end gap-4">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <FaBell size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
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

          {/* İçerik */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Mutfak Yönetimi</h1>
                <p className="text-gray-400 text-sm">Gelen siparişleri görüntüleyin ve yönetin</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">Bekleyen: {orders.filter(o => o.status === 'pending').length}</span>
                <span className="text-yellow-400 text-sm">|</span>
                <span className="text-blue-400 text-sm">Hazırlanan: {orders.filter(o => o.status === 'preparing').length}</span>
                <span className="text-green-400 text-sm">|</span>
                <span className="text-green-400 text-sm">Hazır: {orders.filter(o => o.status === 'ready').length}</span>
              </div>
            </div>

            {/* Sipariş Listesi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {orders.map((order) => {
                const status = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{order.table}</h3>
                        <p className="text-gray-400 text-sm">{order.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="text-gray-500">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {order.note && (
                      <div className="mb-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-yellow-400 text-xs">
                          <span className="font-medium">Not:</span> {order.note}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <FaSpinner className="animate-spin" size={14} />
                          Hazırlamaya Başla
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <FaCheck size={14} />
                          Hazır
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          className="flex-1 px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg text-sm cursor-not-allowed flex items-center justify-center gap-2"
                          disabled
                        >
                          <FaCheck size={14} />
                          Servis Edildi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🍳</div>
                  <p className="text-gray-400 text-lg">Henüz sipariş yok</p>
                  <p className="text-gray-500 text-sm">Yeni siparişler burada görünecek</p>
                </div>
              )}
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <p className="text-gray-400 text-[10px] text-center">
                © 2024 SekerRestoran Yönetim Sistemi | Aşçı Paneli
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Şifre Değiştir</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Mevcut Şifre</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                  placeholder="Mevcut şifreniz"
                  disabled={passwordLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                  placeholder="Yeni şifreniz (min 6 karakter)"
                  disabled={passwordLoading}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre Tekrar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
                  placeholder="Yeni şifrenizi tekrar girin"
                  disabled={passwordLoading}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default AsciPanel;