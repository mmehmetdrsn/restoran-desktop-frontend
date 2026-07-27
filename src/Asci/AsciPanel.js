// src/Asci/AsciPanel.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaKey,
  FaTimes, FaBars, FaUtensils,
  FaCheck, FaSpinner, FaSync,
  FaMotorcycle, FaUser,
  FaExclamationTriangle, FaClipboardCheck,
  FaClock, FaChevronDown, FaMoon, FaSun
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { asciAPI, authService, malzemeTalepAPI, materialService } from '../api/api';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const AsciPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [hazirOrders, setHazirOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Aşçı',
    email: 'asci@restoran.com',
    role: 'asci',
    personelId: null
  });

  // ========== EKSİK MALZEME TALEBİ STATE'LERİ ==========
  const [showMalzemeTalep, setShowMalzemeTalep] = useState(false);
  const [malzemeler, setMalzemeler] = useState([]);
  const [talepForm, setTalepForm] = useState({
    malzemeId: '',
    miktar: '',
    birim: 'adet',
    aciklama: ''
  });
  const [talepLoading, setTalepLoading] = useState(false);

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

  // ========== MALZEME LİSTESİNİ ÇEK ==========
  const fetchMalzemeler = async () => {
    try {
      console.log('📦 Malzemeler çekiliyor...');
      const response = await materialService.getAll();
      console.log('📦 Malzeme response:', response);

      let malzemeListesi = [];
      if (response && response.data) {
        malzemeListesi = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        malzemeListesi = response;
      }

      console.log('📦 Malzeme listesi:', malzemeListesi);
      setMalzemeler(malzemeListesi);

      if (malzemeListesi.length === 0) {
        toast.warning('⚠️ Hiç malzeme bulunamadı!');
      }
    } catch (error) {
      console.error('❌ Malzemeler yüklenirken hata:', error);
      toast.error('Malzemeler yüklenemedi!');
      setMalzemeler([]);
    }
  };

  // ========== MALZEME SEÇİNCE BİRİMİ OTOMATİK DOLDUR ==========
  const handleMalzemeSec = (malzemeId) => {
    const secilenMalzeme = malzemeler.find(m => m.malzemeId === parseInt(malzemeId));
    
    if (secilenMalzeme) {
      setTalepForm({
        ...talepForm,
        malzemeId: malzemeId,
        birim: secilenMalzeme.birim || 'adet'
      });
      console.log(`📦 Seçilen malzeme: ${secilenMalzeme.malzemeAdi}, Birim: ${secilenMalzeme.birim}`);
    } else {
      setTalepForm({
        ...talepForm,
        malzemeId: malzemeId,
        birim: 'adet'
      });
    }
  };

  // ========== MALZEME TALEBİ GÖNDER ==========
  const handleMalzemeTalep = async (e) => {
    e.preventDefault();

    if (!talepForm.malzemeId || !talepForm.miktar) {
      toast.warning('Lütfen tüm alanları doldurun!');
      return;
    }

    if (parseFloat(talepForm.miktar) <= 0) {
      toast.warning('Miktar 0\'dan büyük olmalı!');
      return;
    }

    setTalepLoading(true);
    try {
      const talepData = {
        malzemeId: parseInt(talepForm.malzemeId),
        miktar: parseFloat(talepForm.miktar),
        birim: talepForm.birim || 'adet',
        aciklama: talepForm.aciklama || '',
        personelId: userData.personelId || null
      };

      console.log('Talep gönderiliyor:', talepData);
      const response = await malzemeTalepAPI.talepOlustur(talepData);
      console.log('Talep yanıtı:', response);
      toast.success('Malzeme talebi gönderildi! Admin onay bekleniyor.');

      setShowMalzemeTalep(false);
      setTalepForm({
        malzemeId: '',
        miktar: '',
        birim: 'adet',
        aciklama: ''
      });

    } catch (error) {
      console.error('Talep gönderilirken hata:', error);
      const errorMsg = error?.response?.data?.message ||
        error?.response?.data?.Mesaj ||
        error?.message ||
        'Talep gönderilemedi!';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setTalepLoading(false);
    }
  };

  // ========== SİPARİŞ DURUMUNU MAP ET ==========
  const mapStatus = (backendStatus) => {
    const status = backendStatus?.toUpperCase() || '';
    if (status === 'HAZIRLANIYOR') return 'preparing';
    if (status === 'HAZIR') return 'ready';
    return 'preparing';
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

  // ========== SADECE BUGÜNÜN SİPARİŞİ Mİ? ==========
  const isToday = (dateString) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      const now = new Date();
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    } catch {
      return false;
    }
  };

  // ========== SİPARİŞLERİ BACKEND'DEN ÇEK ==========
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await asciAPI.getAsciSiparisleri();

      let data = [];
      if (response?.data) {
        data = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        data = response;
      }

      console.log('📦 Gelen siparişler:', data);

      const todayData = data.filter(s => isToday(s.siparisTarihi));

      const isOnlineOrder = (s) =>
        s.siparisTuru
          ? s.siparisTuru.toLowerCase() === 'online'
          : !s.masaNo;

      // "Kurye Bekleyen" listesi SADECE online siparişler için.
      const hazirData = todayData.filter(s =>
        s.siparisDurumu === "HAZIR" && isOnlineOrder(s)
      );

      // Hazırlanıyor + (varsa) eski/yanlışlıkla HAZIR kalmış salon siparişleri +
      // (backend henüz güncellenmediyse) legacy BEKLEMEDE siparişleri de kaybolmasın diye burada gösteriyoruz.
      const aktifData = todayData.filter(s =>
        s.siparisDurumu === "HAZIRLANIYOR" ||
        s.siparisDurumu === "BEKLEMEDE" ||
        (s.siparisDurumu === "HAZIR" && !isOnlineOrder(s))
      );

      const aktifOrders = aktifData.map(s => ({
        id: s.siparisId,
        table: s.masaNo ? `Masa ${s.masaNo}` : 'Paket Servis',
        items: s.detaylar?.map(d => `${d.adet}x ${d.urunAdi}`) || [],
        status: mapStatus(s.siparisDurumu),
        time: formatTime(s.siparisTarihi),
        note: s.detaylar?.find(d => d.detayNot)?.detayNot || '',
        quantity: s.detaySayisi || 0,
        rawStatus: s.siparisDurumu,
        customer: s.uyeAdi || 'Ziyaretçi',
        totalAmount: s.toplamTutar || 0,
        personelAdi: s.personelAdi || null,
        siparisTuru: s.siparisTuru || (s.masaNo ? 'salon' : 'online')
      }));

      const hazirOrdersMapped = hazirData.map(s => ({
        id: s.siparisId,
        table: s.masaNo ? `Masa ${s.masaNo}` : 'Paket Servis',
        items: s.detaylar?.map(d => `${d.adet}x ${d.urunAdi}`) || [],
        status: mapStatus(s.siparisDurumu),
        time: formatTime(s.siparisTarihi),
        note: s.detaylar?.find(d => d.detayNot)?.detayNot || '',
        quantity: s.detaySayisi || 0,
        rawStatus: s.siparisDurumu,
        customer: s.uyeAdi || 'Ziyaretçi',
        totalAmount: s.toplamTutar || 0,
        personelAdi: s.personelAdi || null,
        siparisTuru: s.siparisTuru || (s.masaNo ? 'salon' : 'online')
      }));

      setOrders(aktifOrders);
      setHazirOrders(hazirOrdersMapped);

      console.log(`📊 Aktif: ${aktifOrders.length}, Hazır: ${hazirOrdersMapped.length}`);

    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      toast.error('❌ Siparişler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== SİPARİŞ DURUMUNU GÜNCELLE ==========
  const updateOrderStatus = async (orderId, newStatus) => {
    if (updatingOrderId === orderId) return;

    try {
      setUpdatingOrderId(orderId);

      if (newStatus === 'ready') {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
          toast.error('Sipariş bulunamadı!');
          return;
        }

        await asciAPI.updateSiparisDurum(orderId, 'HAZIR');
        console.log(`✅ Sipariş #${orderId} backend'de HAZIR yapıldı`);

        if (order.siparisTuru === 'online') {
          try {
            const response = await fetch(`${API_BASE_URL}/Asci/siparis/${orderId}/hazir-ve-kurye-ata`, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
              }
            });

            const apiResult = await response.json();
            console.log('📦 API Sonucu:', apiResult);

            if (apiResult.success) {
              toast.success(`✅ ${apiResult.message}`);
            } else {
              toast.warning(`⚠️ ${apiResult.message}`);
            }
          } catch (error) {
            console.error('❌ Kurye atama hatası:', error);
            toast.error('❌ Kurye atama başarısız!');
          }
        } else {
          try {
            await asciAPI.garsonaBildirimGonder(orderId);
            toast.success(`✅ Sipariş #${orderId} hazır! Garsona bildirim gönderildi.`);
          } catch (err) {
            console.warn('Garson bildirimi gönderilemedi:', err);
            toast.success(`✅ Sipariş #${orderId} hazır!`);
          }
        }

        const completedOrder = orders.find(o => o.id === orderId);
        if (completedOrder) {
          setOrders(prev => prev.filter(o => o.id !== orderId));
          setHazirOrders(prev => {
            if (prev.some(o => o.id === orderId)) return prev;
            return [...prev, { ...completedOrder, status: 'ready', rawStatus: 'HAZIR' }];
          });
          console.log(`📦 Sipariş #${orderId} hazır listesine taşındı`);
        }

        setTimeout(() => fetchOrders(), 3000);
        return;
      }

      const statusMap = { 'preparing': 'HAZIRLANIYOR' };
      const backendStatus = statusMap[newStatus];
      if (!backendStatus) {
        toast.error('Geçersiz durum!');
        return;
      }

      console.log(`🔄 Sipariş #${orderId} durumu güncelleniyor: ${backendStatus}`);
      await asciAPI.updateSiparisDurum(orderId, backendStatus);

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus, rawStatus: backendStatus } : order
      ));

      toast.success(`✅ Sipariş #${orderId} hazırlanmaya başlandı 🍳`);
      setTimeout(() => fetchOrders(), 2000);

    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      const errorMsg = error?.response?.data?.message ||
        error?.response?.data?.Mesaj ||
        error?.message ||
        'Sipariş durumu güncellenirken bir hata oluştu!';
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
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' };
      case 'preparing': return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Hazırlanıyor' };
      case 'ready': return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hazır' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Bilinmiyor' };
    }
  };

  // ========== SİPARİŞ TÜRÜNE GÖRE RENK ==========
  const getSiparisTuruBadge = (tur) => {
    if (tur === 'online') {
      return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <FaMotorcycle className="inline mr-1" size={12} />, label: 'Online' };
    }
    return { bg: 'bg-green-500/20', text: 'text-green-400', icon: <FaUser className="inline mr-1" size={12} />, label: 'Salon' };
  };

  // ========== EFFECT'LER ==========
  useEffect(() => {
    fetchUserData();
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchUserData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========== SIDEBAR TOGGLE ==========
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ========== SİPARİŞ KARTI ==========
  const OrderCard = ({ order, isHazir = false }) => {
    const status = getStatusBadge(order.status);
    const isUpdating = updatingOrderId === order.id;
    const turBadge = getSiparisTuruBadge(order.siparisTuru);
    const isOnline = order.siparisTuru === 'online';

    return (
      <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg">{order.table}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded ${turBadge.bg} ${turBadge.text}`}>
                {turBadge.icon} {turBadge.label}
              </span>
            </div>
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

        {!isHazir && (
          <div className="flex gap-2 mt-3">
            {order.status === 'preparing' && isOnline && (
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                disabled={isUpdating}
                className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : (
                  <FaMotorcycle size={14} />
                )}
                Hazır (Kurye Ata)
              </button>
            )}
            {order.status === 'preparing' && !isOnline && (
              <div className="flex-1 text-center py-2">
                <span className="text-blue-400 text-xs flex items-center justify-center gap-2">
                  <FaUtensils size={12} />
                  Hazır olunca garson teslim edecek
                </span>
              </div>
            )}
            {order.status === 'ready' && !isOnline && (
              <div className="flex-1 text-center py-2">
                <span className="text-green-400 text-xs flex items-center justify-center gap-2">
                  <FaCheck size={12} />
                  Sipariş hazır - garson teslim edecek
                </span>
              </div>
            )}
          </div>
        )}

        {isHazir && (
          <div className="mt-3 text-center">
            <span className="text-green-400 text-xs flex items-center justify-center gap-2">
              <FaClock size={12} />
              Kurye bekleniyor...
            </span>
          </div>
        )}
      </div>
    );
  };

  // ========== RENDER ==========
  return (
    <div className={`min-h-screen relative ${isDayMode ? 'asci-day' : ''}`} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className={`absolute inset-0 ${isDayMode ? 'bg-white/30' : 'bg-black/40'} backdrop-blur-xl`}></div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`fixed lg:relative lg:flex lg:flex-col ${sidebarOpen ? 'w-64' : 'w-20'} ${isDayMode ? 'bg-white border-r border-slate-200' : 'bg-black/90 border-r border-white/10'} backdrop-blur-sm h-screen transition-all duration-300 overflow-y-auto ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-50 flex-shrink-0`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDayMode ? 'border-slate-200/80' : 'border-white/10'}`}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <img
                  src={`${process.env.PUBLIC_URL}/brand-logo.jpeg`}
                  alt="SekerRestoran Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-sm`}>SekerRestoran</h1>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[9px]`}>Aşçı Paneli</p>
                </div>
              </div>
            ) : (
              <img
                src={`${process.env.PUBLIC_URL}/brand-logo.jpeg`}
                alt="SekerRestoran Logo"
                className="w-10 h-10 rounded-full object-cover mx-auto"
              />
            )}
            <button onClick={toggleSidebar} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'} hidden lg:block`}>
              {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
            <button onClick={() => setMobileSidebarOpen(false)} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'} lg:hidden`}>
              <FaTimes size={20} />
            </button>
          </div>

          <div className="py-4 px-3">
            <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isDayMode ? 'text-slate-900 bg-slate-200' : 'text-white bg-white/10'}`}>
              <FaUtensils size={18} />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Sipariş Yönetimi</p>
                  <p className={`text-[10px] ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Gelen siparişler</p>
                </div>
              )}
            </button>

            <div className={`border-t ${isDayMode ? 'border-slate-200' : 'border-white/10'} my-3`}></div>

            <button
              onClick={() => { fetchMalzemeler(); setShowMalzemeTalep(true); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isDayMode ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-50' : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'}`}
            >
              <FaExclamationTriangle size={18} />
              {sidebarOpen && <span className="text-sm">Eksik Malzeme Talebi</span>}
            </button>
          </div>
        </div>

        <button onClick={() => setMobileSidebarOpen(true)} className={`lg:hidden fixed top-4 left-4 z-40 p-2.5 ${isDayMode ? 'bg-white/90 text-slate-800 border border-slate-200' : 'bg-black/80 text-white'} backdrop-blur-sm rounded-lg`}>
          <FaBars size={20} />
        </button>

        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Ana İçerik */}
        <div className={`flex-1 ${isDayMode ? 'bg-slate-50 text-slate-900' : ''}`}>
          <div className={`${isDayMode ? 'bg-white/85 border-slate-200/70' : 'bg-black/80 border-white/10'} backdrop-blur-sm border-b sticky top-0 z-30`}>
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-end gap-4">
                <button onClick={fetchOrders} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'} transition-colors relative`} title="Yenile">
                  <FaSync size={18} className={loading ? 'animate-spin' : ''} />
                </button>
                <div ref={userMenuRef} className="relative text-right hidden sm:block">
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    title="Kullanıcı menüsü"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isDayMode ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isDayMode ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-200'}`}>
                      <FaUser size={12} />
                    </span>
                    <span>
                      <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-sm font-medium`}>{userData.name}</p>
                      <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[10px]`}>{userData.email}</p>
                    </span>
                    <FaChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'} ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-[272px] rounded-2xl border shadow-xl z-50 overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-black/95 border-white/10'}`}>
                      <button
                        onClick={() => {
                          setShowPasswordModal(true);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-all ${isDayMode ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-200 hover:bg-white/10'}`}
                      >
                        <FaKey size={13} />
                        Şifre Değiştir
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-all ${isDayMode ? 'text-red-700 hover:bg-red-50' : 'text-red-300 hover:bg-red-500/15'}`}
                      >
                        <FaSignOutAlt size={13} />
                        Çıkış Yap
                      </button>
                      <div className={`px-3 py-3 ${isDayMode ? 'bg-slate-50' : 'bg-black/20'}`}>
                        <button
                          type="button"
                          onClick={() => setIsDayMode((prev) => !prev)}
                          title={isDayMode ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
                          className="w-full"
                        >
                          <div
                            className={`relative h-[96px] rounded-[22px] border overflow-hidden transition-all ${
                              isDayMode
                                ? 'bg-gradient-to-br from-amber-50 via-rose-50 to-sky-100 border-amber-100'
                                : 'bg-slate-800 border-slate-700'
                            }`}
                          >
                            <div
                              className={`absolute top-1.5 left-1.5 w-[calc(50%-0.375rem)] h-[calc(100%-0.75rem)] rounded-[16px] transition-all duration-300 shadow-lg ${
                                isDayMode
                                  ? 'translate-x-full bg-white/90'
                                  : 'translate-x-0 bg-slate-900'
                              }`}
                            />
                            <div className="relative z-10 h-full grid grid-cols-2">
                              <div className={`flex flex-col items-center justify-center gap-1 ${isDayMode ? 'text-slate-500' : 'text-white'}`}>
                                <FaMoon size={14} />
                                <span className="text-[9px] font-semibold tracking-[0.14em]">KARANLIK</span>
                              </div>
                              <div className={`flex flex-col items-center justify-center gap-1 ${isDayMode ? 'text-sky-900' : 'text-slate-300'}`}>
                                <FaSun size={14} />
                                <span className="text-[9px] font-semibold tracking-[0.14em]">AYDINLIK</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Mutfak Yönetimi</h1>
                <p className="text-gray-400 text-sm">Bugünün siparişlerini görüntüleyin ve yönetin</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-lg">
                  Hazırlanan: {orders.length}
                </span>
                <span className="text-green-400 text-sm bg-green-500/10 px-3 py-1 rounded-lg">
                  Kurye Bekleyen (Online): {hazirOrders.length}
                </span>
              </div>
            </div>

            {loading && orders.length === 0 && hazirOrders.length === 0 ? (
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-12 border border-white/10 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-yellow-400 text-4xl mb-4" />
                <p className="text-gray-400">Siparişler yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <FaUtensils className="text-yellow-400" size={16} />
                    Hazırlanan Siparişler <span className="text-sm text-gray-400 ml-2">({orders.length})</span>
                  </h2>
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} isHazir={false} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-black/40 rounded-2xl border border-white/10">
                      <div className="text-5xl mb-3">🍳</div>
                      <p className="text-gray-400">Hazırlanan sipariş yok</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <FaClipboardCheck className="text-green-400" size={16} />
                    Kurye Bekleyen Siparişler (Online) <span className="text-sm text-gray-400 ml-2">({hazirOrders.length})</span>
                  </h2>
                  {hazirOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {hazirOrders.map((order) => (
                        <OrderCard key={order.id} order={order} isHazir={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-black/40 rounded-2xl border border-white/10">
                      <div className="text-5xl mb-3">✅</div>
                      <p className="text-gray-400">Kurye bekleyen sipariş yok</p>
                    </div>
                  )}
                </div>

                {orders.length === 0 && hazirOrders.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍳</div>
                    <p className="text-gray-400 text-lg">Bugün henüz sipariş yok</p>
                    <p className="text-gray-500 text-sm">Yeni siparişler burada görünecek</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`${isDayMode ? 'bg-white border-slate-200' : 'bg-black/95 border-white/10'} backdrop-blur-sm rounded-2xl border shadow-2xl max-w-md w-full p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>Şifre Değiştir</h2>
              <button onClick={() => setShowPasswordModal(false)} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Mevcut Şifre</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`} placeholder="Mevcut şifreniz" disabled={passwordLoading} required />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Yeni Şifre</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`} placeholder="Yeni şifreniz (min 6 karakter)" disabled={passwordLoading} required minLength={6} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Yeni Şifre Tekrar</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`} placeholder="Yeni şifrenizi tekrar girin" disabled={passwordLoading} required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm ${isDayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>İptal</button>
                <button type="submit" disabled={passwordLoading} className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-900 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-200 text-black'}`}>
                  {passwordLoading ? (<><div className={`w-4 h-4 border-2 ${isDayMode ? 'border-white/30 border-t-white' : 'border-black/30 border-t-black'} rounded-full animate-spin`}></div> Değiştiriliyor...</>) : ('Şifreyi Değiştir')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EKSİK MALZEME TALEBİ MODALI */}
      {showMalzemeTalep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-yellow-400">📦</div>
                <div>
                  <h2 className="text-white font-bold text-lg">Eksik Malzeme Talebi</h2>
                  <p className="text-gray-400 text-xs">Eksik malzemeleri admin'e bildirin</p>
                </div>
              </div>
              <button onClick={() => setShowMalzemeTalep(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleMalzemeTalep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Malzeme *</label>
                <select 
                  value={talepForm.malzemeId} 
                  onChange={(e) => handleMalzemeSec(e.target.value)} 
                  className={`${isDayMode
                    ? 'day-mode-select w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none'
                    : 'w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none'}`}
                  required
                >
                  <option value="">Malzeme Seçin</option>
                  {malzemeler.map(m => (
                    <option key={m.malzemeId} value={m.malzemeId}>
                      {m.malzemeAdi} (Mevcut: {m.stokMiktari || 0} {m.birim})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Miktar *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={talepForm.miktar} 
                  onChange={(e) => setTalepForm({ ...talepForm, miktar: e.target.value })} 
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none" 
                  placeholder="Kaç adet/kg?" 
                  required 
                  min="0.01" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Birim</label>
                <select 
                  value={talepForm.birim} 
                  onChange={(e) => setTalepForm({ ...talepForm, birim: e.target.value })} 
                  className={`${isDayMode
                    ? 'day-mode-select w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none'
                    : 'w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 outline-none'}`}
                >
                  <option value="adet">Adet</option>
                  <option value="kg">Kg</option>
                  <option value="gr">Gr</option>
                  <option value="lt">Litre</option>
                  <option value="paket">Paket</option>
                </select>
                {/* 🔥 Seçilen malzemenin birimini göster */}
                {talepForm.malzemeId && (
                  <p className="text-xs text-green-400 mt-1">
                    ✅ Otomatik birim: <span className="font-semibold">{talepForm.birim}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Açıklama</label>
                <textarea 
                  value={talepForm.aciklama} 
                  onChange={(e) => setTalepForm({ ...talepForm, aciklama: e.target.value })} 
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none" 
                  placeholder="Neden ihtiyacınız var?" 
                  rows="2" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMalzemeTalep(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={talepLoading}>İptal</button>
                <button type="submit" disabled={talepLoading} className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {talepLoading ? (<><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Gönderiliyor...</>) : ('Talebi Gönder')}
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