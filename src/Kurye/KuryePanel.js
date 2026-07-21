import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaTruck, FaCheckCircle, 
  FaPhone, FaHistory, FaEye, FaTimes, FaSpinner
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
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  let userData = null;
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  if (sessionUser) userData = JSON.parse(sessionUser);
  else if (localUser) userData = JSON.parse(localUser);

  // Backend'de PersonelId olarak geçiyor
  const personelId =
    userData?.personelId ??
    userData?.PersonelId ??
    userData?.id ??
    userData?.Id;

  console.log('🔍 Kurye ID:', personelId);

  // ========== BACKEND DTO -> FRONTEND ALAN EŞLEMESİ ==========
  const mapSiparisToOrder = (s) => ({
    id: s.siparisId ?? s.SiparisId,
    customer: s.musteriAdSoyad ?? s.MusteriAdSoyad,
    address: s.acikAdres ?? s.AcikAdres,
    amount: s.toplamTutar ?? s.ToplamTutar,
    status: s.siparisDurumu ?? s.SiparisDurumu,
    time: formatElapsed(s.siparisTarihi ?? s.SiparisTarihi),
    phone: s.musteriTelefon ?? s.MusteriTelefon,
  });

  const formatElapsed = (tarih) => {
    if (!tarih) return '';
    const diffMs = Date.now() - new Date(tarih).getTime();
    const diffMin = Math.max(0, Math.round(diffMs / 60000));
    return `${diffMin} dk`;
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
      console.log('📦 Siparişler çekiliyor...');
      
      const data = await kuryeAPI.getAktifSiparisler(personelId);
      
      console.log('📦 Gelen siparişler:', data);
      console.log('📦 Sipariş sayısı:', data?.length || 0);
      
      setActiveOrders((data || []).map(mapSiparisToOrder));
    } catch (err) {
      console.error('❌ Hata:', err);
      toast.error('❌ Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [personelId]);

  // ========== GEÇMİŞ SİPARİŞLERİ BACKEND'DEN ÇEK ==========
  const fetchHistoryOrders = useCallback(async () => {
    if (!personelId) return;
    try {
      const savedHistory = localStorage.getItem('historyOrders');
      if (savedHistory) {
        setHistoryOrders(JSON.parse(savedHistory));
      } else {
        setHistoryOrders([]);
      }
    } catch (err) {
      console.error('❌ Geçmiş siparişler yüklenirken hata:', err);
    }
  }, [personelId]);

  // ========== UYGULAMA AÇILDIĞINDA VERİLERİ YÜKLE ==========
  useEffect(() => {
    fetchActiveOrders();
    fetchHistoryOrders();
  }, [fetchActiveOrders, fetchHistoryOrders]);

  // ========== ÇIKIŞ ==========
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    toast.success('👋 Başarıyla çıkış yapıldı!');
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 500);
  };

  // ========== MÜŞTERİ ARA ==========
  const handleCallCustomer = (order) => {
    if (!order) return;
    
    if (order?.phone) {
      toast.info(`📞 ${order.phone} aranıyor...`);
    } else {
      const phone = prompt('📞 Müşteri telefon numarasını girin:');
      if (phone?.trim()) {
        toast.success(`📞 ${phone} aranıyor...`);
        const updatedOrders = activeOrders.map(o => 
          o.id === order.id ? { ...o, phone: phone } : o
        );
        setActiveOrders(updatedOrders);
      }
    }
  };

  // ========== TESLİMAT ONAYLA ==========
const handleDeliveryConfirm = async (order) => {
  if (!order) return;

  // 🔒 Kurye kimliği yoksa isteği hiç gönderme
  if (!personelId) {
    toast.error('Kurye kimliği bulunamadı, lütfen tekrar giriş yapın.');
    return;
  }

  const confirm = window.confirm(
    `📦 Sipariş #${order.id}\nMüşteri: ${order.customer}\nTutar: ₺${order.amount}\n\nTeslimatı onaylıyor musunuz?`
  );

  if (!confirm) {
    toast.info('Teslimat onayı iptal edildi.');
    return;
  }

  try {
    toast.info(`📦 Sipariş #${order.id} teslimat onaylanıyor...`);

    console.log('🔍 teslimEt çağrısı:', {
      siparisId: order.id,
      personelId,
      tip: typeof personelId,
    });

    await kuryeAPI.teslimEt(order.id, personelId);

    toast.success(`✅ Sipariş #${order.id} teslim edildi!`);

    // Aktif siparişlerden kaldır
    const updatedActive = activeOrders.filter((o) => o.id !== order.id);
    setActiveOrders(updatedActive);

    // Geçmişe ekle
    const deliveredOrder = {
      ...order,
      status: 'teslim_edildi',
      deliveredAt: new Date().toISOString(),
    };
    const updatedHistory = [deliveredOrder, ...historyOrders];
    setHistoryOrders(updatedHistory);

    // Geçmişi localStorage'a kaydet
    localStorage.setItem('historyOrders', JSON.stringify(updatedHistory));

    if (showOrderModal) setShowOrderModal(false);

    setTimeout(() => {
      toast.info(`📱 Müşteriye ${order.customer} teslimat bildirimi gönderildi!`);
    }, 1000);
  } catch (err) {
    console.error('❌ Teslimat hatası:', err);
    toast.error(`❌ Sipariş #${order.id} teslim edilirken bir hata oluştu.`);
  }
};

  // ========== SİPARİŞ DETAY MODALI ==========
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
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
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'Kurye Bekliyor' ? 'bg-orange-500/20 text-orange-400' :
                  order.status === 'Yolda' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'Hazır' ? 'bg-yellow-500/20 text-yellow-400' :
                  order.status === 'İptal' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleCallCustomer(order)} className="flex-1 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <FaPhone /> Müşteriyi Ara
              </button>
              <button onClick={() => handleDeliveryConfirm(order)} className="flex-1 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <FaCheckCircle /> Teslimat Onayla
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
          <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
            {activeOrders.length} aktif sipariş
          </span>
        </div>
        <p className="text-gray-400 mb-4">Bugün teslim edilecek siparişler:</p>
        
        <div className="space-y-3">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">🍽️</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">#{order.id}</span>
                      <span className="text-white">{order.customer}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{order.address}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-yellow-400 font-semibold text-sm">₺{order.amount}</span>
                      <span className="text-gray-500 text-xs">{order.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        order.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'Kurye Bekliyor' ? 'bg-orange-500/20 text-orange-400' :
                        order.status === 'Yolda' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'Hazır' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'İptal' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={(e) => { e.stopPropagation(); handleCallCustomer(order); }} className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm text-green-400 transition-all cursor-pointer z-10 relative">
                    <FaPhone />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeliveryConfirm(order); }} className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm text-yellow-400 transition-all cursor-pointer z-10 relative">
                    <FaCheckCircle />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowOrderModal(true); }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all cursor-pointer z-10 relative">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">🎉 Bugün teslim edilecek sipariş kalmadı!</div>
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
              <span className={`text-sm ${order.status === 'teslim_edildi' ? 'text-green-400' : 'text-red-400'}`}>
                {order.status === 'teslim_edildi' ? '✅ Tamamlandı' : '❌ İptal'}
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