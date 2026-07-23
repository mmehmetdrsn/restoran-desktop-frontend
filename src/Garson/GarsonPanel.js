// src/Garson/GarsonPanel.js
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
  FaStickyNote, FaSun, FaMoon
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// API servisleri
import { 
  tableService, 
  productService, 
  orderService, 
  paymentService, 
  authService, 
  logout 
} from '../api/api'; 

import MasaYonetimi from './pages/MasaYonetimi';
import YeniSiparisPage from './pages/YeniSiparisPage';
import HesapIslemleri from './pages/HesapIslemleri';
import MasaTasiModal from './modals/MasaTasiModal';
import IadeModal from './modals/IadeModal';
import SifreModal from './modals/SifreModal';
import MasaDurumuModal from './modals/MasaDurumuModal';

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const GarsonPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isDayMode, setIsDayMode] = useState(false);
  
  // Modallar
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderTable, setSelectedOrderTable] = useState(null);
  const [showMoveTableModal, setShowMoveTableModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusTable, setSelectedStatusTable] = useState(null);
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

  // Backend'den gelecek veriler
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtreleme
  const [filter, setFilter] = useState('all');

  // Sepet
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [], total: 0 });

  // Masa taşıma & İade state'leri
  const [moveFromTable, setMoveFromTable] = useState('');
  const [moveToTable, setMoveToTable] = useState('');
  const [refundTable, setRefundTable] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [selectedRefundItems, setSelectedRefundItems] = useState([]);
  const [refundReason, setRefundReason] = useState('');

  // 🔄 1. İlk Yükleme
  useEffect(() => {
    fetchUserData();
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    setLoading(true);
    try {
      const masalarRes = await tableService.getAll();
      const masalarData = masalarRes?.data || masalarRes;

      if (Array.isArray(masalarData)) {
        const formatliMasalar = masalarData.map(m => {
          const durumRaw = m.masaDurumu;
          const durum = typeof durumRaw === 'string' ? durumRaw.toUpperCase().trim() : '';

          const order = m.aktifSiparis || null;
          const orderStatus = order?.siparisDurumu ? String(order.siparisDurumu).toUpperCase() : '';
          const orderHasItems = Array.isArray(order?.siparisUrunleri) ? order.siparisUrunleri.length > 0 : Array.isArray(order?.items) ? order.items.length > 0 : false;
          const hasActiveOrder = order && (orderStatus || orderHasItems) && !['IPTAL', 'ODENDI', 'CANCELLED', 'COMPLETED', 'FINISHED'].includes(orderStatus);

          let status = 'empty';
          if (durum === 'DOLU') status = 'occupied';
          else if (durum === 'REZERVE') status = 'reserved';
          else if (durum === 'ARIZALI' || durum === 'KULLANIM DIŞI') status = 'broken';
          else if (!durum && hasActiveOrder) status = 'occupied';
          else status = 'empty';

          const computeTotal = (o) => {
            if (!o) return 0;
            if (typeof o.toplam === 'number') return o.toplam;
            if (typeof o.total === 'number') return o.total;
            if (typeof o.tutar === 'number') return o.tutar;
            const items = o.siparisUrunleri || o.items || o.urunler || o.siparisDetays || [];
            if (!Array.isArray(items)) return 0;
            return items.reduce((sum, it) => {
              const qty = it.adet ?? it.quantity ?? 1;
              const price = it.fiyat ?? it.price ?? it.birimFiyat ?? 0;
              return sum + qty * price;
            }, 0);
          };

          const orderWithTotal = order ? { ...order, toplam: computeTotal(order) } : null;

          const computeTime = (o) => {
            if (!o) return null;
            return o.time || o.siparisSaati || o.olusturmaTarihi || o.siparisZamani || null;
          };

          return {
            id: m.masaId,
            name: m.masaAdi || `Masa ${m.masaNo || m.masaId}`,
            status: status,
            rawStatus: durum, 
            capacity: m.kapasite || 4,
            order: orderWithTotal,
            time: computeTime(order)
          };
        });
        setTables(formatliMasalar);
      }

      const urunlerRes = await productService.getAll();
      const urunlerData = urunlerRes?.data || urunlerRes;

      if (Array.isArray(urunlerData)) {
        const formatliUrunler = urunlerData.map(u => ({
          id: u.urunId,
          name: u.urunAdi,
          price: u.fiyat,
          category: u.kategoriAdi || 'Genel'
        }));
        setMenuItems(formatliUrunler);
      }
    } catch (error) {
      toast.error("Veriler yüklenirken hata oluştu!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || parsed.adSoyad || 'Garson',
          email: parsed.email || 'garson@restoran.com',
          role: parsed.role || 'garson'
        });
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
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
      await authService.sifreDegistir(currentPassword, newPassword);
      toast.success('Şifreniz başarıyla değiştirildi! 🎉');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.Mesaj || error.message || 'Şifre değiştirilemedi!');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper Metotlar
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

  const getOrderItems = (order) => {
    if (!order) return [];
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.siparisUrunleri)) return order.siparisUrunleri;
    if (Array.isArray(order.urunler)) return order.urunler;
    if (Array.isArray(order.siparisDetays)) return order.siparisDetays;
    return [];
  };

  const normalizeOrderItem = (item) => {
    if (!item) return { id: '', name: 'Bilinmeyen Ürün', quantity: 1, price: 0, note: '' };
    if (typeof item === 'string') return { id: item, name: item, quantity: 1, price: 0, note: '' };

    return {
      id: item.id ?? item.urunId ?? item.productId ?? item.urun?.id ?? item.siparisUrunId ?? item.siparisDetayId,
      name: item.name ?? item.urunAdi ?? item.urun?.adi ?? item.ad ?? item.adi ?? 'Ürün',
      quantity: item.quantity ?? item.adet ?? 1,
      price: item.price ?? item.fiyat ?? item.birimFiyat ?? 0,
      note: item.detayNot ?? item.note ?? item.aciklama ?? ''
    };
  };

  const getOrderStatusLabel = (order) => order?.status || order?.durum || order?.siparisDurumu || 'Beklemede';
  const getOrderTimeText = (order) => order?.time || order?.siparisZamani || order?.olusturmaTarihi || order?.siparisSaati || 'Bilinmiyor';

  const getOrderTotal = (order) => {
    if (!order) return 0;
    if (typeof order.total === 'number') return order.total;
    if (typeof order.toplam === 'number') return order.toplam;
    if (typeof order.tutar === 'number') return order.tutar;

    return getOrderItems(order).reduce((sum, item) => {
      const quantity = item.quantity ?? item.adet ?? 1;
      const price = item.price ?? item.fiyat ?? item.birimFiyat ?? 0;
      return sum + quantity * price;
    }, 0);
  };

  const buildCartFromOrder = (order) => getOrderItems(order).map(item => normalizeOrderItem(item));

  const getOrderObject = (tableOrOrder) => {
    if (!tableOrOrder) return null;
    if (tableOrOrder.order) return tableOrOrder.order;
    return tableOrOrder;
  };

  const handleOpenOrderDetail = async (table) => {
    setSelectedTable(table);
    
    if (table.order && (table.order.siparisUrunleri || table.order.items)) {
      setSelectedOrderTable(table);
      setShowOrderDetailModal(true);
      return;
    }

    try {
      const response = await orderService.getAll();
      const allOrders = response?.data || response;
      
      const foundOrder = Array.isArray(allOrders)
        ? allOrders.find(o =>
            +o.masaId === +table.id || +o.tableId === +table.id ||
            o.masa?.id === +table.id || o.table?.id === +table.id
          )
        : null;

      if (foundOrder) {
        const updatedTable = {
          ...table,
          order: foundOrder
        };
        setSelectedOrderTable(updatedTable);
        setTables(prev => prev.map(t => 
          t.id === table.id ? updatedTable : t
        ));
      } else {
        setSelectedOrderTable(table);
      }
      setShowOrderDetailModal(true);
    } catch (error) {
      toast.error('Sipariş detayları alınamadı.');
      console.error(error);
    }
  };

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    
    if (table.status === 'occupied' || table.status === 'reserved') {
      await handleOpenOrderDetail(table);
    } else if (table.status === 'empty') {
      setActiveTab('yeni');
      setCurrentOrder({ tableId: table.id, items: [], total: 0 });
      setShowOrderModal(false);
    } else {
      toast.info(`${table.name} - Durum: ${getTableStatusText(table.status)}`);
    }
  };

  const handleEditOrderFromDetail = () => {
    const order = getOrderObject(selectedOrderTable);
    setCart(order ? buildCartFromOrder(order) : []);
    setSelectedTable(selectedOrderTable);
    setShowOrderModal(true);
    setShowOrderDetailModal(false);
  };

  // 🔑 Sipariş detayından "Ödeme Al" butonuna basılınca çalışan fonksiyon
  const handlePaymentFromDetail = () => {
    if (!selectedOrderTable) return;
    setSelectedTable({
      ...selectedOrderTable,
      order: getOrderObject(selectedOrderTable)
    });
    setShowPaymentModal(true);
    setShowOrderDetailModal(false);
  };

  // 🔑 Ödeme İşleme Fonksiyonu (SADECE TEK TANIMLAMA)
  const processPayment = async (tableId, method) => {
    if (paymentProcessing) return;
    setPaymentProcessing(true);

    const table = tables.find(t => t.id === tableId) || selectedTable;
    const siparisId = table?.order?.siparisId || table?.order?.id;

    if (!table || !siparisId) {
      toast.error('Ödeme alınacak sipariş bilgisi bulunamadı.');
      setPaymentProcessing(false);
      return;
    }

    try {
      const paymentData = {
        siparisId: siparisId,
        odemeTipi: method === 'Nakit' ? 'NAKIT' : 'KREDI KARTI',
        personelId: 1,
        kasaId: 1
      };

      const res = await paymentService.processPayment(paymentData);

      if (res?.error) {
        toast.error(res.error?.Mesaj || 'Ödeme alınamadı!');
        return;
      }

      toast.success(`${table.name} için ödeme başarıyla alındı! 🎉`);

      setShowPaymentModal(false);
      setSelectedTable(null);
      setSelectedOrderTable(null);
      await verileriYukle();
    } catch (error) {
      console.error('Ödeme hatası:', error);
      toast.error(error.response?.data?.Mesaj || 'Ödeme işlemi başarısız oldu!');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancelNewOrder = () => {
    setActiveTab('masa');
    setSelectedTable(null);
    setCart([]);
    setCurrentOrder({ tableId: null, items: [], total: 0 });
  };

  const handleOpenStatusModal = (table) => {
    setSelectedStatusTable(table);
    setShowStatusModal(true);
  };

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

<<<<<<< HEAD
  // ============================================================
  // ✅ DOLU MASALARI SIPARIŞLERLE EŞLEŞTİR
  // ============================================================
  const occupiedTables = tables
    .filter(t => t.status === 'occupied')
    .map(t => {
      const order = t.order || null;
      return {
        id: t.id,
        name: t.name,
        status: t.status,
        order: order ? {
          id: order.siparisId || order.id,
          total: getOrderTotal(order),
          items: getOrderItems(order)
        } : null
      };
    });

  // Sepet İşlemleri
=======
>>>>>>> 9c3ec6798f35772834ff05f9d3f509748daad53b
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
    toast.success(`${item.name} sepete eklendi`);
  };

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

  const updateItemNote = (itemId) => {
    const item = cart.find(c => c.id === itemId);
    if (item) {
      const newNote = prompt(`📝 ${item.name} için not güncelle:`, item.note || '');
      if (newNote !== null) {
        setCart(cart.map(c => 
          c.id === itemId ? { ...c, note: newNote } : c
        ));
      }
    }
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      toast.warning('Sepet boş!');
      return;
    }
    if (!selectedTable) {
      toast.warning('Lütfen bir masa seçin!');
      return;
    }

    try {
      const siparisData = {
        masaId: selectedTable.id,
        siparisTipi: 'SALON',
        personelId: 1,
        detaylar: cart.map(item => ({
          urunId: item.id,
          adet: item.quantity,
          detayNot: item.note || ''
        }))
      };

      const createdOrderResponse = await orderService.create(siparisData);
      const responseData = createdOrderResponse?.data || createdOrderResponse;
      
      toast.success('Sipariş başarıyla mutfağa iletildi! 🍳');

      const createdOrder = responseData?.Siparis || responseData;
      
      if (createdOrder) {
        const updatedTable = {
          ...selectedTable,
          status: 'occupied',
          order: {
            siparisId: createdOrder.siparisId || responseData?.SiparisId,
            toplam: createdOrder.toplamTutar || responseData?.HesaplananToplamTutar || cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
            siparisDurumu: createdOrder.siparisDurumu || 'BEKLEMEDE',
            siparisTarihi: createdOrder.siparisTarihi || new Date().toISOString(),
            siparisUrunleri: createdOrder.siparisUrunleri || cart.map(item => ({
              urunId: item.id,
              urunAdi: item.name,
              adet: item.quantity,
              fiyat: item.price || 0,
              detayNot: item.note || '',
              satirToplami: (item.price || 0) * (item.quantity || 1)
            }))
          },
          time: createdOrder.siparisTarihi || new Date().toISOString()
        };

        setSelectedTable(updatedTable);
        setTables(prev => prev.map(t => 
          t.id === updatedTable.id ? updatedTable : t
        ));
      }
<<<<<<< HEAD

      await verileriYukle();
      setActiveTab('masa');
      setShowOrderModal(false);
      setCart([]);
      
    } catch (error) {
      console.error('Sipariş hatası:', error);
      toast.error(error.response?.data?.Mesaj || error.message || 'Sipariş oluşturulamadı!');
    }
  };

  // ============================================================
  // ✅ ÖDEME İŞLEMİ (GÜNCELLENDİ - masa-odeme endpoint'i kullanıyor)
  // ============================================================
  const processPayment = async (tableId, method) => {
    // Önce masayı bul
    const table = tables.find(t => t.id === tableId);
    if (!table) {
      toast.error('Masa bulunamadı!');
      return;
    }

    // Masaya ait sipariş kontrolü
    if (!table.order) {
      toast.error('Bu masada ödenecek sipariş bulunamadı!');
      return;
    }

    if (table.order.toplam === 0) {
      toast.warning('Sipariş tutarı 0 TL, ödeme yapılamaz!');
      return;
    }

    // Personel ID'yi al
    let personelId = 1;
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        personelId = user.PersonelId || user.personelId || user.id || 1;
      }
    } catch (e) {
      console.error('Kullanıcı bilgisi alınamadı:', e);
    }

    const odemeTipiBackend = method === 'Nakit' ? 'NAKIT' : 'KREDI KARTI';

    try {
      console.log(`💰 Masa #${tableId} için ${odemeTipiBackend} ödeme alınıyor...`);
      console.log(`📦 Sipariş ID: ${table.order.siparisId}, Tutar: ${table.order.toplam}`);

      // ✅ masa-odeme endpoint'ini kullan
      const response = await paymentService.masaOdeme({
        masaId: tableId,
        odemeTipi: odemeTipiBackend,
        personelId: personelId,
        kasaId: 1
      });

      console.log('✅ Ödeme cevabı:', response);

      if (response?.status === 200) {
        toast.success('✅ Ödeme başarıyla alındı! Masa boşa çıkarıldı.');
        
        // Verileri yenile
        await verileriYukle();
        setShowPaymentModal(false);
        
        if (showOrderDetailModal) {
          setShowOrderDetailModal(false);
        }
      }
    } catch (error) {
      console.error('❌ Ödeme hatası:', error);
      
      let errorMsg = 'Ödeme alınamadı!';
      if (error.response?.data?.mesaj) {
        errorMsg = error.response.data.mesaj;
      } else if (error.response?.data?.Mesaj) {
        errorMsg = error.response.data.Mesaj;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(`❌ ${errorMsg}`);
=======

      await verileriYukle();
      setActiveTab('masa');
      setShowOrderModal(false);
      setCart([]);
      
    } catch (error) {
      console.error('Sipariş hatası:', error);
      toast.error(error.response?.data?.Mesaj || error.message || 'Sipariş oluşturulamadı!');
>>>>>>> 9c3ec6798f35772834ff05f9d3f509748daad53b
    }
  };

  const handleMoveTable = async () => {
    if (!moveFromTable || !moveToTable) {
      toast.warning('Lütfen kaynak ve hedef masa seçin!');
      return;
    }
    if (moveFromTable === moveToTable) {
      toast.warning('Kaynak ve hedef masa aynı olamaz!');
      return;
    }

    try {
      await tableService.moveTable({ kaynakMasaId: parseInt(moveFromTable, 10), hedefMasaId: parseInt(moveToTable, 10) });
      toast.success('Masa başarıyla taşındı!');
      await verileriYukle();
      setShowMoveTableModal(false);
      setMoveFromTable('');
      setMoveToTable('');
    } catch (error) {
      const errorMessage = error.response?.data?.Mesaj || error.response?.data?.message || error.message || 'Masa taşıma başarısız oldu.';
      toast.error(errorMessage);
    }
  };

  const handleRefundSelect = async (tableId) => {
    if (!tableId) return;

    const table = tables.find(t => +t.id === +tableId);
    if (!table) {
      toast.error('Masa bulunamadı.');
      return;
    }

    let order = table.order;

    if (!order) {
      try {
        const response = await orderService.getAll();
        const allOrders = response?.data || response;
        if (Array.isArray(allOrders)) {
          order = allOrders.find(o => 
            (+o.masaId === +table.id || +o.tableId === +table.id) &&
            o.siparisDurumu !== 'ODENDI' && o.siparisDurumu !== 'IPTAL'
          );
        }
      } catch (error) {
        console.error('Sipariş bilgisi çekilemedi:', error);
      }
    }

    if (!order) {
      toast.error('Bu masa için aktif sipariş bulunamadı.');
      return;
    }

    const items = getOrderItems(order).map(normalizeOrderItem);
    setRefundTable({ ...table, order });
    setRefundItems(items);
    setSelectedRefundItems([]);
    setRefundReason('');
  };

  const toggleRefundItem = (index) => {
    if (selectedRefundItems.includes(index)) {
      setSelectedRefundItems(selectedRefundItems.filter(i => i !== index));
    } else {
      setSelectedRefundItems([...selectedRefundItems, index]);
    }
  };

  const processRefund = async () => {
    if (!refundTable?.order?.siparisId) {
      toast.error('İade edilecek sipariş bilgisi bulunamadı.');
      return;
    }
    if (selectedRefundItems.length === 0) {
      toast.warning('Lütfen iade edilecek ürünleri seçin.');
      return;
    }
    if (!refundReason) {
      toast.warning('Lütfen iade nedeni seçin.');
      return;
    }

    try {
      const iadeIstekleri = selectedRefundItems.map((index) => {
        const item = refundItems[index];
        const birimFiyat = item?.price || 0;
        const adet = item?.quantity || 1;
        const toplamTutar = birimFiyat * adet;

        return paymentService.processRefund({
          iadeSebebi: refundReason,
          iadeDurumu: 'BEKLEMEDE',
          iadeTutari: toplamTutar,
          siparisDetayId: item?.id || null,
          urunId: item?.id || null,
          personelId: 1
        });
      });

      await Promise.all(iadeIstekleri);

      toast.success('İade talebi başarıyla oluşturuldu! 🎉');
      await verileriYukle();
      
      setShowRefundModal(false);
      setRefundTable(null);
      setRefundItems([]);
      setSelectedRefundItems([]);
      setRefundReason('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.Mesaj ||
        error.response?.data?.message ||
        error.message ||
        'İade işlemi başarısız oldu.';
      toast.error(errorMessage);
    }
  };

  const categories = ['Tümü', ...new Set(menuItems.map(item => item.category))];
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredMenu = selectedCategory === 'Tümü' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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
      <div className={`absolute inset-0 ${isDayMode ? 'bg-white/30' : 'bg-black/40'} backdrop-blur-xl`}></div>
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative lg:flex lg:flex-col relative
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${isDayMode ? 'bg-slate-50/95 text-slate-900 border-slate-200/50' : 'bg-black/90 text-white border-white/10'}
          backdrop-blur-sm
          h-screen transition-all duration-300 overflow-y-auto
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-50 flex-shrink-0
        `}>
          <div className={`flex items-center justify-between p-4 border-b ${isDayMode ? 'border-slate-200/60' : 'border-white/10'}`}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h1 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-sm`}>SekerRestoran</h1>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[9px]`}>Garson Paneli</p>
                </div>
              </div>
            ) : (
              <div className="text-2xl mx-auto">🍽️</div>
            )}
            <button onClick={toggleSidebar} className={`${isDayMode ? 'text-slate-700 hover:text-slate-900' : 'text-gray-400 hover:text-white'} hidden lg:block`}>
              {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>

          <div className="py-4 px-3">
            <button onClick={() => { setActiveTab('masa'); setShowOrderModal(false); setShowPaymentModal(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'masa' ? (isDayMode ? 'bg-slate-300 text-slate-900 shadow-sm' : 'bg-white/20 text-white') : (isDayMode ? 'text-slate-700 bg-slate-100 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 bg-white/10 hover:text-white hover:bg-white/15')}`}>
              <FaTable size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className={`${isDayMode ? 'text-slate-900' : 'text-sm font-medium text-white'}`}>Masa Yönetimi</p>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-[10px] text-gray-500'}`}>Salon planı</p>
                </div>
              )}
            </button>

            <button onClick={() => { setActiveTab('yeni'); setShowOrderModal(false); setShowPaymentModal(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mt-2 ${activeTab === 'yeni' ? (isDayMode ? 'bg-slate-300 text-slate-900 shadow-sm' : 'bg-white/20 text-white') : (isDayMode ? 'text-slate-700 bg-slate-100 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 bg-white/10 hover:text-white hover:bg-white/15')}`}>
              <FaClipboardList size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className={`${isDayMode ? 'text-slate-900' : 'text-sm font-medium text-white'}`}>Yeni Sipariş</p>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-[10px] text-gray-500'}`}>Sipariş oluştur</p>
                </div>
              )}
            </button>

            <button onClick={() => { setActiveTab('hesap'); setShowOrderModal(false); setShowPaymentModal(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mt-2 ${activeTab === 'hesap' ? (isDayMode ? 'bg-slate-300 text-slate-900 shadow-sm' : 'bg-white/20 text-white') : (isDayMode ? 'text-slate-700 bg-slate-100 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 bg-white/10 hover:text-white hover:bg-white/15')}`}>
              <FaReceipt size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className={`${isDayMode ? 'text-slate-900' : 'text-sm font-medium text-white'}`}>Hesap İşlemleri</p>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-[10px] text-gray-500'}`}>Ödeme & fiş</p>
                </div>
              )}
            </button>

            <div className="mt-6 space-y-2">
              <div className="px-3">
                {sidebarOpen && <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-500'} text-xs uppercase tracking-[0.2em]`}>Hızlı İşlemler</p>}
              </div>
              <button onClick={() => setShowMoveTableModal(true)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isDayMode ? 'text-slate-700 bg-slate-200/80 hover:text-slate-900 hover:bg-slate-300' : 'text-gray-300 bg-white/5 hover:text-white hover:bg-white/15'}`}>
                <FaTruck size={16} />
                {sidebarOpen && <span className="text-sm">Masa Taşı</span>}
              </button>
              <button onClick={() => setShowRefundModal(true)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isDayMode ? 'text-slate-700 bg-slate-200/80 hover:text-slate-900 hover:bg-slate-300' : 'text-gray-300 bg-white/5 hover:text-white hover:bg-white/15'}`}>
                <FaArrowLeft size={16} />
                {sidebarOpen && <span className="text-sm">İade / İptal</span>}
              </button>
            </div>

            <div className={`border-t my-3 ${isDayMode ? 'border-slate-200/60' : 'border-white/10'}`}></div>
            <div className="absolute left-4 bottom-4">
              <button
                onClick={() => setIsDayMode(prev => !prev)}
                title={isDayMode ? 'Gece Modu' : 'Gündüz Modu'}
                className={`flex ${sidebarOpen ? 'justify-between w-[calc(100%-2rem)]' : 'justify-center w-12'} items-center gap-3 px-3 py-3 rounded-2xl transition-all ${isDayMode ? 'bg-slate-300 text-slate-900 hover:bg-slate-400' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
              >
                {isDayMode ? <FaMoon size={18} /> : <FaSun size={18} />}
                {sidebarOpen && <span className="text-sm">{isDayMode ? 'Gece Modu' : 'Gündüz Modu'}</span>}
              </button>
            </div>

            <button onClick={() => setShowPasswordModal(true)} className={`${isDayMode ? 'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-200/70' : 'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <FaKey size={18} />
              {sidebarOpen && <span className="text-sm">Şifre Değiştir</span>}
            </button>

            <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mt-2 ${isDayMode ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-100' : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'}`}>
              <FaSignOutAlt size={18} />
              {sidebarOpen && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </div>
        </div>

        {/* İçerik */}
        <div className={`flex-1 ${isDayMode ? 'bg-slate-50 text-slate-900' : ''}`}>
          <div className={`${isDayMode ? 'bg-white/80 text-slate-900 border-slate-200/30' : 'bg-black/80 text-white'} backdrop-blur-sm border-b sticky top-0 z-30`}>
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-end gap-4">
                <div className="text-right hidden sm:block">
                  <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-sm font-medium`}>{userData.name}</p>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[10px]`}>{userData.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-6">
            {loading ? (
              <div className={`flex items-center justify-center py-20 gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                <FaSpinner className="animate-spin" size={24} />
                <span>Veriler Yükleniyor...</span>
              </div>
            ) : (
              <>
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
                    onOpenStatusModal={handleOpenStatusModal}
                    isDayMode={isDayMode}
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
                    onCancelSelection={handleCancelNewOrder}
                    tables={tables}
                    isDayMode={isDayMode}
                  />
                )}

                {activeTab === 'hesap' && (
                  <HesapIslemleri 
                    occupiedTables={occupiedTables} 
                    processPayment={processPayment} 
                    isDayMode={isDayMode}
                    onPaymentSuccess={(masaId) => {
                      console.log(`✅ Masa ${masaId} ödemesi başarılı!`);
                      verileriYukle();
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modallar */}
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
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">💰 Ödeme Al</h2>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedTable(null);
                }} 
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
<<<<<<< HEAD
            <HesapIslemleri 
              occupiedTables={occupiedTables} 
              processPayment={processPayment} 
              isDayMode={isDayMode}
              onPaymentSuccess={(masaId) => {
                console.log(`✅ Masa ${masaId} ödemesi başarılı!`);
                verileriYukle();
              }}
=======
            
            <HesapIslemleri 
              occupiedTables={occupiedTables} 
              processPayment={processPayment} 
              isDayMode={isDayMode} 
              selectedTable={selectedTable}
>>>>>>> 9c3ec6798f35772834ff05f9d3f509748daad53b
            />
          </div>
        </div>
      )}

      {showOrderDetailModal && selectedOrderTable && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm`}>
          <div className={`${isDayMode ? 'bg-white text-slate-900' : 'bg-black/95 text-white'} backdrop-blur-sm rounded-2xl border ${isDayMode ? 'border-slate-200' : 'border-white/10'} shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h2 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-xl`}>
                  {selectedOrderTable.name} - Sipariş Detayları
                </h2>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Durum:
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedOrderTable.status === 'occupied' ? 'bg-red-500/20 text-red-400' :
                    selectedOrderTable.status === 'reserved' ? 'bg-orange-500/20 text-orange-400' :
                    selectedOrderTable.status === 'empty' ? 'bg-green-500/20 text-green-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {getTableStatusText(selectedOrderTable.status)}
                  </span>
                </div>
                
                <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm mt-1`}>
                  {getOrderTimeText(getOrderObject(selectedOrderTable))}
                </p>
                <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${isDayMode ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-white/10 text-white border border-white/10'}`}>
                  {getOrderStatusLabel(getOrderObject(selectedOrderTable))}
                </span>
              </div>
              <button onClick={() => setShowOrderDetailModal(false)} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const order = getOrderObject(selectedOrderTable);
                const items = getOrderItems(order);
                
                if (items.length === 0) {
                  return (
                    <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm text-center py-8`}>
                      Bu siparişe ait ürün bulunamadı.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className={`flex justify-between items-center px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-xs uppercase font-semibold`}>
                      <span>Ürün</span>
                      <span>Tutar</span>
                    </div>
                    
                    {items.map((item, index) => {
                      const normalized = normalizeOrderItem(item);
                      const subtotal = normalized.quantity * normalized.price;
                      return (
                        <div key={index} className={`${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'} border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3`}>
                          <div className="flex-1">
                            <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
                              {normalized.name}
                            </p>
                            <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm`}>
                              {normalized.quantity} x ₺{normalized.price.toFixed(2)}
                              {normalized.note && (
                                <span className={`${isDayMode ? 'text-slate-600' : 'text-yellow-400'} text-xs ml-2`}>
                                  📝 {normalized.note}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
                            ₺{subtotal.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className={`mt-6 border-t ${isDayMode ? 'border-slate-200' : 'border-white/10'} pt-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-sm`}>Toplam Tutar</p>
                  <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-2xl font-bold`}>
                    ₺{getOrderTotal(getOrderObject(selectedOrderTable)).toFixed(2)}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                  {selectedOrderTable.status === 'occupied' && (
                    <>
                      <button 
                        onClick={handleEditOrderFromDetail} 
                        className={`px-4 py-3 ${isDayMode ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-white/10 hover:bg-white/15 text-white'} rounded-xl transition-all`}
                      >
                        Sipariş Ekle / Düzenle
                      </button>
                      <button 
                        onClick={handlePaymentFromDetail} 
                        className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl transition-all"
                      >
                        Ödeme Al
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setShowOrderDetailModal(false)} 
                    className={`px-4 py-3 ${isDayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/10 hover:bg-white/15 text-gray-300'} rounded-xl transition-all`}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
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

      <MasaDurumuModal
        showStatusModal={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedStatusTable(null);
        }}
        selectedTable={selectedStatusTable}
        verileriYukle={verileriYukle}
        onOpenOrderModal={(tbl) => {
          setSelectedTable(tbl);
          setActiveTab('yeni');
        }}
        onOpenMoveModal={(tbl) => {
          setMoveFromTable(String(tbl.id));
          setShowMoveTableModal(true);
        }}
        onOpenPaymentModal={(tbl) => {
          setSelectedOrderTable(tbl);
          setShowPaymentModal(true);
        }}
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