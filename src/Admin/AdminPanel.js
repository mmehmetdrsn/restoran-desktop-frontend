// src/Admin/AdminPanel.js
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
  FaStar, FaPizzaSlice, FaWineBottle, FaAngleUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { 
  orderService,
  productService,
  categoryService,
  materialService,
  tableService,
  reservationService,
  personnelService,
  userService,
  paymentService,
  cashService,
  notificationService,
  reportService
} from '../api/api';

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

  // ============ VERİ STATE'LERİ ============
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cash, setCash] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ============ DASHBOARD STATE'LERİ ============
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    date: new Date().toLocaleDateString('tr-TR'),
    changePercent: 0,
    oncekiGunCiro: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // ============ MODAL STATE'LERİ ============
  const [showKategoriListesi, setShowKategoriListesi] = useState(false);
  const [showKategoriEkleModal, setShowKategoriEkleModal] = useState(false);
  const [newKategoriAdi, setNewKategoriAdi] = useState('');
  const [kategoriLoading, setKategoriLoading] = useState(false);

  const [showUrunListesi, setShowUrunListesi] = useState(false);
  const [urunListesi, setUrunListesi] = useState([]);

  const [showPersonelListesi, setShowPersonelListesi] = useState(false);
  const [personelListesi, setPersonelListesi] = useState([]);

  const [showUrunEkleModal, setShowUrunEkleModal] = useState(false);
  const [urunAdi, setUrunAdi] = useState('');
  const [urunFiyat, setUrunFiyat] = useState('');
  const [urunKategoriId, setUrunKategoriId] = useState('');
  const [urunLoading, setUrunLoading] = useState(false);

  // ============ KULLANICI BİLGİLERİ ============
  const [userData, setUserData] = useState({
    name: 'Admin',
    email: 'admin@restoran.com',
    role: 'admin'
  });

  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, title: 'Genel Bakış' },
    { id: 'product_menu', icon: <FaUtensils />, title: 'Ürün ve Menü Yönetimi' },
    { id: 'members', icon: <FaUsers />, title: 'Üye Yönetimi' },
    { id: 'finance', icon: <FaMoneyBillWave />, title: 'Finans ve Kasa Yönetimi' },
    { id: 'stock', icon: <FaBoxes />, title: 'Depo / Stok Yönetimi' },
    { id: 'orders', icon: <FaClipboardList />, title: 'Sipariş Yönetimi' },
    { id: 'tables', icon: <FaTable />, title: 'Masa ve Rezervasyon Yönetimi' },
    { id: 'personnel', icon: <FaUserCog />, title: 'Personel Yönetimi' },
    { id: 'reports', icon: <FaChartBar />, title: 'Raporlar ve İstatistikler' }
  ];

  // ============ DASHBOARD VERİLERİNİ ÇEK ============
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [ciroRes, satanlarRes, sonSiparislerRes] = await Promise.all([
        reportService.getGunlukCiro(),
        reportService.getEnCokSatanlar(30),
        reportService.getSonSiparisler(10)
      ]);

      if (ciroRes.data) {
        const data = ciroRes.data;
        setDashboardData({
          totalRevenue: data.ciro || 0,
          totalOrders: data.siparisSayisi || 0,
          date: data.tarih || new Date().toLocaleDateString('tr-TR'),
          changePercent: data.oncekiGunCiro > 0 
            ? Math.round(((data.ciro - data.oncekiGunCiro) / data.oncekiGunCiro) * 100) 
            : 0,
          oncekiGunCiro: data.oncekiGunCiro || 0
        });
      }

      if (satanlarRes.data) {
        const products = satanlarRes.data.map((p, index) => ({
          name: p.urunAdi || 'Bilinmiyor',
          quantity: p.toplamAdet || 0,
          revenue: p.toplamCiro || 0,
          index: index + 1
        }));
        setTopProducts(products);
      }

      if (sonSiparislerRes.data) {
        setRecentOrders(sonSiparislerRes.data);
      }

      console.log('✅ Dashboard verileri başarıyla yüklendi!');
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      toast.error('Dashboard verileri yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // ============ TÜM VERİLERİ ÇEK ============
  const fetchAllData = async () => {
    try {
      const [ordersRes, productsRes, categoriesRes, materialsRes, 
             tablesRes, reservationsRes, personnelRes, usersRes,
             paymentsRes, cashRes] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        categoryService.getAll(),
        materialService.getAll(),
        tableService.getAll(),
        reservationService.getAll(),
        personnelService.getAll(),
        userService.getAll(),
        paymentService.getAll(),
        cashService.getAll()
      ]);

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setMaterials(materialsRes.data || []);
      setTables(tablesRes.data || []);
      setReservations(reservationsRes.data || []);
      setPersonnel(personnelRes.data || []);
      setUsers(usersRes.data || []);
      setPayments(paymentsRes.data || []);
      setCash(cashRes.data || []);
      
      setNotifications([]);
      setUnreadCount(0);

      console.log('✅ Veriler başarıyla yüklendi!');
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      toast.error('Veriler yüklenirken hata oluştu!');
    }
  };

  // ============ ÜRÜN LİSTELE ============
  const urunleriListele = async () => {
    try {
      const response = await productService.getAll();
      const urunler = response.data || [];
      setUrunListesi(urunler);
      setShowUrunListesi(true);
      toast.info(`📋 ${urunler.length} ürün bulundu`);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast.error('❌ Ürünler yüklenirken hata oluştu!');
    }
  };

  // ============ PERSONEL LİSTELE ============
  const personelListele = async () => {
    try {
      const response = await personnelService.getAll();
      const personeller = response.data || [];
      setPersonelListesi(personeller);
      setShowPersonelListesi(true);
      toast.info(`📋 ${personeller.length} personel bulundu`);
    } catch (error) {
      console.error('Personeller yüklenirken hata:', error);
      toast.error('❌ Personeller yüklenirken hata oluştu!');
    }
  };

  // ============ KATEGORİ İŞLEMLERİ ============
  const kategorileriYukle = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data || []);
      setShowKategoriListesi(true);
      toast.info(`📋 ${response.data?.length || 0} kategori bulundu`);
    } catch (err) {
      toast.error('Kategoriler yüklenirken hata oluştu!');
    }
  };

  const handleKategoriEkle = async (e) => {
    e.preventDefault();
    if (!newKategoriAdi || newKategoriAdi.trim().length < 1) {
      toast.warning('Lütfen kategori adı girin.');
      return;
    }
    try {
      setKategoriLoading(true);
      await categoryService.create({ kategoriAdi: newKategoriAdi.trim() });
      toast.success('✅ Kategori eklendi.');
      setNewKategoriAdi('');
      setShowKategoriEkleModal(false);
      await kategorileriYukle();
    } catch (err) {
      toast.error('Kategori eklenirken hata oluştu!');
    } finally {
      setKategoriLoading(false);
    }
  };

  const handleKategoriSil = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await categoryService.delete(id);
      toast.success('✅ Kategori silindi.');
      await kategorileriYukle();
    } catch (err) {
      toast.error('Kategori silinirken hata oluştu!');
    }
  };

  const handleKategoriSilPrompt = async () => {
    const id = prompt('🗑️ Silinecek kategori ID\'sini girin:');
    if (!id) return;
    await handleKategoriSil(parseInt(id));
  };

  const handleKategoriDuzenle = async () => {
    const id = prompt('✏️ Düzenlenecek kategori ID\'sini girin:');
    if (!id) return;
    
    try {
      const response = await categoryService.getById(parseInt(id));
      const kategori = response.data;
      
      if (!kategori) {
        toast.error('❌ Kategori bulunamadı!');
        return;
      }
      
      const yeniAd = prompt('📝 Yeni kategori adı:', kategori.kategoriAdi || kategori.name);
      
      await categoryService.update(parseInt(id), {
        kategoriAdi: yeniAd || kategori.kategoriAdi
      });
      
      toast.success('✅ Kategori başarıyla güncellendi!');
      await kategorileriYukle();
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error);
      toast.error('❌ Kategori güncellenirken hata oluştu!');
    }
  };

  // ============ ÜRÜN İŞLEMLERİ ============
  const handleUrunEkle = async (e) => {
    e.preventDefault();
    if (!urunAdi || !urunFiyat || !urunKategoriId) {
      toast.warning('Lütfen tüm alanları doldurun.');
      return;
    }
    const fiyat = Number(urunFiyat);
    if (isNaN(fiyat) || fiyat <= 0) {
      toast.warning('Geçerli bir fiyat girin.');
      return;
    }
    try {
      setUrunLoading(true);
      await productService.create({
        urunAdi: urunAdi.trim(),
        fiyat: fiyat,
        kategoriId: parseInt(urunKategoriId)
      });
      toast.success('✅ Ürün eklendi.');
      setUrunAdi('');
      setUrunFiyat('');
      setUrunKategoriId('');
      setShowUrunEkleModal(false);
      const productsRes = await productService.getAll();
      setProducts(productsRes.data || []);
    } catch (err) {
      toast.error('Ürün eklenirken hata oluştu!');
    } finally {
      setUrunLoading(false);
    }
  };

  const handleUrunSil = async () => {
    const id = prompt('🗑️ Silinecek ürün ID\'sini girin:');
    if (!id) return;
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      await productService.delete(parseInt(id));
      toast.success('✅ Ürün başarıyla silindi!');
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      toast.error('❌ Ürün silinirken hata oluştu!');
    }
  };

  const handleUrunDuzenle = async () => {
    const id = prompt('✏️ Düzenlenecek ürün ID\'sini girin:');
    if (!id) return;
    
    try {
      const response = await productService.getById(parseInt(id));
      const urun = response.data;
      
      if (!urun) {
        toast.error('❌ Ürün bulunamadı!');
        return;
      }
      
      const yeniAd = prompt('📝 Yeni ürün adı:', urun.urunAdi || urun.name);
      const yeniFiyat = prompt('💰 Yeni fiyat:', urun.fiyat || urun.price);
      const yeniKategori = prompt('📂 Yeni kategori:', urun.kategori || urun.kategoriAdi);
      
      await productService.update(parseInt(id), {
        urunAdi: yeniAd || urun.urunAdi,
        fiyat: yeniFiyat ? parseFloat(yeniFiyat) : urun.fiyat,
        kategori: yeniKategori || urun.kategori
      });
      
      toast.success('✅ Ürün başarıyla güncellendi!');
      const productsRes = await productService.getAll();
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      toast.error('❌ Ürün güncellenirken hata oluştu!');
    }
  };

  // ============ PERSONEL İŞLEMLERİ ============
  const handlePersonelEkle = async () => {
    const ad = prompt('👤 Personel adı:');
    if (!ad) return;
    const soyad = prompt('👤 Personel soyadı:');
    const kullaniciAdi = prompt('🔑 Kullanıcı adı:');
    if (!kullaniciAdi) return;
    const sifre = prompt('🔒 Şifre:');
    if (!sifre) return;
    const rol = prompt('📋 Rol (admin/garson/asci/kurye):') || 'garson';
    
    try {
      await personnelService.create({
        personelAdi: ad,
        personelSoyadi: soyad || '',
        kullaniciAdi: kullaniciAdi,
        personelSifre: sifre,
        rol: rol,
        isActive: true
      });
      toast.success('✅ Personel başarıyla eklendi!');
      const response = await personnelService.getAll();
      setPersonnel(response.data || []);
    } catch (error) {
      console.error('Personel eklenirken hata:', error);
      toast.error('❌ Personel eklenirken hata oluştu!');
    }
  };

  const handlePersonelSil = async () => {
    const id = prompt('🗑️ Silinecek personel ID\'sini girin:');
    if (!id) return;
    if (!window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    
    try {
      await personnelService.delete(parseInt(id));
      toast.success('✅ Personel başarıyla silindi!');
      const response = await personnelService.getAll();
      setPersonnel(response.data || []);
    } catch (error) {
      console.error('Personel silinirken hata:', error);
      toast.error('❌ Personel silinirken hata oluştu!');
    }
  };

  const handlePersonelDuzenle = async () => {
    const id = prompt('✏️ Düzenlenecek personel ID\'sini girin:');
    if (!id) return;
    
    try {
      const response = await personnelService.getById(parseInt(id));
      const personel = response.data;
      
      if (!personel) {
        toast.error('❌ Personel bulunamadı!');
        return;
      }
      
      const ad = prompt('👤 Yeni ad:', personel.personelAdi);
      const soyad = prompt('👤 Yeni soyad:', personel.personelSoyadi);
      const rol = prompt('📋 Yeni rol:', personel.rol);
      
      await personnelService.update(parseInt(id), {
        personelAdi: ad || personel.personelAdi,
        personelSoyadi: soyad || personel.personelSoyadi,
        rol: rol || personel.rol
      });
      
      toast.success('✅ Personel başarıyla güncellendi!');
      const personnelRes = await personnelService.getAll();
      setPersonnel(personnelRes.data || []);
    } catch (error) {
      console.error('Personel güncellenirken hata:', error);
      toast.error('❌ Personel güncellenirken hata oluştu!');
    }
  };

  // ============ MASA İŞLEMLERİ ============
  const handleMasaEkle = async () => {
    const masaNo = prompt('🪑 Masa numarası:');
    if (!masaNo) return;
    const kapasite = prompt('👥 Kapasite:');
    
    try {
      await tableService.create({
        masaNo: parseInt(masaNo),
        kapasite: parseInt(kapasite) || 4,
        masaDurumu: 'BOŞ'
      });
      toast.success('✅ Masa başarıyla eklendi!');
      const response = await tableService.getAll();
      setTables(response.data || []);
    } catch (error) {
      console.error('Masa eklenirken hata:', error);
      toast.error('❌ Masa eklenirken hata oluştu!');
    }
  };

  const handleMasaSil = async () => {
    const id = prompt('🗑️ Silinecek masa ID\'sini girin:');
    if (!id) return;
    if (!window.confirm('Bu masayı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await tableService.delete(parseInt(id));
      toast.success('✅ Masa başarıyla silindi!');
      const response = await tableService.getAll();
      setTables(response.data || []);
    } catch (error) {
      console.error('Masa silinirken hata:', error);
      toast.error('❌ Masa silinirken hata oluştu!');
    }
  };

  const handleMasaDuzenle = async () => {
    const id = prompt('✏️ Düzenlenecek masa ID\'sini girin:');
    if (!id) return;
    
    try {
      const response = await tableService.getById(parseInt(id));
      const masa = response.data;
      
      if (!masa) {
        toast.error('❌ Masa bulunamadı!');
        return;
      }
      
      const masaNo = prompt('🪑 Yeni masa numarası:', masa.masaNo);
      const kapasite = prompt('👥 Yeni kapasite:', masa.kapasite);
      
      await tableService.update(parseInt(id), {
        masaNo: parseInt(masaNo) || masa.masaNo,
        kapasite: parseInt(kapasite) || masa.kapasite
      });
      
      toast.success('✅ Masa başarıyla güncellendi!');
      const response2 = await tableService.getAll();
      setTables(response2.data || []);
    } catch (error) {
      console.error('Masa güncellenirken hata:', error);
      toast.error('❌ Masa güncellenirken hata oluştu!');
    }
  };

  // ============ REZERVASYON İŞLEMLERİ ============
  const handleRezervasyonEkle = async () => {
    const masaId = prompt('🪑 Masa ID:');
    if (!masaId) return;
    const musteriAdi = prompt('👤 Müşteri adı:');
    if (!musteriAdi) return;
    const tarih = prompt('📅 Tarih (YYYY-MM-DD):');
    if (!tarih) return;
    const saat = prompt('🕐 Saat (HH:mm):');
    if (!saat) return;
    
    try {
      await reservationService.create({
        masaId: parseInt(masaId),
        musteriAdi: musteriAdi,
        tarih: tarih,
        saat: saat
      });
      toast.success('✅ Rezervasyon başarıyla eklendi!');
      const response = await reservationService.getAll();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Rezervasyon eklenirken hata:', error);
      toast.error('❌ Rezervasyon eklenirken hata oluştu!');
    }
  };

  const handleRezervasyonSil = async () => {
    const id = prompt('🗑️ Silinecek rezervasyon ID\'sini girin:');
    if (!id) return;
    if (!window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) return;
    
    try {
      await reservationService.delete(parseInt(id));
      toast.success('✅ Rezervasyon başarıyla silindi!');
      const response = await reservationService.getAll();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Rezervasyon silinirken hata:', error);
      toast.error('❌ Rezervasyon silinirken hata oluştu!');
    }
  };

  const handleRezervasyonDuzenle = async () => {
    const id = prompt('✏️ Düzenlenecek rezervasyon ID\'sini girin:');
    if (!id) return;
    
    try {
      const response = await reservationService.getById(parseInt(id));
      const rezervasyon = response.data;
      
      if (!rezervasyon) {
        toast.error('❌ Rezervasyon bulunamadı!');
        return;
      }
      
      const musteriAdi = prompt('👤 Yeni müşteri adı:', rezervasyon.musteriAdi);
      const tarih = prompt('📅 Yeni tarih:', rezervasyon.tarih?.split('T')[0]);
      const saat = prompt('🕐 Yeni saat:', rezervasyon.saat);
      
      await reservationService.update(parseInt(id), {
        musteriAdi: musteriAdi || rezervasyon.musteriAdi,
        tarih: tarih || rezervasyon.tarih?.split('T')[0],
        saat: saat || rezervasyon.saat
      });
      
      toast.success('✅ Rezervasyon başarıyla güncellendi!');
      const response2 = await reservationService.getAll();
      setReservations(response2.data || []);
    } catch (error) {
      console.error('Rezervasyon güncellenirken hata:', error);
      toast.error('❌ Rezervasyon güncellenirken hata oluştu!');
    }
  };

  // ============ KULLANICI BİLGİLERİ ============
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

  // ============ USE EFFECT ============
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    fetchAllData();
    fetchUserData();
  }, [navigate]);

  // ============ ÇIKIŞ ============
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (err) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // ============ ŞİFRE DEĞİŞTİR ============
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
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      toast.error('Şifre değiştirilemedi!');
    } finally {
      setPasswordLoading(false);
    }
  };

  // ============ DURUM RENKLERİ ============
  const getStatusColor = (status) => {
    switch(status) {
      case 'Tamamlandı': return 'bg-green-500/20 text-green-400';
      case 'Hazırlanıyor': return 'bg-yellow-500/20 text-yellow-400';
      case 'Bekliyor': return 'bg-orange-500/20 text-orange-400';
      case 'Teslim Edildi': return 'bg-blue-500/20 text-blue-400';
      case 'İptal': return 'bg-red-500/20 text-red-400';
      case 'Ödendi': return 'bg-purple-500/20 text-purple-400';
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

  // ============ DASHBOARD RENDER ============
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
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-2">
            {dashboardData.date} - Restoran Özeti
          </h2>
          <p className="text-gray-400 text-sm mb-4">İşletmenizin anlık verileri</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-gray-400 text-xs">Bugünkü Ciro</p>
              <p className="text-white text-3xl font-bold">₺{dashboardData.totalRevenue.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${dashboardData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.changePercent >= 0 ? '↑' : '↓'} %{Math.abs(dashboardData.changePercent)}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-gray-400 text-xs">Dünkü Ciro</p>
              <p className="text-white text-3xl font-bold">₺{dashboardData.oncekiGunCiro?.toLocaleString() || 0}</p>
              <p className="text-gray-400 text-xs mt-1">Önceki gün</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-gray-400 text-xs">Toplam Sipariş</p>
              <p className="text-white text-3xl font-bold">{dashboardData.totalOrders}</p>
              <p className="text-gray-400 text-xs mt-1">Bugün</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">En Çok Satanlar</h2>
              <FaFire className="text-orange-500" />
            </div>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Henüz veri yok</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {product.index}. {product.name}
                      </p>
                      <p className="text-gray-400 text-xs">{product.quantity} porsiyon</p>
                    </div>
                    <p className="text-white font-semibold">₺{product.revenue.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-all">
              Tüm Menüyü Gör
              <FaArrowRight size={12} />
            </button>
          </div>

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
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-gray-400">Henüz sipariş yok</td></tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2 px-2 text-white text-xs">{order.siparisNo}</td>
                        <td className="py-2 px-2 text-gray-300 text-xs">{order.masa}</td>
                        <td className="py-2 px-2 text-gray-400 text-xs">{order.icerik}</td>
                        <td className="py-2 px-2 text-gray-400 text-xs">{order.saat}</td>
                        <td className="py-2 px-2 text-white text-xs font-medium">₺{order.tutar}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-1 rounded text-[10px] ${getStatusColor(order.durum)}`}>
                            {order.durum}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
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
        <ActionButton icon={<FaPlus />} label="Ürün Ekle" onClick={() => { kategorileriYukle(); setShowUrunEkleModal(true); }} />
        <ActionButton icon={<FaTrash />} label="Ürün Sil" onClick={handleUrunSil} />
        <ActionButton icon={<FaEdit />} label="Ürün Düzenle" onClick={handleUrunDuzenle} />
        <ActionButton icon={<FaList />} label="Ürün Listele" onClick={urunleriListele} />
        <ActionButton icon={<FaPizzaSlice />} label="Menü Listele" onClick={() => toast.info(`📋 ${products.length} menü ürünü bulunuyor`)} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs mb-3">Kategori İşlemleri</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ActionButton icon={<FaPlusCircle />} label="Kategori Ekle" onClick={() => setShowKategoriEkleModal(true)} />
          <ActionButton icon={<FaTrash />} label="Kategori Sil" onClick={handleKategoriSilPrompt} />
          <ActionButton icon={<FaEdit />} label="Kategori Düzenle" onClick={handleKategoriDuzenle} />
          <ActionButton icon={<FaList />} label="Kategori Listele" onClick={kategorileriYukle} />
        </div>
      </div>

      {showKategoriListesi && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs mb-3">Kategoriler ({categories.length})</p>
          <div className="space-y-2">
            {categories.map((k) => (
              <div key={k.kategoriId || k.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white text-sm">{k.kategoriAdi || k.name}</span>
                  <div className="text-gray-400 text-xs">#{k.kategoriId || k.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleKategoriSil(k.kategoriId || k.id)} className="text-red-400 hover:text-red-300">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ürün Listesi Modal */}
      {showUrunListesi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold text-lg">📋 Ürün Listesi</h2>
                <p className="text-gray-400 text-xs">Toplam {urunListesi.length} ürün</p>
              </div>
              <button onClick={() => setShowUrunListesi(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-white/10">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Ürün Adı</th>
                    <th className="text-left py-2 px-3">Kategori</th>
                    <th className="text-right py-2 px-3">Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {urunListesi.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-gray-400">Henüz ürün eklenmemiş</td></tr>
                  ) : (
                    urunListesi.map((urun, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-gray-400 text-xs">{index + 1}</td>
                        <td className="py-2 px-3 text-white text-sm">{urun.urunAdi || urun.name || 'Bilinmiyor'}</td>
                        <td className="py-2 px-3 text-gray-400 text-sm">{urun.kategori || urun.kategoriAdi || '-'}</td>
                        <td className="py-2 px-3 text-yellow-400 text-sm text-right">₺{urun.fiyat || urun.price || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-white/10 flex justify-between">
              <span className="text-gray-400 text-xs">Toplam: {urunListesi.length} ürün</span>
              <button onClick={() => setShowUrunListesi(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============ ÜYE YÖNETİMİ ============
  const renderMembers = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaUsers />} title="Üye Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel ve müşteri üye işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionButton icon={<FaUserPlus />} label="Üye Ekle" onClick={() => toast.warning('⚠️ Üye ekleme işlemi henüz aktif değil.')} />
        <ActionButton icon={<FaUserMinus />} label="Üye Sil" onClick={() => toast.warning('⚠️ Üye silme işlemi henüz aktif değil.')} />
        <ActionButton icon={<FaUserEdit />} label="Üye Düzenle" onClick={() => toast.warning('⚠️ Üye düzenleme işlemi henüz aktif değil.')} />
        <ActionButton icon={<FaList />} label="Üye Listele" onClick={() => toast.info(`📋 ${users.length} üye bulunuyor`)} />
        <ActionButton icon={<FaEye />} label="Üye Detay" onClick={() => toast.warning('⚠️ Üye detay işlemi henüz aktif değil.')} />
      </div>
    </div>
  );

  // ============ FİNANS VE KASA YÖNETİMİ ============
  const renderFinance = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaMoneyBillWave />} title="Finans ve Kasa Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Kasa hareketleri ve finansal işlemler.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaHistory />} label="Ödeme Geçmişi" onClick={() => toast.info(`📋 ${payments.length} ödeme kaydı bulunuyor`)} />
        <ActionButton icon={<FaCheckDouble />} label="Gün Sonu İşlemleri" onClick={() => toast.warning('⚠️ Gün sonu işlemleri henüz aktif değil.')} />
        <ActionButton icon={<FaUndo />} label="Ödeme İade İşlemleri" onClick={() => toast.warning('⚠️ Ödeme iade işlemleri henüz aktif değil.')} />
        <ActionButton icon={<FaExchangeAlt />} label="Kasa Hareketleri" onClick={() => toast.info(`📋 ${cash.length} kasa hareketi bulunuyor`)} />
      </div>
    </div>
  );

  // ============ DEPO / STOK YÖNETİMİ ============
  const renderStock = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaBoxes />} title="Depo / Stok Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Stok seviyeleri ve malzeme işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaWarehouse />} label="Güncel Stok Durumları" onClick={() => toast.info(`📊 ${materials.length} malzeme bulunuyor`)} />
        <ActionButton icon={<FaPlusCircle />} label="Malzeme Giriş" onClick={() => toast.warning('⚠️ Malzeme giriş işlemi henüz aktif değil.')} />
        <ActionButton icon={<FaMinusCircle />} label="Malzeme Çıkış" onClick={() => toast.warning('⚠️ Malzeme çıkış işlemi henüz aktif değil.')} />
        <ActionButton icon={<FaTruck />} label="Malzeme Sipariş" onClick={() => toast.warning('⚠️ Malzeme sipariş işlemi henüz aktif değil.')} />
      </div>
    </div>
  );

  // ============ SİPARİŞ YÖNETİMİ ============
  const renderOrders = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaClipboardList />} title="Sipariş Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Aktif siparişler ve sipariş işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton icon={<FaShoppingCart />} label="Aktif Siparişleri Göster" onClick={() => toast.info(`📋 ${orders.length} aktif sipariş`)} />
        <ActionButton icon={<FaEye />} label="Sipariş Detay İşlemleri" onClick={() => toast.warning('⚠️ Sipariş detay işlemleri henüz aktif değil.')} />
        <ActionButton icon={<FaHistory />} label="Sipariş Geçmişi" onClick={() => toast.warning('⚠️ Sipariş geçmişi henüz aktif değil.')} />
        <ActionButton icon={<FaUndo />} label="Sipariş İade ve İptal" onClick={() => toast.warning('⚠️ Sipariş iade/iptal işlemleri henüz aktif değil.')} />
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
          <ActionButton icon={<FaPlus />} label="Masa Ekle" onClick={handleMasaEkle} />
          <ActionButton icon={<FaTrash />} label="Masa Sil" onClick={handleMasaSil} />
          <ActionButton icon={<FaEdit />} label="Masa Düzenle" onClick={handleMasaDuzenle} />
          <ActionButton icon={<FaChair />} label="Masa Planı" onClick={() => toast.info(`🪑 ${tables.length} masa bulunuyor`)} />
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs mb-3">Rezervasyon İşlemleri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ActionButton icon={<FaCalendarCheck />} label="Rezervasyon Ekle" onClick={handleRezervasyonEkle} />
            <ActionButton icon={<FaTrash />} label="Rezervasyon Sil" onClick={handleRezervasyonSil} />
            <ActionButton icon={<FaEdit />} label="Rezervasyon Düzenle" onClick={handleRezervasyonDuzenle} />
            <ActionButton icon={<FaList />} label="Rezervasyon Listele" onClick={() => toast.info(`📋 ${reservations.length} rezervasyon bulunuyor`)} />
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
        <ActionButton icon={<FaUserPlus />} label="Personel Ekle" onClick={handlePersonelEkle} />
        <ActionButton icon={<FaUserEdit />} label="Personel Düzenle" onClick={handlePersonelDuzenle} />
        <ActionButton icon={<FaUserMinus />} label="Personel Sil" onClick={handlePersonelSil} />
        <ActionButton icon={<FaList />} label="Personel Listele" onClick={personelListele} />
        <ActionButton icon={<FaShieldAlt />} label="Rol / Yetki Yönetimi" onClick={() => toast.warning('⚠️ Rol/yetki yönetimi henüz aktif değil.')} />
        <ActionButton icon={<FaUmbrella />} label="İzin Yönetimi" onClick={() => toast.warning('⚠️ İzin yönetimi henüz aktif değil.')} />
      </div>

      {/* Personel Listesi Modal */}
      {showPersonelListesi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold text-lg">📋 Personel Listesi</h2>
                <p className="text-gray-400 text-xs">Toplam {personelListesi.length} personel</p>
              </div>
              <button onClick={() => setShowPersonelListesi(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-white/10">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Ad Soyad</th>
                    <th className="text-left py-2 px-3">Kullanıcı Adı</th>
                    <th className="text-left py-2 px-3">Rol</th>
                    <th className="text-left py-2 px-3">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {personelListesi.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-gray-400">Henüz personel eklenmemiş</td></tr>
                  ) : (
                    personelListesi.map((p, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-gray-400 text-xs">{index + 1}</td>
                        <td className="py-2 px-3 text-white text-sm">{p.personelAdi || p.Adi || 'Bilinmiyor'} {p.personelSoyadi || p.Soyadi || ''}</td>
                        <td className="py-2 px-3 text-gray-300 text-sm">{p.kullaniciAdi || p.KullaniciAdi || '-'}</td>
                        <td className="py-2 px-3 text-gray-300 text-sm">{p.rol || p.Rol || '-'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${p.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {p.isActive !== false ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-white/10 flex justify-between">
              <span className="text-gray-400 text-xs">Toplam: {personelListesi.length} personel</span>
              <button onClick={() => setShowPersonelListesi(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============ RAPORLAR VE İSTATİSTİKLER ============
  const renderReports = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <SectionHeader icon={<FaChartBar />} title="Raporlar ve İstatistikler" />
      <p className="text-gray-400 text-sm mb-6">İşletmenizin tüm rapor ve istatistiklerine buradan ulaşın.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionButton icon={<FaChartLine />} label="Günlük Satış Raporları" onClick={() => toast.info('📊 Günlük satış raporu yükleniyor...')} />
        <ActionButton icon={<FaPizzaSlice />} label="Ürün Satış Raporu" />
        <ActionButton icon={<FaCalendarCheck />} label="Rezervasyon Raporu" />
        <ActionButton icon={<FaMoneyBillWave />} label="Gelir İstatistikleri" />
      </div>
      <div className="mt-6 p-8 bg-white/5 rounded-xl border border-white/5 text-center">
        <p className="text-gray-500 text-sm">📊 Raporlar burada görüntülenecek</p>
        <p className="text-gray-600 text-xs mt-1">Backend entegrasyonu için hazır</p>
      </div>
    </div>
  );

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    switch(selectedMenu) {
      case 'dashboard': return renderDashboard();
      case 'product_menu': return renderProductMenu();
      case 'members': return renderMembers();
      case 'finance': return renderFinance();
      case 'stock': return renderStock();
      case 'orders': return renderOrders();
      case 'tables': return renderTables();
      case 'personnel': return renderPersonnel();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
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

      {/* Kategori Ekle Modal */}
      {showKategoriEkleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-gray-400"><FaPlusCircle /></div>
                <div>
                  <h2 className="text-white font-bold text-lg">Kategori Ekle</h2>
                  <p className="text-gray-400 text-xs">Yeni kategori oluşturun</p>
                </div>
              </div>
              <button onClick={() => setShowKategoriEkleModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleKategoriEkle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori Adı</label>
                <input
                  value={newKategoriAdi}
                  onChange={(e) => setNewKategoriAdi(e.target.value)}
                  className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                  placeholder="Örn: Çorbalar"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowKategoriEkleModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg">İptal</button>
                <button type="submit" disabled={kategoriLoading} className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg">
                  {kategoriLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ürün Ekle Modal */}
      {showUrunEkleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-gray-400"><FaPlus /></div>
                <div>
                  <h2 className="text-white font-bold text-lg">Ürün Ekle</h2>
                  <p className="text-gray-400 text-xs">Yeni ürün bilgilerini girin</p>
                </div>
              </div>
              <button onClick={() => setShowUrunEkleModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleUrunEkle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ürün Adı</label>
                <input value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" placeholder="Örn: Adana Kebap" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Fiyat (TL)</label>
                <input value={urunFiyat} onChange={(e) => setUrunFiyat(e.target.value)} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" placeholder="Örn: 85" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori</label>
                <select value={urunKategoriId} onChange={(e) => setUrunKategoriId(e.target.value)} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" required>
                  <option value="">-- Kategori Seç --</option>
                  {categories.map(k => (
                    <option key={k.kategoriId || k.id} value={k.kategoriId || k.id}>{k.kategoriAdi || k.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowUrunEkleModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg">İptal</button>
                <button type="submit" disabled={urunLoading} className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg">{urunLoading ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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