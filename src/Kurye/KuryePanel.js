import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaTruck, FaCheckCircle, 
  FaPhone, FaHistory, FaEye, FaTimes, FaSpinner, FaSync,
  FaBoxOpen, FaMapMarkerAlt, FaHome
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { kuryeAPI } from '../api/api';

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const KuryePanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deliveries');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
    
    return {
      id: s.siparisId ?? s.SiparisId,
      customer: s.musteriAdSoyad ?? s.MusteriAdSoyad ?? 'Müşteri',
      address: s.acikAdres ?? s.AcikAdres ?? 'Adres girilmemiş',
      amount: s.toplamTutar ?? s.ToplamTutar ?? 0,
      status: status,
      time: formatElapsed(s.siparisTarihi ?? s.SiparisTarihi),
      phone: s.musteriTelefon ?? s.MusteriTelefon ?? '',
      rawStatus: status,
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
      
      // 🟢 SADECE KURYEDE ve YOLDA durumlarını göster
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
        
        // ✅ Doğru çağrı
        await kuryeAPI.updateSiparisDurum(orderId, { 
            siparisDurumu: newStatus,  // DTO'daki alan adı
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
  
  // 1. Teslim Al (HAZIR → KURYEDE)
  const handleTeslimAl = (order) => {
    if (!order) return;
    
    const confirm = window.confirm(
      `📦 Sipariş #${order.id}\nMüşteri: ${order.customer}\nAdres: ${order.address}\n\nSiparişi teslim aldığınızı onaylıyor musunuz?`
    );
    
    if (!confirm) {
      toast.info('Teslim alma iptal edildi.');
      return;
    }
    
    updateOrderStatus(order.id, 'KURYEDE', 'teslim alındı');
  };

  // 2. Yola Çık (KURYEDE → YOLDA)
  const handleYolaCik = (order) => {
    if (!order) return;
    
    const confirm = window.confirm(
      `🚚 Sipariş #${order.id}\nMüşteri: ${order.customer}\nAdres: ${order.address}\n\nYola çıktığınızı onaylıyor musunuz?`
    );
    
    if (!confirm) {
      toast.info('Yola çıkma iptal edildi.');
      return;
    }
    
    updateOrderStatus(order.id, 'YOLDA', 'yola çıkıldı');
    
    // Müşteriye bildirim
    setTimeout(() => {
      toast.info(`📱 ${order.customer} müşterisine "Kurye yolda!" bildirimi gönderildi.`);
    }, 1000);
  };

  // 3. Teslim Et (YOLDA → TESLIM EDILDI)
  const handleTeslimEt = (order) => {
    if (!order) return;
    
    const confirm = window.confirm(
      `✅ Sipariş #${order.id}\nMüşteri: ${order.customer}\nAdres: ${order.address}\nTutar: ₺${order.amount}\n\nTeslimatı onaylıyor musunuz?`
    );
    
    if (!confirm) {
      toast.info('Teslimat onayı iptal edildi.');
      return;
    }
    
    updateOrderStatus(order.id, 'TESLIM EDILDI', 'teslim edildi');
    
    // Müşteriye bildirim
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
  const handleCallCustomer = (order) => {
    if (!order) return;
    
    if (order?.phone) {
      toast.info(`📞 ${order.phone} aranıyor...`);
      window.location.href = `tel:${order.phone}`;
    } else {
      const phone = prompt('📞 Müşteri telefon numarasını girin:');
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

  // ========== ÇIKIŞ ==========
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    toast.success('👋 Başarıyla çıkış yapıldı!');
    navigate('/login');
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
            
            {/* Sipariş Adımları */}
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
    <div className="min-h-screen relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      
      <div className="relative z-10">
        <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-2xl">🛵</div>
                <div>
                  <h1 className="text-white font-bold text-base">SERVISSA</h1>
                  <p className="text-gray-400 text-[10px]">{userData?.email || 'kurye@servissa.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center px-4">
                <button onClick={() => setActiveTab('deliveries')} className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'deliveries' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <FaTruck /> Teslimatlar
                </button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <FaHistory /> Geçmiş
                </button>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm">
                  <FaSignOutAlt size={14} /> Çıkış
                </button>
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
      </div>
    </div>
  );
};

export default KuryePanel;