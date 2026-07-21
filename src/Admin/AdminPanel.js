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
  FaShieldAlt, FaUmbrella, FaKey, FaClipboardList as FaClipboardListIcon
} from 'react-icons/fa';
import axios from 'axios';

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
import RezervasyonListele from './Bilesenler/Rezervasyon/RezervasyonListele';  

import Odeme from './Bilesenler/Finans/Odeme';
import Kasa from './Bilesenler/Finans/Kasa';
import Iade from './Bilesenler/Finans/Iade';
import GunSonu from './Bilesenler/Finans/GunSonu';

import StokDurumu from './Bilesenler/Stok/StokDurumu';
import MalzemeGiris from './Bilesenler/Stok/MalzemeGiris';
import MalzemeCikis from './Bilesenler/Stok/MalzemeCikis';
import StokHareketleri from './Bilesenler/Stok/StokHareketleri';

import SiparisDetay from './Bilesenler/Siparis/SiparisDetay';

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [siparisGosterimModu, setSiparisGosterimModu] = useState('all');
  const [showSiparisDetay, setShowSiparisDetay] = useState(false);

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

  // Üye
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

  // ✅ Rezervasyon - showRezervasyonListele EKLENDİ
  const [showRezervasyonEkle, setShowRezervasyonEkle] = useState(false);
  const [showRezervasyonSil, setShowRezervasyonSil] = useState(false);
  const [showRezervasyonDuzenle, setShowRezervasyonDuzenle] = useState(false);
  const [showRezervasyonListele, setShowRezervasyonListele] = useState(false); // ✅ YENİ

  // Finans
  const [showOdeme, setShowOdeme] = useState(false);
  const [showKasa, setShowKasa] = useState(false);
  const [showIade, setShowIade] = useState(false);
  const [showGunSonu, setShowGunSonu] = useState(false);
  const [odemeler, setOdemeler] = useState([]);
  const [kasaHareketleri, setKasaHareketleri] = useState([]);
  const [finansLoading, setFinansLoading] = useState(false);

  // Stok
  const [showStokDurumu, setShowStokDurumu] = useState(false);
  const [showMalzemeGiris, setShowMalzemeGiris] = useState(false);
  const [showMalzemeCikis, setShowMalzemeCikis] = useState(false);
  const [stokLoading, setStokLoading] = useState(false);
  const [showStokHareket, setShowStokHareket] = useState(false);

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
    { id: 'orders', icon: <FaClipboardListIcon />, title: 'Sipariş Yönetimi' },
    { id: 'tables', icon: <FaTable />, title: 'Masa ve Rezervasyon Yönetimi' },
    { id: 'personnel', icon: <FaUserCog />, title: 'Personel Yönetimi' },
    { id: 'reports', icon: <FaChartBar />, title: 'Raporlar ve İstatistikler' }
  ];

  // ============ DASHBOARD VERİLERİNİ ÇEK ============
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let ciroData = { ciro: 0, siparisSayisi: 0, oncekiGunCiro: 0 };
      let satanlarData = [];
      let sonSiparislerData = [];

      // Günlük ciro
      try {
        const ciroRes = await reportService.getGunlukCiro();
        console.log('📊 Günlük ciro:', ciroRes);
        if (ciroRes?.data) {
          ciroData = ciroRes.data;
        }
      } catch (error) {
        console.warn('⚠️ Günlük ciro verisi alınamadı:', error);
      }

      // En çok satanlar
      try {
        const satanlarRes = await reportService.getEnCokSatanlar(30);
        console.log('📊 En çok satanlar:', satanlarRes);
        if (satanlarRes?.data && Array.isArray(satanlarRes.data)) {
          satanlarData = satanlarRes.data;
        }
      } catch (error) {
        console.warn('⚠️ En çok satanlar verisi alınamadı:', error);
      }

      // Son siparişler
      try {
        const sonSiparislerRes = await reportService.getSonSiparisler(10);
        console.log('📊 Son siparişler:', sonSiparislerRes);
        if (sonSiparislerRes?.data && Array.isArray(sonSiparislerRes.data)) {
          sonSiparislerData = sonSiparislerRes.data;
        }
      } catch (error) {
        console.warn('⚠️ Son siparişler verisi alınamadı:', error);
      }

      // Dashboard state'ini güncelle
      setDashboardData({
        totalRevenue: ciroData.ciro || 0,
        totalOrders: ciroData.siparisSayisi || 0,
        date: ciroData.tarih || new Date().toLocaleDateString('tr-TR'),
        changePercent: ciroData.oncekiGunCiro > 0
          ? Math.round(((ciroData.ciro - ciroData.oncekiGunCiro) / ciroData.oncekiGunCiro) * 100)
          : 0,
        oncekiGunCiro: ciroData.oncekiGunCiro || 0
      });

      // En çok satanlar
      if (satanlarData && satanlarData.length > 0) {
        const products = satanlarData.map((p, index) => ({
          name: p.urunAdi || p.UrunAdi || p.urunAdi || 'Bilinmiyor',
          quantity: p.toplamAdet || p.ToplamAdet || 0,
          revenue: p.toplamCiro || p.ToplamCiro || 0,
          index: index + 1
        }));
        setTopProducts(products);
      }

      // Son siparişler
      if (sonSiparislerData && sonSiparislerData.length > 0) {
        setRecentOrders(sonSiparislerData);
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
      console.log('🔄 Veriler yükleniyor...');

      const productsRes = await productService.getAll().catch(err => {
        console.warn('⚠️ Ürünler yüklenemedi:', err);
        return { data: [] };
      });

      const categoriesRes = await categoryService.getAll().catch(err => {
        console.warn('⚠️ Kategoriler yüklenemedi:', err);
        return { data: [] };
      });

      const materialsRes = await materialService.getAll().catch(err => {
        console.warn('⚠️ Malzemeler yüklenemedi:', err);
        return { data: [] };
      });

      const tablesRes = await tableService.getAll().catch(err => {
        console.warn('⚠️ Masalar yüklenemedi:', err);
        return { data: [] };
      });

      const reservationsRes = await reservationService.getAll().catch(err => {
        console.warn('⚠️ Rezervasyonlar yüklenemedi:', err);
        return { data: [] };
      });

      const personnelRes = await personnelService.getAll().catch(err => {
        console.warn('⚠️ Personeller yüklenemedi:', err);
        return { data: [] };
      });

      const usersRes = await userService.getAll().catch(err => {
        console.warn('⚠️ Üyeler yüklenemedi:', err);
        return { data: [] };
      });

      const paymentsRes = await paymentService.getAll().catch(err => {
        console.warn('⚠️ Ödemeler yüklenemedi:', err);
        return { data: [] };
      });

      const cashRes = await cashService.getAll().catch(err => {
        console.warn('⚠️ Kasa hareketleri yüklenemedi:', err);
        return { data: [] };
      });

      console.log('📦 Ürünler:', productsRes);
      console.log('📦 Kategoriler:', categoriesRes);
      console.log('📦 Malzemeler:', materialsRes);
      console.log('📦 Masalar:', tablesRes);
      console.log('📦 Rezervasyonlar:', reservationsRes);
      console.log('📦 Personeller:', personnelRes);
      console.log('📦 Üyeler:', usersRes);
      console.log('📦 Ödemeler:', paymentsRes);
      console.log('📦 Kasa:', cashRes);

      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
      setCategories(Array.isArray(categoriesRes?.data) ? categoriesRes.data : []);
      setMaterials(Array.isArray(materialsRes?.data) ? materialsRes.data : []);
      setTables(Array.isArray(tablesRes?.data) ? tablesRes.data : []);
      setReservations(Array.isArray(reservationsRes?.data) ? reservationsRes.data : []);
      setPersonnel(Array.isArray(personnelRes?.data) ? personnelRes.data : []);
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
      setPayments(Array.isArray(paymentsRes?.data) ? paymentsRes.data : []);
      setCash(Array.isArray(cashRes?.data) ? cashRes.data : []);

      if (Array.isArray(personnelRes?.data) && personnelRes.data.length > 0) {
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
      console.log('📊 State güncellemeleri tamamlandı.');
    } catch (error) {
      console.error('❌ Veriler yüklenirken hata:', error);
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
      const data = response.data || [];
      
      console.log('📦 Tüm ürünler:', data);
      
      data.forEach((urun, index) => {
        console.log(`Ürün ${index + 1}: ${urun.urunAdi} - isActive:`, urun.isActive, '| IsActive:', urun.IsActive);
      });
      
      const pasifUrunler = data.filter(u => {
        const active = u.isActive ?? u.IsActive ?? u.is_active ?? u.IS_ACTIVE;
        return active === false || active === 0 || active === 'false' || active === '0';
      });
      
      const aktifUrunler = data.filter(u => {
        const active = u.isActive ?? u.IsActive ?? u.is_active ?? u.IS_ACTIVE;
        return active === true || active === 1 || active === 'true' || active === '1' || active == null;
      });
      
      console.log('📊 Aktif ürünler:', aktifUrunler.length);
      console.log('📊 Pasif ürünler:', pasifUrunler.length);
      console.log('📊 Pasif ürün listesi:', pasifUrunler);
      
      setUrunListesi(data);
      setShowUrunListele(true);
      
      toast.info(`📋 ${data.length || 0} ürün (${aktifUrunler.length} aktif, ${pasifUrunler.length} pasif)`);
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
    if (!yeniUye.uyeAdi || !yeniUye.uyeSoyadi || !yeniUye.uyeEmail) {
      toast.warning('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    try {
      setUyeLoading(true);
      await userService.create({
        uyeAdi: yeniUye.uyeAdi.trim(),
        uyeSoyadi: yeniUye.uyeSoyadi.trim(),
        uyeEmail: yeniUye.uyeEmail.trim(),
        uyeSifre: yeniUye.uyeSifre,
        uyeTelefon: yeniUye.uyeTelefon || null,
        cinsiyet: yeniUye.cinsiyet || null,
        adresTipi: yeniUye.adresTipi || null,
        acikAdres: yeniUye.acikAdres || null,
        teslimatBolgesindeMi: yeniUye.teslimatBolgesindeMi || false
      });
      toast.success('✅ Üye başarıyla eklendi!');
      setYeniUye({
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
        uyeAdi: duzenlenecekUyeAdi.trim(),
        uyeSoyadi: duzenlenecekUyeSoyadi.trim(),
        uyeEmail: duzenlenecekUyeEmail.trim(),
        uyeTelefon: duzenlenecekUyeTelefon || null,
        cinsiyet: duzenlenecekUyeAdres || null,
        adresTipi: duzenlenecekUyeAdres || null,
        acikAdres: duzenlenecekUyeAdres || null,
        teslimatBolgesindeMi: false
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

  // ============ ÖDEME LİSTELE ============
  const handleOdemeListele = async () => {
    try {
      setFinansLoading(true);
      const response = await paymentService.getAll();
      setOdemeler(response.data || []);
      setShowOdeme(true);
    } catch (error) {
      console.error('Ödemeler yüklenirken hata:', error);
      toast.error('❌ Ödemeler yüklenirken hata oluştu!');
    } finally {
      setFinansLoading(false);
    }
  };

  // ============ KASA HAREKETLERİ LİSTELE ============
  const handleKasaHareketleri = async () => {
    try {
      setFinansLoading(true);
      const response = await cashService.getAll();
      setKasaHareketleri(response.data || []);
      setShowKasa(true);
    } catch (error) {
      console.error('Kasa hareketleri yüklenirken hata:', error);
      toast.error('❌ Kasa hareketleri yüklenirken hata oluştu!');
    } finally {
      setFinansLoading(false);
    }
  };

  // ============ STOK DURUMU LİSTELE ============
  const handleStokDurumu = async () => {
    try {
      setStokLoading(true);
      const response = await materialService.getAll();
      setMaterials(response.data || []);
      setShowStokDurumu(true);
      toast.info(`📦 ${response.data?.length || 0} malzeme bulundu`);
    } catch (error) {
      console.error('Stok durumu yüklenirken hata:', error);
      toast.error('❌ Stok durumu yüklenirken hata oluştu!');
    } finally {
      setStokLoading(false);
    }
  };

  // ============ SİPARİŞLERİ LİSTELE ============
  const handleSiparisListele = async () => {
    try {
      const response = await orderService.getAll();
      setOrders(response.data || []);

      const aktif = response.data?.filter(
        o => o.siparisDurumu !== 'TAMAMLANDI' &&
          o.siparisDurumu !== 'IPTAL' &&
          o.siparisDurumu !== 'ODENDI'
      ).length || 0;

      toast.info(`📋 ${aktif} aktif sipariş bulundu (Toplam: ${response.data?.length || 0})`);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      toast.error('❌ Siparişler yüklenirken hata oluştu!');
    }
  };

  // ============ REZERVASYON LİSTELE ============
  const handleRezervasyonListele = async () => {
    try {
      const response = await reservationService.getAll();
      const data = response.data || [];
      setReservations(data);
      setShowRezervasyonListele(true);
      toast.info(`📋 ${data.length} rezervasyon bulundu`);
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      toast.error('❌ Rezervasyonlar yüklenirken hata oluştu!');
    }
  };

  // ============ SİPARİŞ TAMAMLA ============
  const handleSiparisTamamla = async (siparisId) => {
    if (!window.confirm('Siparişi tamamlamak istediğinize emin misiniz?\n\nBu işlem stokları otomatik düşecektir!')) {
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/Siparisler/${siparisId}/tamamla`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success(`✅ Sipariş #${siparisId} tamamlandı ve stoklar güncellendi!`);
      handleSiparisListele();
    } catch (error) {
      console.error('Sipariş tamamlama hatası:', error);

      if (error.response?.data?.Hatalar) {
        const hatalar = error.response.data.Hatalar.join('\n');
        toast.error(`❌ ${hatalar}`);
      } else if (error.response?.data?.Mesaj) {
        toast.error(`❌ ${error.response.data.Mesaj}`);
      } else {
        toast.error('❌ Sipariş tamamlanırken hata oluştu!');
      }
    }
  };

  // ============ RENDER FONKSİYONLARI ===========

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
        <Buton icon={<FaHistory />} label="Ödeme Geçmişi" onClick={handleOdemeListele} />
        <Buton icon={<FaCheckDouble />} label="Gün Sonu İşlemleri" onClick={() => setShowGunSonu(true)} />
        <Buton icon={<FaUndo />} label="Ödeme İade İşlemleri" onClick={() => setShowIade(true)} />
        <Buton icon={<FaExchangeAlt />} label="Kasa Hareketleri" onClick={handleKasaHareketleri} />
      </div>
    </div>
  );

  // Depo / Stok Yönetimi Sayfası
  const renderStock = () => (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaBoxes />} title="Depo / Stok Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Stok seviyeleri ve malzeme işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaWarehouse />} label="Güncel Stok Durumları" onClick={handleStokDurumu} />
        <Buton icon={<FaPlusCircle />} label="Malzeme Giriş" onClick={() => setShowMalzemeGiris(true)} />
        <Buton icon={<FaMinusCircle />} label="Malzeme Çıkış" onClick={() => setShowMalzemeCikis(true)} />
        <Buton icon={<FaHistory />} label="Stok Hareketleri" onClick={() => setShowStokHareket(true)} />
        <Buton icon={<FaClipboardListIcon />} label="Eksik Malzeme Talebi" onClick={() => toast.warning('⚠️ Malzeme sipariş işlemi henüz aktif değil.')} />
      </div>
    </div>
  );

  // Sipariş Yönetimi Sayfası
  const renderOrders = () => {
    const tumSiparisler = orders;
    
    const aktifSiparisler = orders.filter(
      o => o.siparisDurumu !== 'TAMAMLANDI' && 
           o.siparisDurumu !== 'IPTAL' && 
           o.siparisDurumu !== 'ODENDI' &&
           o.siparisDurumu !== 'IADE'
    );
    
    const tamamlananSiparisler = orders.filter(
      o => o.siparisDurumu === 'TAMAMLANDI' || o.siparisDurumu === 'ODENDI'
    );
    
    const iptalSiparisler = orders.filter(
      o => o.siparisDurumu === 'IPTAL'
    );
    
    const iadeSiparisler = orders.filter(
      o => o.siparisDurumu === 'IADE'
    );

    const iptalIadeSiparisler = orders.filter(
      o => o.siparisDurumu === 'IPTAL' || o.siparisDurumu === 'IADE'
    );

    const getDurumRenk = (durum) => {
      const d = (durum || '').toUpperCase();
      if (d === 'TAMAMLANDI') return 'bg-green-500/20 text-green-400';
      if (d === 'ODENDI') return 'bg-purple-500/20 text-purple-400';
      if (d === 'BEKLEMEDE') return 'bg-yellow-500/20 text-yellow-400';
      if (d === 'HAZIRLANIYOR') return 'bg-blue-500/20 text-blue-400';
      if (d === 'HAZIR') return 'bg-cyan-500/20 text-cyan-400';
      if (d === 'TESLIM EDILDI') return 'bg-indigo-500/20 text-indigo-400';
      if (d === 'IPTAL') return 'bg-red-500/20 text-red-400';
      if (d === 'IADE') return 'bg-orange-500/20 text-orange-400';
      return 'bg-gray-500/20 text-gray-400';
    };

    const getDurumIcon = (durum) => {
      const d = (durum || '').toUpperCase();
      if (d === 'TAMAMLANDI') return '✅';
      if (d === 'ODENDI') return '💰';
      if (d === 'BEKLEMEDE') return '⏳';
      if (d === 'HAZIRLANIYOR') return '👨‍🍳';
      if (d === 'HAZIR') return '✅';
      if (d === 'TESLIM EDILDI') return '🚚';
      if (d === 'IPTAL') return '❌';
      if (d === 'IADE') return '🔄';
      return '📋';
    };

    const getGosterilecekSiparisler = () => {
      switch(siparisGosterimModu) {
        case 'active': return aktifSiparisler;
        case 'completed': return tamamlananSiparisler;
        case 'cancelled': return iptalSiparisler;
        case 'iade': return iadeSiparisler;
        case 'iptal_iade': return iptalIadeSiparisler;
        default: return tumSiparisler;
      }
    };

    const gosterilecekSiparisler = getGosterilecekSiparisler();

    return (
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
        <BolumBasligi icon={<FaClipboardListIcon />} title="Sipariş Yönetimi" />
        <p className="text-gray-400 text-sm mb-6">Aktif siparişler ve sipariş işlemleri.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Buton 
            icon={<FaList />} 
            label={`📋 Tüm Siparişler (${tumSiparisler.length})`}
            onClick={() => {
              setSiparisGosterimModu('all');
              handleSiparisListele();
            }} 
          />
          <Buton 
            icon={<FaShoppingCart />} 
            label={`🛒 Aktif (${aktifSiparisler.length})`}
            onClick={() => {
              setSiparisGosterimModu('active');
              handleSiparisListele();
            }} 
          />
          <Buton 
            icon={<FaUndo />} 
            label={`🔄 İptal/İade (${iptalIadeSiparisler.length})`}
            onClick={() => {
              setSiparisGosterimModu('iptal_iade');
              handleSiparisListele();
            }} 
          />
          <Buton 
            icon={<FaEye />} 
            label="👁️ Sipariş Detay" 
            onClick={() => setShowSiparisDetay(true)} 
          />
        </div>

        {orders.length > 0 ? (
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium text-sm">
                📋 {siparisGosterimModu === 'all' ? 'Tüm Siparişler' :
                    siparisGosterimModu === 'active' ? 'Aktif Siparişler' :
                    siparisGosterimModu === 'completed' ? 'Tamamlanan Siparişler' :
                    siparisGosterimModu === 'cancelled' ? 'İptal Edilen Siparişler' :
                    siparisGosterimModu === 'iade' ? 'İade Edilen Siparişler' :
                    'İptal / İade Siparişleri'} 
                ({gosterilecekSiparisler.length})
              </h4>
              <div className="flex gap-3 text-xs text-gray-400">
                <span>🟡 Aktif: {aktifSiparisler.length}</span>
                <span>🟢 Tamamlandı: {tamamlananSiparisler.length}</span>
                <span>🔴 İptal: {iptalSiparisler.length}</span>
                <span>🔄 İade: {iadeSiparisler.length}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gosterilecekSiparisler.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>📭 Bu kategoride sipariş bulunmuyor.</p>
                </div>
              ) : (
                gosterilecekSiparisler.map((siparis) => (
                  <div key={siparis.siparisId} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">Sipariş #{siparis.siparisId}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${getDurumRenk(siparis.siparisDurumu)}`}>
                            {getDurumIcon(siparis.siparisDurumu)} {siparis.siparisDurumu || 'Bilinmiyor'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Masa: {siparis.masaNo || 'Paket'} • {siparis.uyeAdi || 'Ziyaretçi'} • {siparis.detaySayisi || 0} ürün
                        </p>
                        <p className="text-gray-500 text-xs">
                          {siparis.siparisTarihi ? new Date(siparis.siparisTarihi).toLocaleString('tr-TR') : '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">₺{siparis.toplamTutar?.toFixed(2) || 0}</p>
                        <div className="flex gap-2 mt-1 justify-end">
                          {siparis.siparisDurumu !== 'TAMAMLANDI' && 
                           siparis.siparisDurumu !== 'IPTAL' && 
                           siparis.siparisDurumu !== 'ODENDI' &&
                           siparis.siparisDurumu !== 'IADE' && (
                            <button
                              onClick={() => handleSiparisTamamla(siparis.siparisId)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all"
                            >
                              ✅ Tamamla
                            </button>
                          )}
                          {(siparis.siparisDurumu === 'TAMAMLANDI' || siparis.siparisDurumu === 'ODENDI') && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                              ✅ Tamamlandı
                            </span>
                          )}
                          {siparis.siparisDurumu === 'IPTAL' && (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg">
                              ❌ İptal
                            </span>
                          )}
                          {siparis.siparisDurumu === 'IADE' && (
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">
                              🔄 İade
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 border-t border-white/10 mt-4 pt-8">
            <FaShoppingCart className="text-5xl mx-auto mb-4 text-gray-600" />
            <p>Henüz sipariş yok</p>
            <p className="text-xs text-gray-500 mt-1">"Tüm Siparişler" butonuna tıklayarak siparişleri görüntüleyin</p>
          </div>
        )}
      </div>
    );
  };

  // ============ MASA VE REZERVASYON YÖNETİMİ ============
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
            {/* ✅ Rezervasyon Listele Butonu - handleRezervasyonListele ile çağrılıyor */}
            <Buton icon={<FaList />} label="Rezervasyon Listele" onClick={handleRezervasyonListele} />
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
            handleUrunListele();
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

      {/* ÜYE MODALLARI */}
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

      {/* ✅ Rezervasyon Modalları */}
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
      {/* ✅ Rezervasyon Listele Modal - YENİ */}
      <RezervasyonListele
        acik={showRezervasyonListele}
        kapat={() => setShowRezervasyonListele(false)}
      />

      {/* Finans Modalları */}
      <Odeme
        acik={showOdeme}
        kapat={() => setShowOdeme(false)}
        odemeler={odemeler}
        loading={finansLoading}
      />
      <Kasa
        acik={showKasa}
        kapat={() => setShowKasa(false)}
        kasaHareketleri={kasaHareketleri}
        loading={finansLoading}
        onSuccess={handleKasaHareketleri}
      />

      <GunSonu
        acik={showGunSonu}
        kapat={() => setShowGunSonu(false)}
        onSuccess={fetchAllData}
      />

      <Iade
        acik={showIade}
        kapat={() => setShowIade(false)}
        onSuccess={fetchAllData}
      />

      {/* Stok Modalları */}
      <StokDurumu
        acik={showStokDurumu}
        kapat={() => setShowStokDurumu(false)}
        malzemeler={materials}
        loading={stokLoading}
      />
      <MalzemeGiris
        acik={showMalzemeGiris}
        kapat={() => setShowMalzemeGiris(false)}
        onSuccess={handleStokDurumu}
        malzemeler={materials}
      />
      <MalzemeCikis
        acik={showMalzemeCikis}
        kapat={() => setShowMalzemeCikis(false)}
        onSuccess={handleStokDurumu}
        malzemeler={materials}
      />

      <StokHareketleri
        acik={showStokHareket}
        kapat={() => setShowStokHareket(false)}
      />

      {/* Sipariş Detay Modal */}
      <SiparisDetay
        acik={showSiparisDetay}
        kapat={() => setShowSiparisDetay(false)}
      />
    </div>
  );
};

export default AdminPanel;