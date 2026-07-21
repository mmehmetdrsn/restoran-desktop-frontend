// src/Asci/AsciPanel.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaKey,
  FaTimes, FaBars, FaUtensils,
  FaCheck, FaSpinner,
  FaSync
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { asciAPI, authService } from '../api/api';

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Aşçı',
    email: 'asci@restoran.com',
    role: 'asci',
    personelId: null
  });

  // ========== KULLANICI BİLGİLERİNİ AL ==========
  const fetchUserData = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.AdSoyad || parsed.name || 'Aşçı',
          email: parsed.email || 'asci@restoran.com',
          role: parsed.Rol || parsed.role || 'asci',
          personelId: parsed.PersonelId || parsed.personelId || parsed.id
        });
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  }, []);

  // ========== SİPARİŞ DURUMUNU MAP ET ==========
  const mapStatus = (backendStatus) => {
    const status = backendStatus?.toUpperCase() || '';
    if (status === 'BEKLEMEDE') return 'pending';
    if (status === 'HAZIRLANIYOR') return 'preparing';
    if (status === 'HAZIR') return 'ready';
    return 'pending';
  };

  // ========== ZAMAN FORMATLA ==========
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // ========== SİPARİŞLERİ BACKEND'DEN ÇEK ==========
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // 🟢 Sadece BEKLEMEDE ve HAZIRLANIYOR durumlarını getir
      const response = await asciAPI.getAsciSiparisleri();
      
      let data = [];
      if (response?.data) {
        data = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        data = response;
      }

      console.log('📦 Gelen siparişler:', data);

      const filteredOrders = data
        .map(s => ({
          id: s.siparisId,
          table: s.masaNo ? `Masa ${s.masaNo}` : 'Paket Servis',
          items: [],
          status: mapStatus(s.siparisDurumu),
          time: formatTime(s.siparisTarihi),
          note: '',
          quantity: s.detaySayisi || 0,
          rawStatus: s.siparisDurumu,
          customer: s.uyeAdi || 'Ziyaretçi',
          totalAmount: s.toplamTutar || 0,
          personelAdi: s.personelAdi || null
        }));

      setOrders(filteredOrders);

      // Her siparişin detaylarını çek
      for (const order of filteredOrders) {
        try {
          const detailResponse = await asciAPI.getSiparisDetay(order.id);
          const detailData = detailResponse?.data;
          if (detailData?.detaylar && Array.isArray(detailData.detaylar)) {
            setOrders(prev => prev.map(o => 
              o.id === order.id ? {
                ...o,
                items: detailData.detaylar.map(d => d.urunAdi || 'Ürün'),
                note: detailData.detaylar.find(d => d.detayNot)?.detayNot || '',
                quantity: detailData.detaylar.length
              } : o
            ));
          }
        } catch (err) {
          console.error(`Sipariş #${order.id} detayları alınamadı:`, err);
        }
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      toast.error('❌ Siparişler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== SİPARİŞ DURUMUNU GÜNCELLE (OTOMATİK KURYE ATAMA İLE) ==========
  const updateOrderStatus = async (orderId, newStatus) => {
    // Zaten güncelleniyorsa tekrar tıklanmasın
    if (updatingOrderId === orderId) return;
    
    try {
      setUpdatingOrderId(orderId);
      
      // 🟢 "Hazır" butonuna tıklandığında özel işlem (OTOMATİK KURYE ATAMA)
      if (newStatus === 'ready') {
        // 🔥 Siparişi HAZIR yap ve kurye ata
        const result = await asciAPI.siparisHazirVeKuryeAta(orderId);
        
        if (result.success) {
          // Siparişi listeden kaldır
          setOrders(prev => prev.filter(o => o.id !== orderId));
          toast.success(`✅ ${result.message}`);
        } else {
          // Kurye bulunamadı, sipariş havuza eklendi
          setOrders(prev => prev.filter(o => o.id !== orderId));
          toast.warning(`⚠️ ${result.message}`);
        }
        
        // 🔄 Listeyi yenile
        setTimeout(() => {
          fetchOrders();
        }, 2000);
        
        return;
      }
      
      // 🟡 "Hazırlamaya Başla" için normal işlem
      const statusMap = {
        'preparing': 'HAZIRLANIYOR'
      };
      
      const backendStatus = statusMap[newStatus];
      if (!backendStatus) {
        toast.error('Geçersiz durum!');
        return;
      }

      console.log(`🔄 Sipariş #${orderId} durumu güncelleniyor: ${backendStatus}`);

      // Durumu güncelle
      await asciAPI.updateSiparisDurum(orderId, backendStatus);

      // Local state'i güncelle
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, rawStatus: backendStatus } : order
      ));

      toast.success(`✅ Sipariş #${orderId} hazırlanmaya başlandı 🍳`);

      // 🔄 Listeyi yenile
      setTimeout(() => {
        fetchOrders();
      }, 1000);
      
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      
      // Hata mesajını göster
      const errorMsg = error?.response?.data?.message || error?.message || 'Sipariş durumu güncellenirken bir hata oluştu!';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ========== ŞİFRE DEĞİŞTİR ==========
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
      await authService.sifreDegistir({
        eskiSifre: currentPassword,
        yeniSifre: newPassword
      });

      toast.success('✅ Şifreniz başarıyla değiştirildi!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // 3 saniye sonra tekrar giriş yapmasını iste
      setTimeout(() => {
        toast.info('Güvenlik için lütfen tekrar giriş yapın.');
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Şifre değiştirilemedi!';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  // ========== ÇIKIŞ ==========
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    toast.success('👋 Başarıyla çıkış yapıldı!');
    navigate('/login');
  };

  // ========== DURUM RENKLERİ ==========
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

  // ========== EFFECT'LER ==========
  useEffect(() => {
    fetchUserData();
    fetchOrders();

    // Her 10 saniyede bir otomatik yenile (daha hızlı tepki için)
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchUserData, fetchOrders]);

  // ========== SIDEBAR TOGGLE ==========
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ========== RENDER ==========
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
                <button 
                  onClick={fetchOrders}
                  className="text-gray-400 hover:text-white transition-colors relative"
                  title="Yenile"
                >
                  <FaSync size={18} className={loading ? 'animate-spin' : ''} />
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
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Mutfak Yönetimi</h1>
                <p className="text-gray-400 text-sm">Gelen siparişleri görüntüleyin ve yönetin</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white text-sm bg-white/10 px-3 py-1 rounded-lg">
                  Bekleyen: {orders.filter(o => o.status === 'pending').length}
                </span>
                <span className="text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-lg">
                  Hazırlanan: {orders.filter(o => o.status === 'preparing').length}
                </span>
              </div>
            </div>

            {/* Loading State */}
            {loading && orders.length === 0 ? (
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-12 border border-white/10 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-yellow-400 text-4xl mb-4" />
                <p className="text-gray-400">Siparişler yükleniyor...</p>
              </div>
            ) : (
              /* Sipariş Listesi */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((order) => {
                  const status = getStatusBadge(order.status);
                  const isUpdating = updatingOrderId === order.id;
                  
                  return (
                    <div key={order.id} className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{order.table}</h3>
                          <p className="text-gray-400 text-sm">{order.time}</p>
                          <p className="text-gray-500 text-xs mt-1">Müşteri: {order.customer}</p>
                          {order.personelAdi && (
                            <p className="text-gray-500 text-xs">Personel: {order.personelAdi}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                              <span className="text-gray-500">•</span>
                              <span>{item}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm flex items-center gap-2">
                            <FaSpinner className="animate-spin" size={12} />
                            Ürünler yükleniyor...
                          </div>
                        )}
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
                            disabled={isUpdating}
                            className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                          >
                            {isUpdating ? (
                              <FaSpinner className="animate-spin" size={14} />
                            ) : (
                              <FaSpinner className="animate-spin" size={14} />
                            )}
                            Hazırlamaya Başla
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            disabled={isUpdating}
                            className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                          >
                            {isUpdating ? (
                              <FaSpinner className="animate-spin" size={14} />
                            ) : (
                              <FaCheck size={14} />
                            )}
                            Hazır (Kurye Ata)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {orders.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🍳</div>
                    <p className="text-gray-400 text-lg">Henüz sipariş yok</p>
                    <p className="text-gray-500 text-sm">Yeni siparişler burada görünecek</p>
                  </div>
                )}
              </div>
            )}
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