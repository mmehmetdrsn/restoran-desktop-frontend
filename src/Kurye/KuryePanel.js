// src/Kurye/KuryePanel.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaTruck, FaCheckCircle, 
  FaPhone, FaHistory, FaEye, FaTimes, FaSpinner, FaSync,
  FaBoxOpen, FaMapMarkerAlt, FaHome,
  FaKey, FaChevronDown, FaUser, FaMoon, FaSun
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { kuryeAPI, authService } from '../api/api';
import { useAppDialog } from '../components/dialog/AppDialogProvider';

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const KuryePanel = () => {
  const { confirm, prompt } = useAppDialog();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deliveries');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [isDayMode, setIsDayMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const userMenuRef = useRef(null);

  let userData = null;
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  if (sessionUser) userData = JSON.parse(sessionUser);
  else if (localUser) userData = JSON.parse(localUser);

  console.log('🔍 Kullanıcı verisi:', userData);

  const personelId =
    userData?.personelId ??
    userData?.PersonelId ??
    userData?.id ??
    userData?.Id;

  console.log('🔍 Kurye ID:', personelId);

  // ========== DURUM ETİKETLERİ ==========
  const getStatusInfo = (status) => {
    const statusMap = {
      'HAZIR': { label: 'Hazır', icon: '📦', color: 'bg-yellow-500/20 text-yellow-400' },
      'KURYEDE': { label: 'Teslim Alındı', icon: '📦', color: 'bg-blue-500/20 text-blue-400' },
      'YOLDA': { label: 'Yolda', icon: '🚚', color: 'bg-purple-500/20 text-purple-400' },
      'TESLIM EDILDI': { label: 'Teslim Edildi', icon: '✅', color: 'bg-green-500/20 text-green-400' },
      'Teslim Edildi': { label: 'Teslim Edildi', icon: '✅', color: 'bg-green-500/20 text-green-400' }
    };
    return statusMap[status] || { label: status, icon: '📦', color: 'bg-gray-500/20 text-gray-400' };
  };

  // ========== BACKEND DTO -> FRONTEND ALAN EŞLEMESİ ==========
  const mapSiparisToOrder = (s) => {
    console.log('🔄 Map ediliyor:', s);
    
    let status = s.siparisDurumu || s.SiparisDurumu || 'Bilinmiyor';
    
    const items = s.detaylar || s.Detaylar || [];
    const itemList = items.map(item => ({
        urunAdi: item.urunAdi || item.UrunAdi || 'Ürün',
        adet: item.adet || item.Adet || 1,
        birimFiyat: item.birimFiyat || item.BirimFiyat || 0,
        satirToplami: item.satirToplami || item.SatirToplami || 0,
        detayNot: item.detayNot || item.DetayNot || ''
    }));
    
    return {
      id: s.siparisId ?? s.SiparisId,
      customer: s.musteriAdSoyad ?? s.MusteriAdSoyad ?? 'Müşteri',
      address: s.acikAdres ?? s.AcikAdres ?? 'Adres girilmemiş',
      amount: s.toplamTutar ?? s.ToplamTutar ?? 0,
      status: status,
      time: formatElapsed(s.siparisTarihi ?? s.SiparisTarihi),
      phone: s.musteriTelefon ?? s.MusteriTelefon ?? '',
      rawStatus: status,
      items: itemList,
      siparisDetay: s.detaylar ?? s.Detaylar ?? []
    };
  };

  const formatElapsed = (tarih) => {
    if (!tarih) return '';
    try {
      const diffMs = Date.now() - new Date(tarih).getTime();
      const diffMin = Math.max(0, Math.round(diffMs / 60000));
      return `${diffMin} dk`;
    } catch {
      return '';
    }
  };

  // ========== AKTİF SİPARİŞLERİ BACKEND'DEN ÇEK ==========
  const fetchActiveOrders = useCallback(async () => {
    if (!personelId) {
      toast.error('Kurye kimliği bulunamadı, lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log('📦 Kurye ID:', personelId);
      console.log('📦 Siparişler çekiliyor...');
      
      const response = await kuryeAPI.getAktifSiparisler(personelId);
      console.log('📦 API Yanıtı:', response);
      
      let data = [];
      if (response?.data?.data) {
        data = response.data.data;
      } else if (response?.data) {
        data = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        data = response;
      }
      
      console.log(`📦 ${data.length} sipariş bulundu.`);
      
      data.forEach((s, index) => {
        console.log(`  ${index + 1}. Sipariş #${s.siparisId} - Durum: ${s.siparisDurumu} - Tip: ${s.siparisTipi}`);
      });
      
      const filteredData = data.filter(s => 
        s.siparisDurumu === "KURYEDE" || 
        s.siparisDurumu === "YOLDA"
      );
      
      console.log(`📦 Filtre sonrası ${filteredData.length} sipariş gösteriliyor.`);
      
      setActiveOrders(filteredData.map(mapSiparisToOrder));
    } catch (err) {
      console.error('❌ Hata:', err);
      toast.error('❌ Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [personelId]);

  // ========== GEÇMİŞ SİPARİŞLERİ BACKEND'DEN ÇEK ==========
  const fetchHistoryOrders = useCallback(async () => {
    if (!personelId) return;
    try {
      console.log('📦 Geçmiş siparişler çekiliyor...');
      const response = await kuryeAPI.getTeslimGecmisi(personelId);
      console.log('📦 Geçmiş API Yanıtı:', response);
      
      const data = response?.data || [];
      console.log(`📦 ${data.length} geçmiş sipariş bulundu.`);
      
      localStorage.setItem('historyOrders', JSON.stringify(data));
      setHistoryOrders(data.map(mapSiparisToOrder));
    } catch (err) {
      console.error('❌ Geçmiş siparişler yüklenirken hata:', err);
      try {
        const savedHistory = localStorage.getItem('historyOrders');
        if (savedHistory) {
          setHistoryOrders(JSON.parse(savedHistory).map(mapSiparisToOrder));
        }
      } catch (e) {
        console.error('❌ LocalStorage okuma hatası:', e);
      }
    }
  }, [personelId]);

  // ========== SİPARİŞ DURUMUNU GÜNCELLE ==========
  const updateOrderStatus = async (orderId, newStatus, actionLabel) => {
    if (updatingOrderId === orderId) return;
    
    try {
        setUpdatingOrderId(orderId);
        
        console.log(`🔄 Sipariş #${orderId} durumu güncelleniyor: ${newStatus}`);
        
        await kuryeAPI.updateSiparisDurum(orderId, {  
            siparisDurumu: newStatus,
            personelId: personelId 
        });
        
        toast.success(`✅ Sipariş #${orderId} ${actionLabel}`);
        
        await fetchActiveOrders();
        await fetchHistoryOrders();
        
    } catch (error) {
        console.error('❌ Durum güncelleme hatası:', error);
        toast.error(`❌ ${error?.response?.data || error?.message || 'Hata oluştu!'}`);
    } finally {
        setUpdatingOrderId(null);
    }
  };

  // ========== TESLİMAT ADIMLARI ==========
  const handleTeslimAl = async (order) => {
    if (!order) return;
    
    const onay = await confirm({
      title: 'Teslim Al Onayi',
      message: `Siparis #${order.id}\nMusteri: ${order.customer}\nAdres: ${order.address}\n\nSiparisi teslim aldiginizi onayliyor musunuz?`,
      confirmText: 'Teslim Al',
      cancelText: 'Iptal'
    });
    
    if (!onay) {
      toast.info('Teslim alma iptal edildi.');
      return;
    }

    updateOrderStatus(order.id, 'KURYEDE', 'teslim alındı');
  };

  const handleYolaCik = async (order) => {
    if (!order) return;
    
    const onay = await confirm({
      title: 'Yola Cikis Onayi',
      message: `Siparis #${order.id}\nMusteri: ${order.customer}\nAdres: ${order.address}\n\nYola ciktiginizi onayliyor musunuz?`,
      confirmText: 'Yola Cik',
      cancelText: 'Iptal'
    });
    
    if (!onay) {
      toast.info('Yola çıkma iptal edildi.');
      return;
    }
    
    updateOrderStatus(order.id, 'YOLDA', 'yola çıkıldı');
    
    setTimeout(() => {
      toast.info(`📱 ${order.customer} müşterisine "Kurye yolda!" bildirimi gönderildi.`);
    }, 1000);
  };

  const handleTeslimEt = async (order) => {
    if (!order) return;
    
    const onay = await confirm({
      title: 'Teslimat Onayi',
      message: `Siparis #${order.id}\nMusteri: ${order.customer}\nAdres: ${order.address}\nTutar: ₺${order.amount}\n\nTeslimati onayliyor musunuz?`,
      confirmText: 'Teslim Et',
      cancelText: 'Iptal'
    });
    
    if (!onay) {
      toast.info('Teslimat onayı iptal edildi.');
      return;
    }

    updateOrderStatus(order.id, 'TESLIM EDILDI', 'teslim edildi');
    
    setTimeout(() => {
      toast.info(`📱 ${order.customer} müşterisine "Siparişiniz teslim edildi!" bildirimi gönderildi.`);
    }, 1000);
  };

  // ========== MANUEL YENİLEME ==========
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActiveOrders();
    await fetchHistoryOrders();
    toast.info('🔄 Siparişler yenilendi!');
  };

  // ========== MÜŞTERİ ARA ==========
  const handleCallCustomer = async (order) => {
    if (!order) return;
    
    if (order?.phone) {
      toast.info(`📞 ${order.phone} aranıyor...`);
      window.location.href = `tel:${order.phone}`;
    } else {
      const phone = await prompt({
        title: 'Musteri Telefonu',
        message: 'Musteri telefon numarasini girin:',
        placeholder: '05xxxxxxxxx',
        confirmText: 'Ara',
        cancelText: 'Iptal'
      });
      if (phone?.trim()) {
        toast.success(`📞 ${phone} aranıyor...`);
        window.location.href = `tel:${phone}`;
      }
    }
  };

  // ========== UYGULAMA AÇILDIĞINDA VERİLERİ YÜKLE ==========
  useEffect(() => {
    fetchActiveOrders();
    fetchHistoryOrders();

    const interval = setInterval(() => {
      console.log('🔄 Otomatik yenileme çalışıyor...');
      fetchActiveOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchActiveOrders, fetchHistoryOrders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========== ÇIKIŞ ==========
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    toast.success('👋 Başarıyla çıkış yapıldı!');
    navigate('/login');
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

  // ========== SİPARİŞ DETAY MODALI ==========
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const statusInfo = getStatusInfo(order.status);
    const isUpdating = updatingOrderId === order.id;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-black/90 rounded-2xl border border-white/10 max-w-2xl w-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white text-xl font-bold">📋 Sipariş #{order.id}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer"><FaTimes /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-gray-400 text-xs">Müşteri</p><p className="text-white font-medium">{order.customer}</p></div>
              <div><p className="text-gray-400 text-xs">Tutar</p><p className="text-yellow-400 font-bold">₺{order.amount}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Adres</p><p className="text-gray-300">{order.address}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Durum</p>
                <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
            </div>
            
            {/*  Ürün detayları */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <p className="text-gray-400 text-xs mb-2">Ürünler:</p>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                      <span>•</span>
                      <span>{item.urunAdi}</span>
                      <span className="text-gray-500">x{item.adet}</span>
                      {item.detayNot && (
                        <span className="text-yellow-500/70 text-[10px]">({item.detayNot})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-white/10 pt-4">
              <p className="text-gray-400 text-xs mb-3">Teslimat Adımları:</p>
              <div className="flex flex-wrap gap-2">
                {order.status === 'HAZIR' && (
                  <button 
                    onClick={() => handleTeslimAl(order)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <FaSpinner className="animate-spin" /> : <FaBoxOpen />}
                    Teslim Al
                  </button>
                )}
                
                {order.status === 'KURYEDE' && (
                  <button 
                    onClick={() => handleYolaCik(order)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
                    Yola Çık
                  </button>
                )}
                
                {order.status === 'YOLDA' && (
                  <button 
                    onClick={() => handleTeslimEt(order)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <FaSpinner className="animate-spin" /> : <FaHome />}
                    Teslim Et
                  </button>
                )}
                
                {(order.status === 'TESLIM EDILDI' || order.status === 'Teslim Edildi') && (
                  <div className="flex-1 px-4 py-3 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center gap-2">
                    <FaCheckCircle /> Teslim Edildi ✅
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleCallCustomer(order)} className="flex-1 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <FaPhone /> Müşteriyi Ara
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // TESLİMATLAR
  // ============================================================
  const DeliveriesContent = () => {
    if (loading) {
      return (
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-10 border border-white/10 flex flex-col items-center justify-center gap-3">
          <FaSpinner className="animate-spin text-yellow-400 text-2xl" />
          <p className="text-gray-400">Siparişler yükleniyor...</p>
        </div>
      );
    }

    return (
      <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <FaTruck className="text-yellow-400" /> Teslimatlar
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
            </button>
            <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
              {activeOrders.length} aktif sipariş
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4">Teslimat adımlarını takip edin:</p>
        
        <div className="space-y-3">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const isUpdating = updatingOrderId === order.id;
              const isCompleted = order.status === 'TESLIM EDILDI' || order.status === 'Teslim Edildi';
              
              return (
                <div key={order.id} className={`flex items-center justify-between p-4 rounded-xl transition-all ${isCompleted ? 'bg-green-500/5 border border-green-500/20' : 'bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color.replace('text-', 'bg-').replace('/20', '/20')}`}>
                      <span className="text-xl">{statusInfo.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">#{order.id}</span>
                        <span className="text-white">{order.customer}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      {/* Ürünleri göster */}
                      {order.items && order.items.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-gray-400 text-xs flex items-center gap-2">
                              <span>•</span>
                              <span>{item.urunAdi}</span>
                              <span className="text-gray-500">x{item.adet}</span>
                              {item.detayNot && (
                                <span className="text-yellow-500/70 text-[10px]">({item.detayNot})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-400 text-sm">{order.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-yellow-400 font-semibold text-sm">₺{order.amount}</span>
                        <span className="text-gray-500 text-xs">{order.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'HAZIR' && (
                      <button 
                        onClick={() => handleTeslimAl(order)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isUpdating ? <FaSpinner className="animate-spin" size={12} /> : <FaBoxOpen size={12} />}
                        Teslim Al
                      </button>
                    )}
                    
                    {order.status === 'KURYEDE' && (
                      <button 
                        onClick={() => handleYolaCik(order)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isUpdating ? <FaSpinner className="animate-spin" size={12} /> : <FaMapMarkerAlt size={12} />}
                        Yola Çık
                      </button>
                    )}
                    
                    {order.status === 'YOLDA' && (
                      <button 
                        onClick={() => handleTeslimEt(order)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isUpdating ? <FaSpinner className="animate-spin" size={12} /> : <FaCheckCircle size={12} />}
                        Teslim Et
                      </button>
                    )}
                    
                    {isCompleted && (
                      <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-1">
                        <FaCheckCircle size={12} /> Tamamlandı
                      </span>
                    )}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCallCustomer(order); }} 
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all cursor-pointer"
                    >
                      <FaPhone size={12} />
                    </button>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowOrderModal(true); }} 
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all cursor-pointer"
                    >
                      <FaEye size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">🎉 Teslim edilecek sipariş kalmadı!</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // GEÇMİŞ
  // ============================================================
  const HistoryContent = () => (
    <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
        <FaHistory className="text-blue-400" /> Geçmiş Siparişler
      </h3>
      <p className="text-gray-400 mb-4">Tamamlanan siparişler:</p>
      
      <div className="space-y-2">
        {historyOrders.length > 0 ? (
          historyOrders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div>
                <span className="text-white font-medium">#{order.id}</span>
                <span className="text-gray-300 ml-2">{order.customer}</span>
              </div>
              <span className="text-yellow-400">₺{order.amount}</span>
              <span className="text-green-400 text-sm flex items-center gap-1">
                <FaCheckCircle /> Tamamlandı
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">📭 Henüz tamamlanmış sipariş yok!</div>
        )}
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={`min-h-screen relative ${isDayMode ? 'kurye-day' : ''}`} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className={`absolute inset-0 ${isDayMode ? 'bg-white/30' : 'bg-black/40'} backdrop-blur-xl`}></div>
      
      <div className="relative z-10">
        <div className={`${isDayMode ? 'bg-white/85 border-slate-200/70' : 'bg-black/80 border-white/10'} backdrop-blur-sm border-b sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-auto py-4">
              <div className="flex items-center gap-3 flex-shrink-0 min-w-[190px] pl-0">
                <div className="text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/new-logo.jpeg`}
                    alt="SekerRestoran Logo"
                    className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                  />
                  <h1 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-sm`}>SekerRestoran</h1>
                  <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[9px]`}>Kurye Paneli</p>
                </div>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center px-4">
                <button onClick={() => setActiveTab('deliveries')} className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'deliveries' ? (isDayMode ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-white') : (isDayMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5')}`}>
                  <FaTruck /> Teslimatlar
                </button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'history' ? (isDayMode ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-white') : (isDayMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5')}`}>
                  <FaHistory /> Geçmiş
                </button>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div ref={userMenuRef} className="relative text-right">
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    title="Kullanıcı menüsü"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isDayMode ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isDayMode ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-200'}`}>
                      <FaUser size={12} />
                    </span>
                    <span className="hidden sm:block">
                      <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} text-sm font-medium`}>
                        {userData?.AdSoyad || userData?.name || 'Kurye'}
                      </p>
                      <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[10px]`}>
                        {userData?.email || 'kurye@servissa.com'}
                      </p>
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
                        Çıkış
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
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'deliveries' && <DeliveriesContent />}
          {activeTab === 'history' && <HistoryContent />}
        </div>

        {showOrderModal && selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => { setShowOrderModal(false); setSelectedOrder(null); }} />
        )}

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
      </div>
    </div>
  );
};

export default KuryePanel;