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
  paymentService, cashService, reportService, malzemeTalepAPI
} from '../api/api';

import Sidebar from './Bilesenler/Sidebar/Sidebar';
import Buton from './Bilesenler/Ortak/Buton';
import BolumBasligi from './Bilesenler/Ortak/BolumBasligi';
import Sifre from './Bilesenler/Ortak/Sifre';
import Dashboard from './Bilesenler/Dashboard/Dashboard';

// Buton Dosyalari
import PersonelButonlari from './Bilesenler/Personel/PersonelButonlari';
import UrunButonlari from './Bilesenler/Urun/UrunButonlari';
import KategoriButonlari from './Bilesenler/Kategori/KategoriButonlari';
import UyeButonlari from './Bilesenler/Uye/UyeButonlari';
import FinansButonlari from './Bilesenler/Finans/FinansButonlari';
import StokButonlari from './Bilesenler/Stok/StokButonlari';
import MasaButonlari from './Bilesenler/Masa/MasaButonlari';
import RezervasyonButonlari from './Bilesenler/Rezervasyon/RezervasyonButonlari';
import SiparisButonlari from './Bilesenler/Siparis/SiparisButonlari';
import RaporButonlari from './Bilesenler/Raporlar/RaporButonlari';

// Modal Dosyalari
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
import MalzemeTalepleri from './Bilesenler/Stok/MalzemeTalepleri';

import SiparisYonetimi from './Bilesenler/Siparis/SiparisYonetimi';
import SiparisDetay from './Bilesenler/Siparis/SiparisDetay';

import Rapor from './Bilesenler/Raporlar/Rapor';

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

  // Veri State'leri
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

  // Dashboard State'leri
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    date: new Date().toLocaleDateString('tr-TR'),
    changePercent: 0,
    oncekiGunCiro: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Modal State'leri
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

  // Urun
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

  // Uye
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
  const [showRezervasyonListele, setShowRezervasyonListele] = useState(false);

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

  //Eksik Malzeme Talep
  const [showMalzemeTalepler, setShowMalzemeTalepler] = useState(false);
  const [malzemeTalepler, setMalzemeTalepler] = useState([]);
  const [talepLoading, setTalepLoading] = useState(false);

  // Kullanici Bilgileri
  const [userData, setUserData] = useState({
    name: 'Admin',
    email: 'admin@restoran.com',
    role: 'admin'
  });

  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, title: 'Genel Bakis' },
    { id: 'product_menu', icon: <FaUtensils />, title: 'Urun ve Menu Yonetimi' },
    { id: 'members', icon: <FaUsers />, title: 'Uye Yonetimi' },
    { id: 'finance', icon: <FaMoneyBillWave />, title: 'Finans ve Kasa Yonetimi' },
    { id: 'stock', icon: <FaBoxes />, title: 'Depo / Stok Yonetimi' },
    { id: 'orders', icon: <FaClipboardListIcon />, title: 'Siparis Yonetimi' },
    { id: 'tables', icon: <FaTable />, title: 'Masa ve Rezervasyon Yonetimi' },
    { id: 'personnel', icon: <FaUserCog />, title: 'Personel Yonetimi' },
    { id: 'reports', icon: <FaChartBar />, title: 'Raporlar ve Istatistikler' }
  ];

  // Dashboard Verilerini Cek
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let ciroData = { ciro: 0, siparisSayisi: 0, oncekiGunCiro: 0 };
      let satanlarData = [];
      let sonSiparislerData = [];

      try {
        const ciroRes = await reportService.getGunlukCiro();
        console.log('Gunluk ciro:', ciroRes);
        if (ciroRes?.data) {
          ciroData = ciroRes.data;
        }
      } catch (error) {
        console.warn('Gunluk ciro verisi alinamadi:', error);
      }

      try {
        const satanlarRes = await reportService.getEnCokSatanlar(30);
        console.log('En cok satanlar:', satanlarRes);
        if (satanlarRes?.data && Array.isArray(satanlarRes.data)) {
          satanlarData = satanlarRes.data;
        }
      } catch (error) {
        console.warn('En cok satanlar verisi alinamadi:', error);
      }

      try {
        const sonSiparislerRes = await reportService.getSonSiparisler(10);
        console.log('Son siparisler:', sonSiparislerRes);
        if (sonSiparislerRes?.data && Array.isArray(sonSiparislerRes.data)) {
          sonSiparislerData = sonSiparislerRes.data;
        }
      } catch (error) {
        console.warn('Son siparisler verisi alinamadi:', error);
      }

      setDashboardData({
        totalRevenue: ciroData.ciro || 0,
        totalOrders: ciroData.siparisSayisi || 0,
        date: ciroData.tarih || new Date().toLocaleDateString('tr-TR'),
        changePercent: ciroData.oncekiGunCiro > 0
          ? Math.round(((ciroData.ciro - ciroData.oncekiGunCiro) / ciroData.oncekiGunCiro) * 100)
          : 0,
        oncekiGunCiro: ciroData.oncekiGunCiro || 0
      });

      if (satanlarData && satanlarData.length > 0) {
        const products = satanlarData.map((p, index) => ({
          name: p.urunAdi || p.UrunAdi || p.urunAdi || 'Bilinmiyor',
          quantity: p.toplamAdet || p.ToplamAdet || 0,
          revenue: p.toplamCiro || p.ToplamCiro || 0,
          index: index + 1
        }));
        setTopProducts(products);
      }

      if (sonSiparislerData && sonSiparislerData.length > 0) {
        setRecentOrders(sonSiparislerData);
      }

      console.log('Dashboard verileri basariyla yüklendi!');
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      toast.error('Dashboard verileri yüklenirken hata olustu!');
    } finally {
      setLoading(false);
    }
  };

  // Tum Verileri Cek
  const fetchAllData = async () => {
    try {
      console.log('Veriler yükleniyor...');

      const productsRes = await productService.getAll().catch(err => {
        console.warn('Urunler yüklenemedi:', err);
        return { data: [] };
      });

      const categoriesRes = await categoryService.getAll().catch(err => {
        console.warn('Kategoriler yüklenemedi:', err);
        return { data: [] };
      });

      const materialsRes = await materialService.getAll().catch(err => {
        console.warn('Malzemeler yüklenemedi:', err);
        return { data: [] };
      });

      const tablesRes = await tableService.getAll().catch(err => {
        console.warn('Masalar yüklenemedi:', err);
        return { data: [] };
      });

      const reservationsRes = await reservationService.getAll().catch(err => {
        console.warn('Rezervasyonlar yüklenemedi:', err);
        return { data: [] };
      });

      const personnelRes = await personnelService.getAll().catch(err => {
        console.warn('Personeller yüklenemedi:', err);
        return { data: [] };
      });

      const usersRes = await userService.getAll().catch(err => {
        console.warn('Uyeler yüklenemedi:', err);
        return { data: [] };
      });

      const paymentsRes = await paymentService.getAll().catch(err => {
        console.warn('Odemeler yüklenemedi:', err);
        return { data: [] };
      });

      const cashRes = await cashService.getAll().catch(err => {
        console.warn('Kasa hareketleri yüklenemedi:', err);
        return { data: [] };
      });

      const ordersRes = await orderService.getAll().catch(err => {
        console.warn('Siparisler yüklenemedi:', err)
        return { data: [] };
      });

      console.log('Urunler:', productsRes);
      console.log('Kategoriler:', categoriesRes);
      console.log('Malzemeler:', materialsRes);
      console.log('Masalar:', tablesRes);
      console.log('Rezervasyonlar:', reservationsRes);
      console.log('Personeller:', personnelRes);
      console.log('Uyeler:', usersRes);
      console.log('Odemeler:', paymentsRes);
      console.log('Kasa:', cashRes);
      console.log('Siparisler:', ordersRes);

      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
      setCategories(Array.isArray(categoriesRes?.data) ? categoriesRes.data : []);
      setMaterials(Array.isArray(materialsRes?.data) ? materialsRes.data : []);
      setTables(Array.isArray(tablesRes?.data) ? tablesRes.data : []);
      setReservations(Array.isArray(reservationsRes?.data) ? reservationsRes.data : []);
      setPersonnel(Array.isArray(personnelRes?.data) ? personnelRes.data : []);
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
      setPayments(Array.isArray(paymentsRes?.data) ? paymentsRes.data : []);
      setCash(Array.isArray(cashRes?.data) ? cashRes.data : []);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);

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

      console.log('Veriler basariyla yüklendi!');
      console.log('State güncellemeleri tamamlandi.');
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      toast.error('Veriler yüklenirken hata olustu!');
    }
  };

  // Durum Renkleri
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandi': return 'bg-green-500/20 text-green-400';
      case 'Hazirlaniyor': return 'bg-yellow-500/20 text-yellow-400';
      case 'Bekliyor': return 'bg-orange-500/20 text-orange-400';
      case 'Teslim Edildi': return 'bg-blue-500/20 text-blue-400';
      case 'Iptal': return 'bg-red-500/20 text-red-400';
      case 'Odendi': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Kullanici Bilgileri
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
      console.error('Kullanici verileri alinamadi:', error);
    }
  };

  // Use Effect
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

  // Cikis
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      toast.success('Basariyla cikis yapildi!');
      navigate('/login');
    } catch (err) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Personel Listele
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
      toast.error('Personeller yüklenirken hata olustu!');
    }
  };

  // Urun Listele
  const handleUrunListele = async () => {
    try {
      const response = await productService.getAll();
      const data = response.data || [];

      console.log('Tüm ürünler:', data);

      data.forEach((urun, index) => {
        console.log(`Urun ${index + 1}: ${urun.urunAdi} - isActive:`, urun.isActive, '| IsActive:', urun.IsActive);
      });

      const pasifUrunler = data.filter(u => {
        const active = u.isActive ?? u.IsActive ?? u.is_active ?? u.IS_ACTIVE;
        return active === false || active === 0 || active === 'false' || active === '0';
      });

      const aktifUrunler = data.filter(u => {
        const active = u.isActive ?? u.IsActive ?? u.is_active ?? u.IS_ACTIVE;
        return active === true || active === 1 || active === 'true' || active === '1' || active == null;
      });

      console.log('Aktif ürünler:', aktifUrunler.length);
      console.log('Pasif ürünler:', pasifUrunler.length);
      console.log('Pasif ürün listesi:', pasifUrunler);

      setUrunListesi(data);
      setShowUrunListele(true);

      toast.info(`${data.length || 0} ürün (${aktifUrunler.length} aktif, ${pasifUrunler.length} pasif)`);
    } catch (error) {
      console.error('Urunler yüklenirken hata:', error);
      toast.error('Urunler yüklenirken hata olustu!');
    }
  };

  // Uye Listele
  const handleUyeListele = async () => {
    try {
      setUyeLoading(true);
      const response = await userService.getAll();
      setUyeListesi(response.data || []);
      setShowUyeListele(true);
      toast.info(`${response.data?.length || 0} üye bulundu`);
    } catch (error) {
      console.error('Uyeler yüklenirken hata:', error);
      toast.error('Uyeler yüklenirken hata olustu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // Uye Ekle
  const handleUyeEkleSubmit = async (e) => {
    e.preventDefault();
    if (!yeniUye.uyeAdi || !yeniUye.uyeSoyadi || !yeniUye.uyeEmail) {
      toast.warning('Lutfen tüm zorunlu alanlari doldurun!');
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
      toast.success('Uye basariyla eklendi!');
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
      console.error('Uye eklenirken hata:', error);
      toast.error('Uye eklenirken hata olustu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // Uye Sil
  const handleUyeSilSubmit = async (e) => {
    e.preventDefault();
    if (!silinecekUyeId) {
      toast.warning('Lutfen uye ID girin!');
      return;
    }
    if (!window.confirm('Bu uyeyi silmek istediginizden emin misiniz?')) return;

    try {
      setUyeLoading(true);
      await userService.delete(parseInt(silinecekUyeId));
      toast.success('Uye basariyla silindi!');
      setSilinecekUyeId('');
      setShowUyeSil(false);
      await handleUyeListele();
    } catch (error) {
      console.error('Uye silinirken hata:', error);
      toast.error('Uye silinirken hata olustu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // Uye Duzenle
  const handleUyeDuzenleSubmit = async (e) => {
    e.preventDefault();
    if (!duzenlenecekUyeId || !duzenlenecekUyeAdi || !duzenlenecekUyeSoyadi || !duzenlenecekUyeEmail) {
      toast.warning('Lutfen tüm alanlari doldurun!');
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
      toast.success('Uye basariyla güncellendi!');
      setDuzenlenecekUyeId('');
      setDuzenlenecekUyeAdi('');
      setDuzenlenecekUyeSoyadi('');
      setDuzenlenecekUyeEmail('');
      setDuzenlenecekUyeTelefon('');
      setDuzenlenecekUyeAdres('');
      setShowUyeDuzenle(false);
      await handleUyeListele();
    } catch (error) {
      console.error('Uye güncellenirken hata:', error);
      toast.error('Uye güncellenirken hata olustu!');
    } finally {
      setUyeLoading(false);
    }
  };

  // Kategori Listele
  const handleKategoriListele = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data || []);
      setShowKategoriListele(true);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast.error('Kategoriler yüklenirken hata olustu!');
    }
  };

  // Odeme Listele
  const handleOdemeListele = async () => {
    try {
      setFinansLoading(true);
      const response = await paymentService.getAll();
      setOdemeler(response.data || []);
      setShowOdeme(true);
    } catch (error) {
      console.error('Odemeler yüklenirken hata:', error);
      toast.error('Odemeler yüklenirken hata olustu!');
    } finally {
      setFinansLoading(false);
    }
  };

  // Kasa Hareketleri Listele
  const handleKasaHareketleri = async () => {
    try {
      setFinansLoading(true);
      const response = await cashService.getAll();
      setKasaHareketleri(response.data || []);
      setShowKasa(true);
    } catch (error) {
      console.error('Kasa hareketleri yüklenirken hata:', error);
      toast.error('Kasa hareketleri yüklenirken hata olustu!');
    } finally {
      setFinansLoading(false);
    }
  };

  // Stok Durumu Listele
  const handleStokDurumu = async () => {
    try {
      setStokLoading(true);
      const response = await materialService.getAll();
      setMaterials(response.data || []);
      setShowStokDurumu(true);
      toast.info(`${response.data?.length || 0} malzeme bulundu`);
    } catch (error) {
      console.error('Stok durumu yüklenirken hata:', error);
      toast.error('Stok durumu yüklenirken hata olustu!');
    } finally {
      setStokLoading(false);
    }
  };

  // Siparisleri Listele
  const handleSiparisListele = async () => {
    try {
      const response = await orderService.getAll();
      setOrders(response.data || []);

      const aktif = response.data?.filter(
        o => o.siparisDurumu !== 'TAMAMLANDI' &&
          o.siparisDurumu !== 'IPTAL' &&
          o.siparisDurumu !== 'ODENDI'
      ).length || 0;

      toast.info(`${aktif} aktif siparis bulundu (Toplam: ${response.data?.length || 0})`);
    } catch (error) {
      console.error('Siparisler yüklenirken hata:', error);
      toast.error('Siparisler yüklenirken hata olustu!');
    }
  };

  // Rezervasyon Listele
  const handleRezervasyonListele = async () => {
    try {
      const response = await reservationService.getAll();
      const data = response.data || [];
      setReservations(data);
      setShowRezervasyonListele(true);
      toast.info(`${data.length} rezervasyon bulundu`);
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      toast.error('Rezervasyonlar yüklenirken hata olustu!');
    }
  };

  // Siparis Tamamla
  const handleSiparisTamamla = async (siparisId) => {
    if (!window.confirm('Siparisi tamamlamak istediginize emin misiniz?\n\nBu islem stoklari otomatik dusecektir!')) {
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/Siparisler/${siparisId}/tamamla`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success(`Siparis #${siparisId} tamamlandi ve stoklar güncellendi!`);
      handleSiparisListele();
    } catch (error) {
      console.error('Siparis tamamlama hatasi:', error);

      if (error.response?.data?.Hatalar) {
        const hatalar = error.response.data.Hatalar.join('\n');
        toast.error(`${hatalar}`);
      } else if (error.response?.data?.Mesaj) {
        toast.error(`${error.response.data.Mesaj}`);
      } else {
        toast.error('Siparis tamamlanirken hata olustu!');
      }
    }
  };

  // eksik malzeme taleplerinin tümünü getir
const fetchMalzemeTalepler = async () => {
  try {
    setTalepLoading(true);
    const response = await malzemeTalepAPI.getAdminTalepler();
    setMalzemeTalepler(response.data || []);
    setShowMalzemeTalepler(true);
    toast.info(`${response.data?.length || 0} talep bulundu`);
  } catch (error) {
    console.error('Talepler yüklenirken hata:', error);
    toast.error('Talepler yüklenirken hata oluştu!');
  } finally {
    setTalepLoading(false);
  }
};

// Talep onayla
const handleTalepOnayla = async (talepId) => {
  if (!window.confirm('Bu talebi onaylamak istediğinize emin misiniz?')) return;
  
  try {
    await malzemeTalepAPI.adminOnayla(talepId);
    toast.success('Talep onaylandı!');
    fetchMalzemeTalepler(); // Listeyi yenile
  } catch (error) {
    console.error('Onay hatası:', error);
    toast.error('Talep onaylanamadı!');
  }
};

// Talep reddet
const handleTalepReddet = async (talepId) => {
  if (!window.confirm('Bu talebi reddetmek istediğinize emin misiniz?')) return;
  
  try {
    await malzemeTalepAPI.adminReddet(talepId);
    toast.success('Talep reddedildi!');
    fetchMalzemeTalepler(); // Listeyi yenile
  } catch (error) {
    console.error('Reddetme hatası:', error);
    toast.error('Talep reddedilemedi!');
  }
};

  // ============ RENDER FONKSIYONLARI ============

  // Personel Yonetimi Sayfasi
  const renderPersonnel = () => {
    return <PersonelButonlari
      setShowPersonelEkle={setShowPersonelEkle}
      setShowPersonelDuzenle={setShowPersonelDuzenle}
      setShowPersonelSil={setShowPersonelSil}
      handlePersonelListele={handlePersonelListele}
    />;
  };

  // Urun ve Menu Yonetimi Sayfasi
  const renderProductMenu = () => {
    return <UrunButonlari
      setShowUrunEkle={setShowUrunEkle}
      setShowUrunSil={setShowUrunSil}
      setShowUrunDuzenle={setShowUrunDuzenle}
      handleUrunListele={handleUrunListele}
    />;
  };

  // Uye Yonetimi Sayfasi
  const renderMembers = () => {
    return <UyeButonlari
      setShowUyeEkle={setShowUyeEkle}
      setShowUyeSil={setShowUyeSil}
      setShowUyeDuzenle={setShowUyeDuzenle}
      handleUyeListele={handleUyeListele}
      setShowUyeDetay={setShowUyeDetay}
    />;
  };

  // Finans ve Kasa Yonetimi Sayfasi
  const renderFinance = () => {
    return <FinansButonlari
      handleOdemeListele={handleOdemeListele}
      setShowGunSonu={setShowGunSonu}
      setShowIade={setShowIade}
      handleKasaHareketleri={handleKasaHareketleri}
    />;
  };

  // Depo / Stok Yonetimi Sayfasi
  const renderStock = () => {
    return <StokButonlari
      handleStokDurumu={handleStokDurumu}
      setShowMalzemeGiris={setShowMalzemeGiris}
      setShowMalzemeCikis={setShowMalzemeCikis}
      setShowStokHareket={setShowStokHareket}
      handleMalzemeTalepler={fetchMalzemeTalepler}
    />;
  };

  // Masa Yonetimi Sayfasi
  const renderMasa = () => {
    return <MasaButonlari
      tables={tables}
      setShowMasaEkle={setShowMasaEkle}
      setShowMasaSil={setShowMasaSil}
      setShowMasaDuzenle={setShowMasaDuzenle}
    />;
  };

  // Rezervasyon Yonetimi Sayfasi
  const renderRezervasyon = () => {
    return <RezervasyonButonlari
      setShowRezervasyonEkle={setShowRezervasyonEkle}
      setShowRezervasyonSil={setShowRezervasyonSil}
      setShowRezervasyonDuzenle={setShowRezervasyonDuzenle}
      handleRezervasyonListele={handleRezervasyonListele}
    />;
  };

  // Masa ve Rezervasyon Yonetimi Sayfasi (Birlikte)
  const renderTables = () => {
    return (
      <div className="space-y-6">
        <MasaButonlari
          tables={tables}
          setShowMasaEkle={setShowMasaEkle}
          setShowMasaSil={setShowMasaSil}
          setShowMasaDuzenle={setShowMasaDuzenle}
        />
        <RezervasyonButonlari
          setShowRezervasyonEkle={setShowRezervasyonEkle}
          setShowRezervasyonSil={setShowRezervasyonSil}
          setShowRezervasyonDuzenle={setShowRezervasyonDuzenle}
          handleRezervasyonListele={handleRezervasyonListele}
        />
      </div>
    );
  };

  // Siparis Yonetimi Sayfasi
  const renderOrders = () => {
    return <SiparisYonetimi
      orders={orders}
      siparisGosterimModu={siparisGosterimModu}
      setSiparisGosterimModu={setSiparisGosterimModu}
      handleSiparisListele={handleSiparisListele}
      handleSiparisTamamla={handleSiparisTamamla}
      setShowSiparisDetay={setShowSiparisDetay}
    />;
  };

  // Raporlar Sayfasi
  const renderReports = () => {
    return <Rapor />;
  };

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
      case 'product_menu':
        return (
          <div className="space-y-6">
            <UrunButonlari
              setShowUrunEkle={setShowUrunEkle}
              setShowUrunSil={setShowUrunSil}
              setShowUrunDuzenle={setShowUrunDuzenle}
              handleUrunListele={handleUrunListele}
            />
            <KategoriButonlari
              setShowKategoriEkle={setShowKategoriEkle}
              setShowKategoriSil={setShowKategoriSil}
              setShowKategoriDuzenle={setShowKategoriDuzenle}
              handleKategoriListele={handleKategoriListele}
            />
          </div>
        );
      case 'members':
        return <UyeButonlari
          setShowUyeEkle={setShowUyeEkle}
          setShowUyeSil={setShowUyeSil}
          setShowUyeDuzenle={setShowUyeDuzenle}
          handleUyeListele={handleUyeListele}
          setShowUyeDetay={setShowUyeDetay}
        />;
      case 'finance':
        return <FinansButonlari
          handleOdemeListele={handleOdemeListele}
          setShowGunSonu={setShowGunSonu}
          setShowIade={setShowIade}
          handleKasaHareketleri={handleKasaHareketleri}
        />;
      case 'stock':
        return <StokButonlari
          handleStokDurumu={handleStokDurumu}
          setShowMalzemeGiris={setShowMalzemeGiris}
          setShowMalzemeCikis={setShowMalzemeCikis}
          setShowStokHareket={setShowStokHareket}
        />;
      case 'orders':
        return renderOrders();
      case 'tables':
        return renderTables();
      case 'personnel':
        return renderPersonnel();
      case 'reports':
        return renderReports();
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
                  <span className="hidden sm:inline">Sifre Degistir</span>
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

      {/* Personel Modallari */}
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

      {/* Urun Modallari */}
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

      {/* Uye Modallari */}
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
        onSuccess={handleUyeListele}
      />
      <UyeDetay
        acik={showUyeDetay}
        kapat={() => setShowUyeDetay(false)}
      />

      {/* Kategori Modallari */}
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

      {/* Masa Modallari */}
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

      {/* Rezervasyon Modallari */}
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
      <RezervasyonListele
        acik={showRezervasyonListele}
        kapat={() => setShowRezervasyonListele(false)}
      />

      {/* Finans Modallari */}
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

      {/* Stok Modallari */}
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

      {/* Siparis Detay Modal */}
      <SiparisDetay
        acik={showSiparisDetay}
        kapat={() => setShowSiparisDetay(false)}
      />
    </div>
  );
};

export default AdminPanel;