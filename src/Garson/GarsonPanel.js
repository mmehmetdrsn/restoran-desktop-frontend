// src/pages/Garson/GarsonPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaHome, FaBell, FaEnvelope, FaKey,
  FaTimes, FaBars, FaTable, FaUser, FaMoneyBillWave,
  FaUtensils, FaClipboardList, FaArrowRight, FaCheck,
  FaTimesCircle, FaChair, FaUsers, FaClock, FaTrash,
  FaEdit, FaEye, FaPlus, FaMinus, FaShoppingCart,
  FaReceipt, FaPrint, FaCreditCard, FaMoneyBill,
  FaArrowLeft, FaTruck, FaBox, FaPhone, FaMapMarkerAlt,
  FaExclamationTriangle, FaCheckCircle, FaSpinner,
  FaStickyNote
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import MasaYonetimi from './pages/MasaYonetimi';
import YeniSiparisPage from './pages/YeniSiparisPage';
import HesapIslemleri from './pages/HesapIslemleri';
import MasaTasiModal from './modals/MasaTasiModal';
import IadeModal from './modals/IadeModal';
import SifreModal from './modals/SifreModal';

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const GarsonPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  // modal visibilities
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMoveTableModal, setShowMoveTableModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState('masa');
  
  // Şifre değiştirme state'leri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Kullanıcı bilgileri
  const [userData, setUserData] = useState({
    name: 'Garson',
    email: 'garson@restoran.com',
    role: 'garson'
  });

  // Masalar
  const [tables, setTables] = useState([
    { id: 1, name: 'Masa 01', status: 'empty', capacity: 4, order: null, time: null },
    { id: 2, name: 'Masa 02', status: 'occupied', capacity: 4, order: { items: [{name: 'Adana Kebap', quantity: 2, price: 120, note: ''}, {name: 'Lahmacun', quantity: 1, price: 70, note: ''}], total: 310 }, time: '45dk' },
    { id: 3, name: 'Masa 03', status: 'empty', capacity: 2, order: null, time: null },
    { id: 4, name: 'Masa 04', status: 'reserved', capacity: 3, order: null, time: '19:30' },
    { id: 5, name: 'Masa 05', status: 'occupied', capacity: 6, order: { items: [{name: 'Karışık Izgara', quantity: 1, price: 180, note: ''}, {name: 'Künefe', quantity: 2, price: 85, note: ''}], total: 350 }, time: '30dk' },
    { id: 6, name: 'Masa 06', status: 'occupied', capacity: 6, order: { items: [{name: 'Pizza', quantity: 1, price: 95, note: 'Ekstra peynir'}, {name: 'Makarna', quantity: 1, price: 75, note: ''}], total: 170 }, time: '20dk' },
    { id: 7, name: 'Masa 07', status: 'empty', capacity: 2, order: null, time: null },
    { id: 8, name: 'Masa 08', status: 'broken', capacity: 4, order: null, time: null },
    { id: 9, name: 'Teras 01', status: 'occupied', capacity: 5, order: { items: [{name: 'Balık Tabağı', quantity: 1, price: 160, note: ''}, {name: 'Salata', quantity: 2, price: 40, note: ''}], total: 240 }, time: '15dk' },
    { id: 10, name: 'Teras 02', status: 'empty', capacity: 2, order: null, time: null },
    { id: 11, name: 'Teras 03', status: 'reserved', capacity: 4, order: null, time: '20:00' },
    { id: 12, name: 'Teras 04', status: 'empty', capacity: 4, order: null, time: null }
  ]);

  // Filtreleme
  const [filter, setFilter] = useState('all');
  
  // Menü ürünleri
  const menuItems = [
    { id: 1, name: 'Adana Kebap', price: 120, category: 'Kebaplar' },
    { id: 2, name: 'Lahmacun', price: 70, category: 'Hamur İşleri' },
    { id: 3, name: 'Künefe', price: 85, category: 'Tatlılar' },
    { id: 4, name: 'Mercimek Çorbası', price: 45, category: 'Çorbalar' },
    { id: 5, name: 'Karışık Izgara', price: 180, category: 'Ana Yemek' },
    { id: 6, name: 'Pizza Margherita', price: 95, category: 'Pizza' },
    { id: 7, name: 'Makarna', price: 75, category: 'Makarna' },
    { id: 8, name: 'Balık Tabağı', price: 160, category: 'Deniz Ürünleri' },
    { id: 9, name: 'Salata', price: 40, category: 'Salatalar' },
    { id: 10, name: 'Ayran', price: 15, category: 'İçecekler' }
  ];

  // Sepet
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [], total: 0 });

  // Bildirimler
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Masa 02 siparişi hazır', time: '2 dk önce', read: false },
    { id: 2, message: 'Masa 05 yeni sipariş verdi', time: '5 dk önce', read: false },
    { id: 3, message: 'Masa 04 rezervasyonu 19:30', time: '15 dk önce', read: false }
  ]);

  // Masa taşıma state'leri
  const [moveFromTable, setMoveFromTable] = useState('');
  const [moveToTable, setMoveToTable] = useState('');

  // İade/İptal state'leri
  const [refundTable, setRefundTable] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [selectedRefundItems, setSelectedRefundItems] = useState([]);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || 'Garson',
          email: parsed.email || 'garson@restoran.com',
          role: parsed.role || 'garson'
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
    navigate('/');
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

  // Masa durumu renkleri
  const getTableStatusColor = (status) => {
    switch(status) {
      case 'empty': return 'bg-green-500 hover:bg-green-600';
      case 'occupied': return 'bg-red-500 hover:bg-red-600';
      case 'reserved': return 'bg-orange-500 hover:bg-orange-600';
      case 'broken': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const getTableStatusText = (status) => {
    switch(status) {
      case 'empty': return 'Boş';
      case 'occupied': return 'Dolu';
      case 'reserved': return 'Rezerve';
      case 'broken': return 'Arızalı';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'empty': return <FaCheckCircle className="text-green-400" />;
      case 'occupied': return <FaTimesCircle className="text-red-400" />;
      case 'reserved': return <FaClock className="text-orange-400" />;
      case 'broken': return <FaExclamationTriangle className="text-gray-400" />;
      default: return null;
    }
  };

  // Filtreleme
  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

  // Masa seçimi
  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (table.status === 'empty') {
      // Boş masaya tıklanınca yeni sipariş sayfasına yönlendir
      setActiveTab('yeni');
      setCurrentOrder({ tableId: table.id, items: [], total: 0 });
    } else if (table.status === 'occupied') {
      toast.info(`${table.name} - Sipariş detayları`);
    }
  };

  // Sepete ürün ekle (özel not ile)
  const addToCart = (item) => {
    const note = prompt(`📝 ${item.name} için özel not (isteğe bağlı):`, '');
    
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id ? { ...c, quantity: c.quantity + 1, note: note || c.note } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, note: note || '' }]);
    }
    toast.success(`${item.name} sepete eklendi${note ? ' 📝 Not: ' + note : ''}`);
  };

  // Sepetten ürün çıkar
  const removeFromCart = (itemId) => {
    const item = cart.find(c => c.id === itemId);
    if (item.quantity > 1) {
      setCart(cart.map(c => 
        c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
      ));
    } else {
      setCart(cart.filter(c => c.id !== itemId));
    }
  };

  // Ürün notu güncelle
  const updateItemNote = (itemId) => {
    const item = cart.find(c => c.id === itemId);
    if (item) {
      const newNote = prompt(`📝 ${item.name} için not güncelle:`, item.note || '');
      if (newNote !== null) {
        setCart(cart.map(c => 
          c.id === itemId ? { ...c, note: newNote } : c
        ));
        toast.info(`📝 Not güncellendi: ${newNote || 'Not silindi'}`);
      }
    }
  };

  // Siparişi onayla
  const confirmOrder = () => {
    if (cart.length === 0) {
      toast.warning('Sepet boş!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTables(tables.map(table => 
      table.id === selectedTable.id 
        ? { 
            ...table, 
            status: 'occupied', 
            order: { 
              items: cart.map(c => ({ 
                name: c.name, 
                quantity: c.quantity, 
                price: c.price,
                note: c.note || ''
              })), 
              total: total 
            },
            time: '0dk'
          }
        : table
    ));

    toast.success(`Sipariş oluşturuldu! Toplam: ₺${total}`);
    setActiveTab('masa');
    setShowOrderModal(false);
    setCart([]);
    setCurrentOrder({ tableId: null, items: [], total: 0 });
    
    setNotifications([
      { id: Date.now(), message: `${selectedTable.name} sipariş verdi`, time: 'Şimdi', read: false },
      ...notifications
    ]);
  };

  // Masa Taşıma
  const handleMoveTable = () => {
    if (!moveFromTable || !moveToTable) {
      toast.warning('Lütfen kaynak ve hedef masa seçin!');
      return;
    }
    if (moveFromTable === moveToTable) {
      toast.warning('Aynı masa seçilemez!');
      return;
    }

    const fromTable = tables.find(t => t.id === parseInt(moveFromTable));
    const toTable = tables.find(t => t.id === parseInt(moveToTable));
    
    if (!fromTable || !toTable) {
      toast.error('Masa bulunamadı!');
      return;
    }

    if (toTable.status !== 'empty') {
      toast.error('Hedef masa boş değil!');
      return;
    }

    if (fromTable.status !== 'occupied') {
      toast.error('Kaynak masa dolu değil!');
      return;
    }

    setTables(tables.map(table => {
      if (table.id === parseInt(moveFromTable)) {
        return { ...table, status: 'empty', order: null, time: null };
      }
      if (table.id === parseInt(moveToTable)) {
        return { ...table, status: 'occupied', order: fromTable.order, time: fromTable.time };
      }
      return table;
    }));

    toast.success(`Masa başarıyla taşındı! ${fromTable.name} → ${toTable.name}`);
    setShowMoveTableModal(false);
    setMoveFromTable('');
    setMoveToTable('');
  };

  // İade/İptal
  const handleRefundSelect = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.order) {
      toast.warning('Bu masada sipariş yok!');
      return;
    }
    setRefundTable(table);
    setRefundItems(table.order.items || []);
    setSelectedRefundItems([]);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const toggleRefundItem = (index) => {
    if (selectedRefundItems.includes(index)) {
      setSelectedRefundItems(selectedRefundItems.filter(i => i !== index));
    } else {
      setSelectedRefundItems([...selectedRefundItems, index]);
    }
  };

  const processRefund = () => {
    if (selectedRefundItems.length === 0) {
      toast.warning('Lütfen iade edilecek ürünleri seçin!');
      return;
    }
    if (!refundReason) {
      toast.warning('Lütfen iade sebebini seçin!');
      return;
    }

    const refundTotal = selectedRefundItems.reduce((sum, index) => {
      const item = refundItems[index];
      return sum + (item.price * item.quantity);
    }, 0);

    const remainingItems = refundItems.filter((_, index) => !selectedRefundItems.includes(index));
    
    if (remainingItems.length === 0) {
      setTables(tables.map(table => 
        table.id === refundTable.id 
          ? { ...table, status: 'empty', order: null, time: null }
          : table
      ));
      toast.info(`Tüm sipariş iptal edildi! İade tutarı: ₺${refundTotal}`);
    } else {
      const newTotal = remainingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTables(tables.map(table => 
        table.id === refundTable.id 
          ? { ...table, order: { items: remainingItems, total: newTotal } }
          : table
      ));
      toast.info(`Seçili ürünler iade edildi! İade tutarı: ₺${refundTotal}`);
    }

    toast.success(`İade sebebi: ${refundReason}`);
    setShowRefundModal(false);
    setRefundTable(null);
    setRefundItems([]);
    setSelectedRefundItems([]);
    setRefundReason('');
  };

  // Ödeme Al
  const processPayment = (tableId, method) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.order) {
      toast.error('Sipariş bulunamadı!');
      return;
    }

    const orderDetails = table.order.items.map(item => 
      `${item.quantity}x ${item.name}${item.note ? ` (📝${item.note})` : ''}`
    ).join('\n');

    const confirmPayment = window.confirm(
      `💰 ${table.name}\n\n` +
      `Sipariş Detayları:\n${orderDetails}\n\n` +
      `Toplam: ₺${table.order.total}\n` +
      `Ödeme Yöntemi: ${method}\n\n` +
      `Ödemeyi onaylıyor musunuz?`
    );

    if (confirmPayment) {
      setTables(tables.map(table => 
        table.id === tableId 
          ? { ...table, status: 'empty', order: null, time: null }
          : table
      ));
      
      toast.success(`✅ ${table.name} ödeme başarılı! (${method}) ₺${table.order.total}`);
      setActiveTab('masa');
      setShowPaymentModal(false);
      setSelectedTable(null);
    }
  };

  // Bildirim okundu
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Menü kategorileri
  const categories = ['Tümü', ...new Set(menuItems.map(item => item.category))];
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredMenu = selectedCategory === 'Tümü' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Sidebar toggle
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dolu masalar (ödeme için)
  const occupiedTables = tables.filter(t => t.status === 'occupied');

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
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h1 className="text-white font-bold text-sm">SekerRestoran</h1>
                  <p className="text-gray-400 text-[9px]">Garson Paneli</p>
                </div>
              </div>
            ) : (
              <div className="text-2xl mx-auto">🍽️</div>
            )}
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white hidden lg:block">
              {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
            <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="py-4 px-3">
            <button onClick={() => setActiveTab('masa')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-white bg-white/10">
              <FaTable size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Masa Yönetimi</p>
                  <p className="text-[10px] text-gray-500">Salon planı</p>
                </div>
              )}
            </button>

            <button onClick={() => setShowOrderModal(true)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 mt-2">
              <FaClipboardList size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Yeni Sipariş</p>
                  <p className="text-[10px] text-gray-500">Sipariş oluştur</p>
                </div>
              )}
            </button>

            <button onClick={() => setShowPaymentModal(true)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 mt-2">
              <FaReceipt size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Hesap İşlemleri</p>
                  <p className="text-[10px] text-gray-500">Ödeme & fiş</p>
                </div>
              )}
            </button>

            <div className="border-t border-white/10 my-3"></div>

            <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5">
              <FaKey size={18} />
              {sidebarOpen && <span className="text-sm">Şifre Değiştir</span>}
            </button>

            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2">
              <FaSignOutAlt size={18} />
              {sidebarOpen && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-black/80 backdrop-blur-sm rounded-lg text-white">
          <FaBars size={20} />
        </button>

        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Ana İçerik */}
        <div className="flex-1">
          {/* Üst Navbar */}
          <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-end gap-4">
                <div className="relative group">
                  <button className="text-gray-400 hover:text-white transition-colors relative">
                    <FaBell size={18} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-black/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl py-2 hidden group-hover:block">
                    <p className="px-4 py-2 text-white text-sm font-medium border-b border-white/10">Bildirimler</p>
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? 'bg-white/5' : ''}`} onClick={() => markNotificationAsRead(n.id)}>
                        <p className="text-white text-sm">{n.message}</p>
                        <p className="text-gray-500 text-xs">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
            {activeTab === 'masa' && (
              <MasaYonetimi
                tables={tables}
                filteredTables={filteredTables}
                filter={filter}
                setFilter={setFilter}
                handleTableClick={handleTableClick}
                getTableStatusColor={getTableStatusColor}
                getTableStatusText={getTableStatusText}
                getStatusIcon={getStatusIcon}
                onNewOrderClick={() => setShowOrderModal(true)}
                onOpenPaymentClick={() => setShowPaymentModal(true)}
                onOpenMoveTableClick={() => setShowMoveTableModal(true)}
                onOpenRefundClick={() => setShowRefundModal(true)}
              />
            )}

            {activeTab === 'yeni' && (
              <YeniSiparisPage
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                filteredMenu={filteredMenu}
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onUpdateItemNote={updateItemNote}
                onConfirmOrder={confirmOrder}
                selectedTable={selectedTable}
                onSelectTable={(table) => setSelectedTable(table)}
                tables={tables}
              />
            )}

            {activeTab === 'hesap' && (
              <HesapIslemleri occupiedTables={occupiedTables} processPayment={processPayment} />
            )}
          </div>
        </div>
      </div>

      {/* Sipariş ve Ödeme modal görünümleri — eski görünümü korumak için sayfaları modal içine sarıyoruz */}

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Yeni Sipariş</h2>
              <button onClick={() => { setShowOrderModal(false); setCart([]); }} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <YeniSiparisPage
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              filteredMenu={filteredMenu}
              cart={cart}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onUpdateItemNote={updateItemNote}
              onConfirmOrder={confirmOrder}
              selectedTable={selectedTable}
              onSelectTable={(table) => setSelectedTable(table)}
              tables={tables}
            />
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">💰 Ödeme Al</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <HesapIslemleri occupiedTables={occupiedTables} processPayment={processPayment} />
          </div>
        </div>
      )}

      <MasaTasiModal
        showMoveTableModal={showMoveTableModal}
        onClose={() => { setShowMoveTableModal(false); setMoveFromTable(''); setMoveToTable(''); }}
        tables={tables}
        moveFromTable={moveFromTable}
        moveToTable={moveToTable}
        setMoveFromTable={setMoveFromTable}
        setMoveToTable={setMoveToTable}
        handleMoveTable={handleMoveTable}
      />

      <IadeModal
        showRefundModal={showRefundModal}
        onClose={() => { setShowRefundModal(false); setRefundTable(null); setRefundItems([]); setSelectedRefundItems([]); }}
        tables={tables}
        refundItems={refundItems}
        refundReason={refundReason}
        selectedRefundItems={selectedRefundItems}
        setRefundReason={setRefundReason}
        onTableSelect={handleRefundSelect}
        toggleRefundItem={toggleRefundItem}
        processRefund={processRefund}
      />

      <SifreModal
        showPasswordModal={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        handlePasswordChange={handlePasswordChange}
        passwordLoading={passwordLoading}
      />
    </div>
  );
};

export default GarsonPanel;