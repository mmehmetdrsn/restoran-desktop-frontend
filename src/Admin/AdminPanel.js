// src/Admin/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaHome, FaUsers, FaUtensils, FaClipboardList,
  FaMoneyBillWave, FaBoxes, FaTable, FaUserCog, FaChartBar,
  FaBars, FaTimes, FaBell, FaEnvelope, FaSignOutAlt,
  FaUserPlus, FaUserEdit, FaUserMinus, FaList,
  FaPlus, FaTrash, FaEdit, FaPlusCircle,
  FaCalendarCheck, FaChair, FaShoppingCart, FaEye,
  FaHistory, FaCheckDouble, FaUndo, FaExchangeAlt,
  FaWarehouse, FaMinusCircle, FaTruck, FaPizzaSlice,
  FaChartLine, FaCalendarAlt, FaSpinner,
  FaShieldAlt, FaUmbrella, FaKey  // ← Bunları ekleyin
} from 'react-icons/fa';

// API Servisleri
import {
  orderService, productService, categoryService, materialService,
  tableService, reservationService, personnelService, userService,
  paymentService, cashService, reportService
} from '../api/api';

import Sidebar from './Bilesenler/Sidebar/Sidebar';
import Buton from './Bilesenler/Ortak/Buton';
import BolumBasligi from './Bilesenler/Ortak/BolumBasligi';
import Sifre from './Bilesenler/Ortak/Sifre';
import Dashboard from './Bilesenler/Dashboard/Dashboard';

import PersonelEkle from './Bilesenler/Personel/PersonelEkle';
import PersonelSil from './Bilesenler/Personel/PersonelSil';
import PersonelDuzenle from './Bilesenler/Personel/PersonelDuzenle';
import PersonelListele from './Bilesenler/Personel/PersonelListele';

import UrunEkle from './Bilesenler/Urun/UrunEkle';
import UrunSil from './Bilesenler/Urun/UrunSil';
import UrunDuzenle from './Bilesenler/Urun/UrunDuzenle';
import UrunListele from './Bilesenler/Urun/UrunListele';

import UyeEkle from './Bilesenler/Uye/UyeEkle';
import UyeSil from './Bilesenler/Uye/UyeSil';
import UyeDuzenle from './Bilesenler/Uye/UyeDuzenle';
import UyeListele from './Bilesenler/Uye/UyeListele';
import UyeDetay from './Bilesenler/Uye/UyeDetay';

import KategoriEkle from './Bilesenler/Kategori/KategoriEkle';
import KategoriSil from './Bilesenler/Kategori/KategoriSil';
import KategoriDuzenle from './Bilesenler/Kategori/KategoriDuzenle';
import KategoriListele from './Bilesenler/Kategori/KategoriListele';

import MasaEkle from './Bilesenler/Masa/MasaEkle';
import MasaSil from './Bilesenler/Masa/MasaSil';
import MasaDuzenle from './Bilesenler/Masa/MasaDuzenle';

import RezervasyonEkle from './Bilesenler/Rezervasyon/RezervasyonEkle';
import RezervasyonSil from './Bilesenler/Rezervasyon/RezervasyonSil';
import RezervasyonDuzenle from './Bilesenler/Rezervasyon/RezervasyonDuzenle';

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
  const [personelListesi, setPersonelListesi] = useState([]);
  const [urunListesi, setUrunListesi] = useState([]);

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
  // Personel
  const [showPersonelEkle, setShowPersonelEkle] = useState(false);
  const [showPersonelSil, setShowPersonelSil] = useState(false);
  const [showPersonelDuzenle, setShowPersonelDuzenle] = useState(false);
  const [showPersonelListele, setShowPersonelListele] = useState(false);
  const [personelEkleLoading, setPersonelEkleLoading] = useState(false);
  const [yeniPersonel, setYeniPersonel] = useState({
    PersonelAdi: '',
    PersonelSoyadi: '',
    KullaniciAdi: '',
    Sifre: '',
    RolId: 2,
    PersonelTelefon: '',
    Cinsiyet: '',
    Maas: ''
  });

  // Ürün
  const [showUrunEkle, setShowUrunEkle] = useState(false);
  const [showUrunSil, setShowUrunSil] = useState(false);
  const [showUrunDuzenle, setShowUrunDuzenle] = useState(false);
  const [showUrunListele, setShowUrunListele] = useState(false);
  const [urunAdi, setUrunAdi] = useState('');
  const [urunFiyat, setUrunFiyat] = useState('');
  const [urunKategoriId, setUrunKategoriId] = useState('');
  const [urunLoading, setUrunLoading] = useState(false);
  const [duzenlenecekUrunId, setDuzenlenecekUrunId] = useState('');
  const [duzenlenecekUrunAdi, setDuzenlenecekUrunAdi] = useState('');
  const [duzenlenecekUrunFiyat, setDuzenlenecekUrunFiyat] = useState('');
  const [duzenlenecekUrunKategori, setDuzenlenecekUrunKategori] = useState('');
  const [duzenlenecekUrunAciklama, setDuzenlenecekUrunAciklama] = useState('');
  const [urunAciklama, setUrunAciklama] = useState('');

  //Üye
  const [showUyeEkle, setShowUyeEkle] = useState(false);
  const [showUyeSil, setShowUyeSil] = useState(false);
  const [showUyeDuzenle, setShowUyeDuzenle] = useState(false);
  const [showUyeListele, setShowUyeListele] = useState(false);
  const [uyeListesi, setUyeListesi] = useState([]);
  const [uyeLoading, setUyeLoading] = useState(false);
  const [yeniUye, setYeniUye] = useState({
    uyeAdi: '',
    uyeSoyadi: '',
    uyeEmail: '',
    uyeSifre: '',
    uyeTelefon: '',
    cinsiyet: '',
    adresTipi: '',
    acikAdres: '',
    teslimatBolgesindeMi: false
  });

  const [duzenlenecekUyeId, setDuzenlenecekUyeId] = useState('');
  const [duzenlenecekUyeAdi, setDuzenlenecekUyeAdi] = useState('');
  const [duzenlenecekUyeSoyadi, setDuzenlenecekUyeSoyadi] = useState('');
  const [duzenlenecekUyeEmail, setDuzenlenecekUyeEmail] = useState('');
  const [duzenlenecekUyeTelefon, setDuzenlenecekUyeTelefon] = useState('');
  const [duzenlenecekUyeAdres, setDuzenlenecekUyeAdres] = useState('');
  const [silinecekUyeId, setSilinecekUyeId] = useState('');
  const [showUyeDetay, setShowUyeDetay] = useState(false);

  // Kategori
  const [showKategoriEkle, setShowKategoriEkle] = useState(false);
  const [showKategoriSil, setShowKategoriSil] = useState(false);
  const [showKategoriDuzenle, setShowKategoriDuzenle] = useState(false);
  const [showKategoriListele, setShowKategoriListele] = useState(false);
  const [newKategoriAdi, setNewKategoriAdi] = useState('');
  const [kategoriLoading, setKategoriLoading] = useState(false);

  // Masa
  const [showMasaEkle, setShowMasaEkle] = useState(false);
  const [showMasaSil, setShowMasaSil] = useState(false);
  const [showMasaDuzenle, setShowMasaDuzenle] = useState(false);

  // Rezervasyon
  const [showRezervasyonEkle, setShowRezervasyonEkle] = useState(false);
  const [showRezervasyonSil, setShowRezervasyonSil] = useState(false);
  const [showRezervasyonDuzenle, setShowRezervasyonDuzenle] = useState(false);

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

      // Personel listesini de güncelle
      if (personnelRes.data) {
        const personeller = personnelRes.data.map(p => ({
          ...p,
          rolAdi: p.rolAdi || p.RolAdi || p.rol || p.Rol || 'Bilinmiyor',
          personelId: p.personelId || p.PersonelId || p.id,
          personelAdi: p.personelAdi || p.PersonelAdi || p.adi || 'Bilinmiyor',
          personelSoyadi: p.personelSoyadi || p.PersonelSoyadi || p.soyadi || '',
          kullaniciAdi: p.kullaniciAdi || p.KullaniciAdi || p.kullaniciAdi || '-'
        }));
        setPersonelListesi(personeller);
      }

      console.log('✅ Veriler başarıyla yüklendi!');
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      toast.error('Veriler yüklenirken hata oluştu!');
    }
  };

  // ============ DURUM RENKLERİ ============
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı': return 'bg-green-500/20 text-green-400';
      case 'Hazırlanıyor': return 'bg-yellow-500/20 text-yellow-400';
      case 'Bekliyor': return 'bg-orange-500/20 text-orange-400';
      case 'Teslim Edildi': return 'bg-blue-500/20 text-blue-400';
      case 'İptal': return 'bg-red-500/20 text-red-400';
      case 'Ödendi': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
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

  // ============ PERSONEL LİSTELE ============
  const handlePersonelListele = async () => {
    try {
      const response = await personnelService.getAll();
      const personeller = response.data || [];
      const personellerWithRol = personeller.map(p => ({
        ...p,
        rolAdi: p.rolAdi || p.RolAdi || p.rol || p.Rol || 'Bilinmiyor',
        personelId: p.personelId || p.PersonelId || p.id,
        personelAdi: p.personelAdi || p.PersonelAdi || p.adi || 'Bilinmiyor',
        personelSoyadi: p.personelSoyadi || p.PersonelSoyadi || p.soyadi || '',
        kullaniciAdi: p.kullaniciAdi || p.KullaniciAdi || p.kullaniciAdi || '-'
      }));
      setPersonelListesi(personellerWithRol);
      setShowPersonelListele(true);
    } catch (error) {
      console.error('Personeller yüklenirken hata:', error);
      toast.error('❌ Personeller yüklenirken hata oluştu!');
    }
  };

  // ============ ÜRÜN LİSTELE ============
  const handleUrunListele = async () => {
    try {
      const response = await productService.getAll();
      setUrunListesi(response.data || []);
      setShowUrunListele(true);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast.error('❌ Ürünler yüklenirken hata oluştu!');
    }
  };

  // ============ ÜYE LİSTELE ============
  const handleUyeListele = async () => {
    try {
      setUyeLoading(true);
      const response = await userService.getAll();
      setUyeListesi(response.data || []);
      setShowUyeListele(true);
      toast.info(`📋 ${response.data?.length || 0} üye bulundu`);
    } catch (error) {
      console.error('Üyeler yüklenirken hata:', error);
      toast.error('❌ Üyeler yüklenirken hata oluştu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // ============ ÜYE EKLE ============
  const handleUyeEkleSubmit = async (e) => {
    e.preventDefault();
    if (!yeniUye.ad || !yeniUye.soyad || !yeniUye.email) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    try {
      setUyeLoading(true);
      await userService.create({
        ad: yeniUye.ad.trim(),
        soyad: yeniUye.soyad.trim(),
        email: yeniUye.email.trim(),
        telefon: yeniUye.telefon || null,
        adres: yeniUye.adres || null
      });
      toast.success('✅ Üye başarıyla eklendi!');
      setYeniUye({ ad: '', soyad: '', email: '', telefon: '', adres: '' });
      setShowUyeEkle(false);
      await handleUyeListele();
    } catch (error) {
      console.error('Üye eklenirken hata:', error);
      toast.error('❌ Üye eklenirken hata oluştu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // ============ ÜYE SİL ============
  const handleUyeSilSubmit = async (e) => {
    e.preventDefault();
    if (!silinecekUyeId) {
      toast.warning('Lütfen üye ID girin!');
      return;
    }
    if (!window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) return;

    try {
      setUyeLoading(true);
      await userService.delete(parseInt(silinecekUyeId));
      toast.success('✅ Üye başarıyla silindi!');
      setSilinecekUyeId('');
      setShowUyeSil(false);
      await handleUyeListele();
    } catch (error) {
      console.error('Üye silinirken hata:', error);
      toast.error('❌ Üye silinirken hata oluştu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // ============ ÜYE DÜZENLE ============
  const handleUyeDuzenleSubmit = async (e) => {
    e.preventDefault();
    if (!duzenlenecekUyeId || !duzenlenecekUyeAdi || !duzenlenecekUyeSoyadi || !duzenlenecekUyeEmail) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }

    try {
      setUyeLoading(true);
      await userService.update(parseInt(duzenlenecekUyeId), {
        ad: duzenlenecekUyeAdi.trim(),
        soyad: duzenlenecekUyeSoyadi.trim(),
        email: duzenlenecekUyeEmail.trim(),
        telefon: duzenlenecekUyeTelefon || null,
        adres: duzenlenecekUyeAdres || null
      });
      toast.success('✅ Üye başarıyla güncellendi!');
      setDuzenlenecekUyeId('');
      setDuzenlenecekUyeAdi('');
      setDuzenlenecekUyeSoyadi('');
      setDuzenlenecekUyeEmail('');
      setDuzenlenecekUyeTelefon('');
      setDuzenlenecekUyeAdres('');
      setShowUyeDuzenle(false);
      await handleUyeListele();
    } catch (error) {
      console.error('Üye güncellenirken hata:', error);
      toast.error('❌ Üye güncellenirken hata oluştu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // ============ KATEGORİ LİSTELE ============
  const handleKategoriListele = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data || []);
      setShowKategoriListele(true);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast.error('❌ Kategoriler yüklenirken hata oluştu!');
    }
  };

  // ============ RENDER FONKSİYONLARI ============

  // Personel Yönetimi Sayfası
  const renderPersonnel = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUserCog />} title="Personel Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel işlemleri ve yetki yönetimi.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Buton icon={<FaUserPlus />} label="Personel Ekle" onClick={() => setShowPersonelEkle(true)} />
        <Buton icon={<FaUserEdit />} label="Personel Düzenle" onClick={() => setShowPersonelDuzenle(true)} />
        <Buton icon={<FaUserMinus />} label="Personel Sil" onClick={() => setShowPersonelSil(true)} />
        <Buton icon={<FaList />} label="Personel Listele" onClick={handlePersonelListele} />
        <Buton icon={<FaShieldAlt />} label="Rol / Yetki Yönetimi" onClick={() => toast.warning('⚠️ Rol/yetki yönetimi henüz aktif değil.')} />
        <Buton icon={<FaUmbrella />} label="İzin Yönetimi" onClick={() => toast.warning('⚠️ İzin yönetimi henüz aktif değil.')} />
      </div>
    </div>
  );

  // Ürün ve Menü Yönetimi Sayfası
  const renderProductMenu = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUtensils />} title="Ürün ve Menü Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Ürün ve menü işlemlerinizi buradan yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlus />} label="Ürün Ekle" onClick={() => { setUrunAciklama(''); setShowUrunEkle(true); }} />
        <Buton icon={<FaTrash />} label="Ürün Sil" onClick={() => setShowUrunSil(true)} />
        <Buton icon={<FaEdit />} label="Ürün Düzenle" onClick={() => setShowUrunDuzenle(true)} />
        <Buton icon={<FaList />} label="Ürün Listele" onClick={handleUrunListele} />
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs mb-3">Kategori İşlemleri</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Buton icon={<FaPlusCircle />} label="Kategori Ekle" onClick={() => setShowKategoriEkle(true)} />
          <Buton icon={<FaTrash />} label="Kategori Sil" onClick={() => setShowKategoriSil(true)} />
          <Buton icon={<FaEdit />} label="Kategori Düzenle" onClick={() => setShowKategoriDuzenle(true)} />
          <Buton icon={<FaList />} label="Kategori Listele" onClick={handleKategoriListele} />
        </div>
      </div>
    </div>
  );

  // Üye Yönetimi Sayfası
  const renderMembers = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUsers />} title="Üye Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel ve müşteri üye işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Buton icon={<FaUserPlus />} label="Üye Ekle" onClick={() => setShowUyeEkle(true)} />
        <Buton icon={<FaUserMinus />} label="Üye Sil" onClick={() => setShowUyeSil(true)} />
        <Buton icon={<FaUserEdit />} label="Üye Düzenle" onClick={() => setShowUyeDuzenle(true)} />
        <Buton icon={<FaList />} label="Üye Listele" onClick={handleUyeListele} />
        <Buton icon={<FaEye />} label="Üye Detay" onClick={() => setShowUyeDetay(true)} />
      </div>
    </div>
  );

  // Finans ve Kasa Yönetimi Sayfası
  const renderFinance = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaMoneyBillWave />} title="Finans ve Kasa Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Kasa hareketleri ve finansal işlemler.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaHistory />} label="Ödeme Geçmişi" onClick={() => toast.info(`📋 ${payments.length} ödeme kaydı bulunuyor`)} />
        <Buton icon={<FaCheckDouble />} label="Gün Sonu İşlemleri" onClick={() => toast.warning('⚠️ Gün sonu işlemleri henüz aktif değil.')} />
        <Buton icon={<FaUndo />} label="Ödeme İade İşlemleri" onClick={() => toast.warning('⚠️ Ödeme iade işlemleri henüz aktif değil.')} />
        <Buton icon={<FaExchangeAlt />} label="Kasa Hareketleri" onClick={() => toast.info(`📋 ${cash.length} kasa hareketi bulunuyor`)} />
      </div>
    </div>
  );

  // Depo / Stok Yönetimi Sayfası
  const renderStock = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaBoxes />} title="Depo / Stok Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Stok seviyeleri ve malzeme işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaWarehouse />} label="Güncel Stok Durumları" onClick={() => toast.info(`📊 ${materials.length} malzeme bulunuyor`)} />
        <Buton icon={<FaPlusCircle />} label="Malzeme Giriş" onClick={() => toast.warning('⚠️ Malzeme giriş işlemi henüz aktif değil.')} />
        <Buton icon={<FaMinusCircle />} label="Malzeme Çıkış" onClick={() => toast.warning('⚠️ Malzeme çıkış işlemi henüz aktif değil.')} />
        <Buton icon={<FaTruck />} label="Malzeme Sipariş" onClick={() => toast.warning('⚠️ Malzeme sipariş işlemi henüz aktif değil.')} />
      </div>
    </div>
  );

  // Sipariş Yönetimi Sayfası
  const renderOrders = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaClipboardList />} title="Sipariş Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Aktif siparişler ve sipariş işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaShoppingCart />} label="Aktif Siparişleri Göster" onClick={() => toast.info(`📋 ${orders.length} aktif sipariş`)} />
        <Buton icon={<FaEye />} label="Sipariş Detay İşlemleri" onClick={() => toast.warning('⚠️ Sipariş detay işlemleri henüz aktif değil.')} />
        <Buton icon={<FaHistory />} label="Sipariş Geçmişi" onClick={() => toast.warning('⚠️ Sipariş geçmişi henüz aktif değil.')} />
        <Buton icon={<FaUndo />} label="Sipariş İade ve İptal" onClick={() => toast.warning('⚠️ Sipariş iade/iptal işlemleri henüz aktif değil.')} />
      </div>
    </div>
  );

  // Masa ve Rezervasyon Yönetimi Sayfası
  const renderTables = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaTable />} title="Masa ve Rezervasyon Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Masa ve rezervasyon işlemlerini yönetin.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Buton icon={<FaPlus />} label="Masa Ekle" onClick={() => setShowMasaEkle(true)} />
          <Buton icon={<FaTrash />} label="Masa Sil" onClick={() => setShowMasaSil(true)} />
          <Buton icon={<FaEdit />} label="Masa Düzenle" onClick={() => setShowMasaDuzenle(true)} />
          <Buton icon={<FaChair />} label="Masa Planı" onClick={() => toast.info(`🪑 ${tables.length} masa bulunuyor`)} />
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs mb-3">Rezervasyon İşlemleri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Buton icon={<FaCalendarCheck />} label="Rezervasyon Ekle" onClick={() => setShowRezervasyonEkle(true)} />
            <Buton icon={<FaTrash />} label="Rezervasyon Sil" onClick={() => setShowRezervasyonSil(true)} />
            <Buton icon={<FaEdit />} label="Rezervasyon Düzenle" onClick={() => setShowRezervasyonDuzenle(true)} />
            <Buton icon={<FaList />} label="Rezervasyon Listele" onClick={() => toast.info(`📋 ${reservations.length} rezervasyon bulunuyor`)} />
          </div>
        </div>
      </div>
    </div>
  );

  // Raporlar Sayfası
  const renderReports = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaChartBar />} title="Raporlar ve İstatistikler" />
      <p className="text-gray-400 text-sm mb-6">İşletmenizin tüm rapor ve istatistiklerine buradan ulaşın.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Buton icon={<FaChartLine />} label="Günlük Satış Raporları" onClick={() => toast.info('📊 Günlük satış raporu yükleniyor...')} />
        <Buton icon={<FaPizzaSlice />} label="Ürün Satış Raporu" />
        <Buton icon={<FaCalendarCheck />} label="Rezervasyon Raporu" />
        <Buton icon={<FaMoneyBillWave />} label="Gelir İstatistikleri" />
      </div>
      <div className="mt-6 p-8 bg-white/5 rounded-xl border border-white/5 text-center">
        <p className="text-gray-500 text-sm">📊 Raporlar burada görüntülenecek</p>
        <p className="text-gray-600 text-xs mt-1">Backend entegrasyonu için hazır</p>
      </div>
    </div>
  );

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <Dashboard
          loading={loading}
          dashboardData={dashboardData}
          topProducts={topProducts}
          recentOrders={recentOrders}
          getStatusColor={getStatusColor}
          onMenuGor={() => {
            // Ürün listesini göster
            handleUrunListele();
            // Menüyü Ürün Yönetimi'ne geçir
            setSelectedMenu('product_menu');
          }}
        />;
      case 'product_menu': return renderProductMenu();
      case 'members': return renderMembers();
      case 'finance': return renderFinance();
      case 'stock': return renderStock();
      case 'orders': return renderOrders();
      case 'tables': return renderTables();
      case 'personnel': return renderPersonnel();
      case 'reports': return renderReports();
      default:
        return <Dashboard
          loading={loading}
          dashboardData={dashboardData}
          topProducts={topProducts}
          recentOrders={recentOrders}
          getStatusColor={getStatusColor}
          onMenuGor={() => {
            handleUrunListele();
            setSelectedMenu('product_menu');
          }}
        />;
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
        <Sidebar
          acik={sidebarOpen}
          mobilAcik={mobileSidebarOpen}
          mobilKapat={() => setMobileSidebarOpen(false)}
          genisligiDegistir={() => setSidebarOpen(!sidebarOpen)}
          menuOgeleri={menuItems}
          seciliMenu={selectedMenu}
          menuSec={setSelectedMenu}
          kullanici={userData}
          cikisYap={handleLogout}
          sifreDegistirAc={() => setShowPasswordModal(true)}
        />

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
        </div>
      </div>

      {/* ============ MODALLAR ============ */}

      {/* Şifre Değiştir */}
      <Sifre
        acik={showPasswordModal}
        kapat={() => setShowPasswordModal(false)}
      />

      {/* Personel Modalları */}
      <PersonelEkle
        acik={showPersonelEkle}
        kapat={() => setShowPersonelEkle(false)}
        onSuccess={fetchAllData}
        yeniPersonel={yeniPersonel}
        setYeniPersonel={setYeniPersonel}
        loading={personelEkleLoading}
        setLoading={setPersonelEkleLoading}
      />
      <PersonelSil
        acik={showPersonelSil}
        kapat={() => setShowPersonelSil(false)}
        onSuccess={fetchAllData}
      />
      <PersonelDuzenle
        acik={showPersonelDuzenle}
        kapat={() => setShowPersonelDuzenle(false)}
        onSuccess={fetchAllData}
      />
      <PersonelListele
        acik={showPersonelListele}
        kapat={() => setShowPersonelListele(false)}
        personeller={personelListesi}
      />

      {/* Ürün Modalları */}
      <UrunEkle
        acik={showUrunEkle}
        kapat={() => setShowUrunEkle(false)}
        onSuccess={fetchAllData}
        kategoriler={categories}
        urunAdi={urunAdi}
        setUrunAdi={setUrunAdi}
        urunFiyat={urunFiyat}
        setUrunFiyat={setUrunFiyat}
        urunKategoriId={urunKategoriId}
        setUrunKategoriId={setUrunKategoriId}
        urunAciklama={urunAciklama}
        setUrunAciklama={setUrunAciklama}
        loading={urunLoading}
        setLoading={setUrunLoading}
      />
      <UrunSil
        acik={showUrunSil}
        kapat={() => setShowUrunSil(false)}
        onSuccess={fetchAllData}
      />
      <UrunDuzenle
        acik={showUrunDuzenle}
        kapat={() => setShowUrunDuzenle(false)}
        onSuccess={fetchAllData}
        kategoriler={categories}
        duzenlenecekUrunId={duzenlenecekUrunId}
        setDuzenlenecekUrunId={setDuzenlenecekUrunId}
        duzenlenecekUrunAdi={duzenlenecekUrunAdi}
        setDuzenlenecekUrunAdi={setDuzenlenecekUrunAdi}
        duzenlenecekUrunFiyat={duzenlenecekUrunFiyat}
        setDuzenlenecekUrunFiyat={setDuzenlenecekUrunFiyat}
        duzenlenecekUrunKategori={duzenlenecekUrunKategori}
        setDuzenlenecekUrunKategori={setDuzenlenecekUrunKategori}
        duzenlenecekUrunAciklama={duzenlenecekUrunAciklama}
        setDuzenlenecekUrunAciklama={setDuzenlenecekUrunAciklama}
        loading={urunLoading}
        setLoading={setUrunLoading}
      />
      <UrunListele
        acik={showUrunListele}
        kapat={() => setShowUrunListele(false)}
        urunler={urunListesi}
      />

      {/* ============ ÜYE MODALLARI ============ */}
      <UyeEkle
        acik={showUyeEkle}
        kapat={() => setShowUyeEkle(false)}
        onSuccess={handleUyeListele}
        yeniUye={yeniUye}
        setYeniUye={setYeniUye}
        loading={uyeLoading}
        setLoading={setUyeLoading}
      />


      <UyeSil
        acik={showUyeSil}
        kapat={() => setShowUyeSil(false)}
        onSuccess={handleUyeListele}
      />


      <UyeDuzenle
        acik={showUyeDuzenle}
        kapat={() => setShowUyeDuzenle(false)}
        onSuccess={handleUyeListele}
      />


      <UyeListele
        acik={showUyeListele}
        kapat={() => setShowUyeListele(false)}
        uyeler={uyeListesi}
        loading={uyeLoading}
      />


      <UyeDetay
        acik={showUyeDetay}
        kapat={() => setShowUyeDetay(false)}
      />

      {/* Kategori Modalları */}
      <KategoriEkle
        acik={showKategoriEkle}
        kapat={() => setShowKategoriEkle(false)}
        onSuccess={fetchAllData}
        kategoriAdi={newKategoriAdi}
        setKategoriAdi={setNewKategoriAdi}
        loading={kategoriLoading}
        setLoading={setKategoriLoading}
      />
      <KategoriSil
        acik={showKategoriSil}
        kapat={() => setShowKategoriSil(false)}
        onSuccess={fetchAllData}
      />
      <KategoriDuzenle
        acik={showKategoriDuzenle}
        kapat={() => setShowKategoriDuzenle(false)}
        onSuccess={fetchAllData}
      />
      <KategoriListele
        acik={showKategoriListele}
        kapat={() => setShowKategoriListele(false)}
        kategoriler={categories}
        onKategoriSil={fetchAllData}
      />

      {/* Masa Modalları */}
      <MasaEkle
        acik={showMasaEkle}
        kapat={() => setShowMasaEkle(false)}
        onSuccess={fetchAllData}
      />
      <MasaSil
        acik={showMasaSil}
        kapat={() => setShowMasaSil(false)}
        onSuccess={fetchAllData}
      />
      <MasaDuzenle
        acik={showMasaDuzenle}
        kapat={() => setShowMasaDuzenle(false)}
        onSuccess={fetchAllData}
      />

      {/* Rezervasyon Modalları */}
      <RezervasyonEkle
        acik={showRezervasyonEkle}
        kapat={() => setShowRezervasyonEkle(false)}
        onSuccess={fetchAllData}
      />
      <RezervasyonSil
        acik={showRezervasyonSil}
        kapat={() => setShowRezervasyonSil(false)}
        onSuccess={fetchAllData}
      />
      <RezervasyonDuzenle
        acik={showRezervasyonDuzenle}
        kapat={() => setShowRezervasyonDuzenle(false)}
        onSuccess={fetchAllData}
      />

    </div>
  );
};

export default AdminPanel;