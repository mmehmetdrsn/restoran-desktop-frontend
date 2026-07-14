// src/pages/KuryePanel.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaTruck, FaClock, FaCheckCircle, 
  FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaBox,
  FaHome, FaBell, FaEnvelope,
  FaUserCircle, FaSearch, 
  FaStar, FaCreditCard, FaHistory, FaRoute,
  FaInfoCircle, FaUser, FaArrowRight,
  FaChartBar, 
  FaEye, FaTimes, FaCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Arka plan resmi
const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const KuryePanel = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);

  // Kullanıcı bilgilerini al
  let userData = null;
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  
  if (sessionUser) {
    userData = JSON.parse(sessionUser);
  } else if (localUser) {
    userData = JSON.parse(localUser);
  }

  // Aktif Siparişler
  const [activeOrders, setActiveOrders] = useState([
    { 
      id: 3051, 
      customer: 'Ayşe Yılmaz', 
      address: 'Atatürk Mah. No:12', 
      amount: 340, 
      status: 'hazir', 
      time: '5 dk',
      phone: '+90 555 123 4567'
    },
    { 
      id: 3052, 
      customer: 'Burak Demir', 
      address: 'Barbaros Mah. No:8', 
      amount: 520, 
      status: 'kurye_bekliyor', 
      time: '8 dk',
      phone: '+90 555 234 5678'
    },
    { 
      id: 3053, 
      customer: 'Ceren Öztürk', 
      address: 'Yeni Mah. No:45', 
      amount: 280, 
      status: 'yolda', 
      time: '12 dk',
      phone: '+90 555 345 6789'
    },
    { 
      id: 3054, 
      customer: 'Mehmet Kaya', 
      address: 'Eski Mah. No:78', 
      amount: 450, 
      status: 'teslim', 
      time: '3 dk',
      phone: '+90 555 456 7890'
    }
  ]);

  // ============ ÇIKIŞ YAP - DÜZELTİLDİ ============
  const handleLogout = () => {
    // 1. Tüm storage'ları temizle
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // 2. Toast mesajı göster
    toast.success('👋 Başarıyla çıkış yapıldı!');
    
    // 3. 1 saniye bekle ve yönlendir
    setTimeout(() => {
      navigate('/');
      // Sayfayı tamamen yenile (state'leri sıfırlamak için)
      window.location.reload();
    }, 500);
  };

  // ============ SİPARİŞ İŞLEMLERİ ============
  const handleCallCustomer = (order) => {
    if (order.phone) {
      toast.info(`📞 ${order.phone} numarası aranıyor...`);
    } else {
      toast.warning('⚠️ Bu sipariş için telefon numarası bulunamadı!');
      const phone = prompt('📞 Müşteri telefon numarasını girin:');
      if (phone?.trim()) {
        toast.success(`📞 ${phone} aranıyor...`);
      }
    }
  };

  const handleDeliveryConfirm = (order) => {
    toast.info(`📦 Sipariş #${order.id} teslimat onaylanıyor...`);
    
    const confirm = window.confirm(
      `📦 Sipariş #${order.id}\nMüşteri: ${order.customer}\nTutar: ₺${order.amount}\n\nTeslimatı onaylıyor musunuz?`
    );
    
    if (confirm) {
      toast.success(`✅ Sipariş #${order.id} teslim edildi!`);
      setActiveOrders(activeOrders.filter(o => o.id !== order.id));
      
      setTimeout(() => {
        toast.info(`📱 Müşteriye ${order.customer} teslimat bildirimi gönderildi!`);
      }, 1000);
      
      setTimeout(() => {
        const paymentMethod = window.confirm(
          `💳 Ödeme yöntemi seçin:\n\nTamam - Kredi Kartı\nİptal - Nakit`
        );
        if (paymentMethod) {
          toast.success('💳 Kredi kartı ile ödeme alındı!');
        } else {
          toast.success('💰 Nakit ödeme alındı!');
        }
      }, 1500);
      
    } else {
      toast.info('Teslimat onayı iptal edildi.');
    }
  };

  // ============ FLOW MODAL COMPONENT ============
  const FlowModal = ({ onClose }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const steps = [
      { id: 'basla', label: 'Sipariş Hazır (Mutfak)', options: ['Devam'] },
      { id: 'bildirim', label: 'Kurye Bildirim Gönder', options: ['Tüm Kuryelere Gönder'] },
      { id: 'kurye_kontrol', label: 'Açıkta Kurye Var mı?', options: ['Evet', 'Hayır'] },
      { id: 'en_yakin', label: 'Sipariş En Yakın Kuryeye Ver', options: ['Onayla'] },
      { id: 'musteri_bilgi', label: 'Müşteriye Bilgilendirme Gönder', options: ['Gönder'] },
      { id: 'bekleme', label: 'Bekleme Süresi Açıldı mı?', options: ['Evet', 'Hayır'] },
      { id: 'kurye_kabul', label: 'Kurye Kabul Etti mi?', options: ['Evet', 'Hayır'] },
      { id: 'odeme', label: 'Müşteri Ödeme Yaptı mı?', options: ['Evet', 'Hayır'] },
      { id: 'teslim_al', label: 'Kurye Paketi Teslim Alır', options: ['Teslim Al'] },
      { id: 'yola_cik', label: 'Kurye Müşteri Adresine Gider', options: ['Yola Çık'] },
      { id: 'teslim', label: 'Teslimat Başarılı mı?', options: ['Evet', 'Hayır'] },
      { id: 'tamam', label: 'Sipariş Tamamlandı', options: ['Tamamla'] }
    ];

    const handleStepAction = (option) => {
      const currentStep = steps[currentStepIndex];
      
      if (currentStep.id === 'kurye_kontrol' && option === 'Hayır') {
        toast.error('❌ Kurye bulunamadı! İptal ediliyor...');
        onClose();
        return;
      }

      if (currentStep.id === 'kurye_kabul' && option === 'Hayır') {
        toast.error('❌ Kurye kabul etmedi! İptal ediliyor...');
        onClose();
        return;
      }

      if (currentStep.id === 'teslim' && option === 'Hayır') {
        const note = prompt('📝 Teslimat notu girin:');
        toast.warning(`⚠️ Teslimat sorunu: ${note || 'Belirtilmedi'}`);
        onClose();
        return;
      }

      toast.success(`✅ ${currentStep.label} - ${option}`);

      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        toast.success('🎉 Sipariş akışı tamamlandı!');
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-black/90 rounded-2xl border border-white/10 max-w-md w-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-bold">🔄 Sipariş Akışı</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{steps[currentStepIndex]?.icon || '📋'}</span>
              <div>
                <p className="text-white font-semibold">{steps[currentStepIndex]?.label}</p>
                <p className="text-gray-400 text-sm">Adım {currentStepIndex + 1}/{steps.length}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {steps[currentStepIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleStepAction(option)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    option === 'Evet' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                    option === 'Hayır' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>İlerleme: {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ ORDER DETAIL MODAL ============
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-black/90 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl font-bold">📋 Sipariş #{order.id}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Müşteri</p>
                <p className="text-white font-medium">{order.customer}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Tutar</p>
                <p className="text-yellow-400 font-bold">₺{order.amount}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Adres</p>
                <p className="text-gray-300 text-sm">{order.address}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Durum</p>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'tamamlandi' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'iptal' ? 'bg-red-500/20 text-red-400' :
                  order.status === 'yolda' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status === 'tamamlandi' ? '✅ Tamamlandı' :
                   order.status === 'iptal' ? '❌ İptal Edildi' :
                   order.status === 'yolda' ? '🚀 Yolda' :
                   '📍 Bekliyor'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => handleCallCustomer(order)}
                className="flex-1 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <FaPhone />
                Müşteriyi Ara
              </button>
              <button 
                onClick={() => handleDeliveryConfirm(order)}
                className="flex-1 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <FaCheckCircle />
                Teslimat Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ DASHBOARD COMPONENT ============
  const Dashboard = () => (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Bekleyen Sipariş</p>
              <p className="text-white text-2xl font-bold mt-1">{activeOrders.length}</p>
            </div>
            <div className="text-2xl text-yellow-500">
              <FaClock />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Aktif Kurye</p>
              <p className="text-white text-2xl font-bold mt-1">3</p>
            </div>
            <div className="text-2xl text-green-500">
              <FaUser />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Bugün Teslim</p>
              <p className="text-white text-2xl font-bold mt-1">12</p>
            </div>
            <div className="text-2xl text-blue-400">
              <FaCheckCircle />
            </div>
          </div>
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">İptal Edilen</p>
              <p className="text-white text-2xl font-bold mt-1">2</p>
            </div>
            <div className="text-2xl text-red-400">
              <FaTimes />
            </div>
          </div>
        </div>

        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Başarı Oranı</p>
              <p className="text-white text-2xl font-bold mt-1">86%</p>
            </div>
            <div className="text-2xl text-purple-400">
              <FaStar />
            </div>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="text-white font-bold">Yeni Sipariş Akışı</h3>
              <p className="text-gray-400 text-sm">Siparişi adım adım yönetin</p>
            </div>
          </div>
          <button 
            onClick={() => setShowFlowModal(true)}
            className="w-full py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FaArrowRight />
            Sipariş Akışını Başlat
          </button>
        </div>

        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="text-white font-bold">Hızlı Kurye İşlemleri</h3>
              <p className="text-gray-400 text-sm">Tek tıkla işlemler</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all">
              Bildirim Gönder
            </button>
            <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all">
              Kurye Bul
            </button>
            <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all">
              Rota Görüntüle
            </button>
            <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all">
              Müşteri Ara
            </button>
          </div>
        </div>
      </div>

      {/* Aktif Siparişler */}
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FaTruck className="text-yellow-400" />
            Aktif Siparişler
          </h3>
          <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
            {activeOrders.length} sipariş
          </span>
        </div>
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'hazir' ? 'bg-green-500/20' :
                  order.status === 'yolda' ? 'bg-blue-500/20' :
                  order.status === 'teslim' ? 'bg-yellow-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <span className={`
                    ${order.status === 'hazir' ? 'text-green-400' :
                      order.status === 'yolda' ? 'text-blue-400' :
                      order.status === 'teslim' ? 'text-yellow-400' :
                      'text-orange-400'}
                  `}>
                    {order.status === 'hazir' && '🍳'}
                    {order.status === 'kurye_bekliyor' && '⏳'}
                    {order.status === 'yolda' && '🚀'}
                    {order.status === 'teslim' && '📦'}
                  </span>
                </div>
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
                      order.status === 'hazir' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'kurye_bekliyor' ? 'bg-orange-500/20 text-orange-400' :
                      order.status === 'yolda' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status === 'hazir' ? '✅ Hazır' :
                       order.status === 'kurye_bekliyor' ? '⏳ Kurye Bekliyor' :
                       order.status === 'yolda' ? '🚀 Yolda' :
                       '📦 Teslim Ediliyor'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Butonlar */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCallCustomer(order)}
                  className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm text-green-400 transition-all flex items-center gap-1"
                >
                  <FaPhone className="text-xs" />
                  Ara
                </button>
                <button 
                  onClick={() => handleDeliveryConfirm(order)}
                  className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm text-yellow-400 transition-all flex items-center gap-1"
                >
                  <FaCheckCircle className="text-xs" />
                  Onayla
                </button>
                <button 
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all"
                >
                  <FaEye className="inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modallar */}
      {showFlowModal && <FlowModal onClose={() => setShowFlowModal(false)} />}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );

  // ============ RENDER ============
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
      
      <div className="relative z-10">
        {/* Üst Navbar */}
        <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-2xl">🛵</div>
                <div>
                  <h1 className="text-white font-bold text-base">SekerRestoran</h1>
                  <p className="text-gray-400 text-[10px]">{userData?.email || 'kurye@restoran.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center px-4">
                <button
                  onClick={() => setSelectedMenu('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedMenu === 'dashboard' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaHome />
                  Ana Sayfa
                </button>
                <button
                  onClick={() => setSelectedMenu('deliveries')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedMenu === 'deliveries' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaTruck />
                  Teslimatlar
                </button>
                <button
                  onClick={() => setSelectedMenu('history')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedMenu === 'history' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaHistory />
                  Geçmiş
                </button>
                <button
                  onClick={() => setSelectedMenu('reports')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedMenu === 'reports' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaChartBar />
                  Raporlar
                </button>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <FaBell size={16} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
                  <FaEnvelope size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 
                           text-white rounded-lg transition-all duration-300 text-sm"
                >
                  <FaSignOutAlt size={14} />
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Dashboard />
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
          </div>
        </div>
      </div>
    </div>
  );
};

export default KuryePanel;