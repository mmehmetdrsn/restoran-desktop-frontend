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

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const GarsonPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMoveTableModal, setShowMoveTableModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
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
      setShowOrderModal(true);
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
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-white bg-white/10">
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

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 mt-2">
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
           

            {/* Filtreler */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>Tümü ({tables.length})</button>
              <button onClick={() => setFilter('empty')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'empty' ? 'bg-green-500/30 text-green-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>Boş ({tables.filter(t => t.status === 'empty').length})</button>
              <button onClick={() => setFilter('occupied')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'occupied' ? 'bg-red-500/30 text-red-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>Dolu ({tables.filter(t => t.status === 'occupied').length})</button>
              <button onClick={() => setFilter('reserved')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'reserved' ? 'bg-orange-500/30 text-orange-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>Rezerve ({tables.filter(t => t.status === 'reserved').length})</button>
              <button onClick={() => setFilter('broken')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'broken' ? 'bg-gray-500/30 text-gray-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>Arızalı ({tables.filter(t => t.status === 'broken').length})</button>
            </div>

            {/* Masa Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredTables.map((table) => (
                <div key={table.id} onClick={() => handleTableClick(table)} className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 ${getTableStatusColor(table.status)} shadow-lg hover:shadow-xl hover:scale-105 border border-white/10`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{getStatusIcon(table.status)}</div>
                    <h3 className="text-white font-bold text-lg">{table.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm"><FaChair size={12} /><span>{table.capacity} Kişi</span></div>
                    {table.status === 'occupied' && table.order && (
                      <>
                        <div className="mt-2 text-white/90 text-sm font-medium">₺{table.order.total}</div>
                        <div className="text-white/70 text-xs">{table.time}</div>
                      </>
                    )}
                    {table.status === 'reserved' && <div className="mt-2 text-white/80 text-sm">{table.time}</div>}
                    <div className="mt-2 text-white/60 text-[10px] uppercase">{getTableStatusText(table.status)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hızlı İşlemler */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => setShowOrderModal(true)} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/80 transition-all text-center">
                <FaPlus className="text-white text-2xl mx-auto mb-2" />
                <span className="text-white text-sm">Yeni Sipariş</span>
              </button>
              <button onClick={() => { if (occupiedTables.length === 0) { toast.warning('Dolu masa yok!'); return; } setShowPaymentModal(true); }} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/80 transition-all text-center">
                <FaMoneyBillWave className="text-white text-2xl mx-auto mb-2" />
                <span className="text-white text-sm">Ödeme Al</span>
              </button>
              <button onClick={() => { if (tables.filter(t => t.status === 'occupied').length < 1) { toast.warning('Taşıma için en az 1 dolu masa gerekli!'); return; } setShowMoveTableModal(true); }} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/80 transition-all text-center">
                <FaArrowRight className="text-white text-2xl mx-auto mb-2" />
                <span className="text-white text-sm">Masa Taşı</span>
              </button>
              <button onClick={() => { if (occupiedTables.length === 0) { toast.warning('İade edilecek masa yok!'); return; } setShowRefundModal(true); }} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/80 transition-all text-center">
                <FaTrash className="text-white text-2xl mx-auto mb-2" />
                <span className="text-white text-sm">İade/İptal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-white text-xl" />
                <div>
                  <h2 className="text-white font-bold text-lg">Yeni Sipariş</h2>
                  <p className="text-gray-400 text-xs">{selectedTable ? selectedTable.name : 'Masa seçili değil'}</p>
                </div>
              </div>
              <button onClick={() => { setShowOrderModal(false); setCart([]); }} className="text-gray-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-white/10">
              <label className="text-white text-sm font-medium mb-2 block">Masa Seç</label>
              <div className="flex flex-wrap gap-2">
                {tables.filter(t => t.status === 'empty' || t.status === 'occupied').map(table => (
                  <button key={table.id} onClick={() => setSelectedTable(table)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedTable?.id === table.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    {table.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-lg text-xs transition-all ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {filteredMenu.map(item => (
                      <button key={item.id} onClick={() => addToCart(item)} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <div className="text-left">
                          <span className="text-white text-sm">{item.name}</span>
                          <p className="text-gray-500 text-xs">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">₺{item.price}</span>
                          <FaPlus className="text-gray-400 text-xs" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">🛒 Sepet</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">Sepet boş</p>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div className="flex-1">
                              <span className="text-white text-sm">{item.name}</span>
                              {item.note && <span className="text-yellow-400 text-xs ml-2">📝 {item.note}</span>}
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs">{item.quantity}x</span>
                                <span className="text-white text-xs">₺{item.price * item.quantity}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateItemNote(item.id)} className="p-1 hover:bg-yellow-500/20 rounded transition-all" title="Not ekle/güncelle">
                                <FaStickyNote className="text-yellow-400 text-xs" />
                              </button>
                              <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-red-500/20 rounded transition-all">
                                <FaMinus className="text-red-400 text-xs" />
                              </button>
                              <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                              <button onClick={() => addToCart(item)} className="p-1 hover:bg-green-500/20 rounded transition-all">
                                <FaPlus className="text-green-400 text-xs" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 mt-3 pt-3">
                        <div className="flex justify-between text-white font-bold">
                          <span>Toplam:</span>
                          <span>₺{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                        </div>
                        <button onClick={confirmOrder} disabled={!selectedTable || cart.length === 0} className="w-full mt-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          Siparişi Onayla
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">💰 Ödeme Al</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {occupiedTables.map(table => (
                <div key={table.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium text-lg">{table.name}</p>
                      <p className="text-gray-400 text-sm">{table.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold text-xl">₺{table.order?.total || 0}</p>
                    </div>
                  </div>
                  
                  {/* Sipariş detayları */}
                  <div className="bg-black/30 rounded-lg p-3 mb-3">
                    <p className="text-gray-400 text-xs mb-2">📋 Sipariş Detayları:</p>
                    {table.order?.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-300">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₺{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-white font-bold">
                      <span>Toplam</span>
                      <span>₺{table.order?.total || 0}</span>
                    </div>
                  </div>
                  
                  {/* Ödeme butonları */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => processPayment(table.id, 'Nakit')}
                      className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FaMoneyBill /> Nakit
                    </button>
                    <button
                      onClick={() => processPayment(table.id, 'Kart')}
                      className="flex-1 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FaCreditCard /> Kart
                    </button>
                  </div>
                </div>
              ))}
              {occupiedTables.length === 0 && (
                <p className="text-gray-500 text-center py-8">Ödeme alınacak masa yok</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Masa Taşıma Modal */}
      {showMoveTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">📦 Masa Taşı</h2>
              <button onClick={() => { setShowMoveTableModal(false); setMoveFromTable(''); setMoveToTable(''); }} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">📍 Kaynak Masa (Dolu)</label>
                <select 
                  value={moveFromTable} 
                  onChange={(e) => setMoveFromTable(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {tables.filter(t => t.status === 'occupied').map(table => (
                    <option key={table.id} value={table.id}>{table.name} (₺{table.order?.total || 0})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white text-sm block mb-2">📍 Hedef Masa (Boş)</label>
                <select 
                  value={moveToTable} 
                  onChange={(e) => setMoveToTable(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {tables.filter(t => t.status === 'empty').map(table => (
                    <option key={table.id} value={table.id}>{table.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleMoveTable}
                className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
              >
                <FaArrowRight /> Taşı
              </button>
              <p className="text-gray-500 text-xs text-center">⚠️ Dolu masa boş masaya taşınacaktır.</p>
            </div>
          </div>
        </div>
      )}

      {/* İade/İptal Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">↩️ İade/İptal</h2>
              <button onClick={() => { setShowRefundModal(false); setRefundTable(null); setRefundItems([]); setSelectedRefundItems([]); }} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">Masa Seç</label>
                <select 
                  onChange={(e) => {
                    const tableId = parseInt(e.target.value);
                    const table = tables.find(t => t.id === tableId);
                    if (table && table.order) {
                      setRefundTable(table);
                      setRefundItems(table.order.items || []);
                      setSelectedRefundItems([]);
                    }
                  }}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {tables.filter(t => t.status === 'occupied' && t.order).map(table => (
                    <option key={table.id} value={table.id}>{table.name} (₺{table.order?.total || 0})</option>
                  ))}
                </select>
              </div>

              {refundItems.length > 0 && (
                <div>
                  <label className="text-white text-sm block mb-2">📋 İade Edilecek Ürünler</label>
                  <div className="space-y-2">
                    {refundItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={selectedRefundItems.includes(index)}
                          onChange={() => toggleRefundItem(index)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-white text-sm">{item.quantity}x {item.name}</span>
                          {item.note && <span className="text-yellow-400 text-xs ml-2">📝 {item.note}</span>}
                        </div>
                        <span className="text-white text-sm">₺{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-white text-sm block mb-2">İade Sebebi</label>
                <select 
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz...</option>
                  <option value="Müşteri vazgeçti">Müşteri vazgeçti</option>
                  <option value="Yanlış ürün">Yanlış ürün</option>
                  <option value="Ürün beğenilmedi">Ürün beğenilmedi</option>
                  <option value="Geç teslimat">Geç teslimat</option>
                  <option value="Hatalı sipariş">Hatalı sipariş</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              {selectedRefundItems.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    İade Tutarı: ₺{selectedRefundItems.reduce((sum, idx) => {
                      const item = refundItems[idx];
                      return sum + (item.price * item.quantity);
                    }, 0)}
                  </p>
                </div>
              )}

              <button
                onClick={processRefund}
                disabled={selectedRefundItems.length === 0 || !refundReason}
                className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                İadeyi Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">🔑 Şifre Değiştir</h2>
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

export default GarsonPanel;