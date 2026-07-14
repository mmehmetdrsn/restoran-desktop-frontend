// src/pages/AsciPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AsciPanel = () => {
  const navigate = useNavigate();
  
  // Kullanıcı bilgisini al
  let user = null;
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  
  if (sessionUser) {
    user = JSON.parse(sessionUser);
  } else if (localUser) {
    user = JSON.parse(localUser);
  }

  const [siparisler, setSiparisler] = useState([]);
  const [malzemeler, setMalzemeler] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'asci') {
      navigate('/');
      return;
    }
    
    // Örnek sipariş verileri
    setSiparisler([
      { id: 1, masaNo: 3, urunler: ['Pizza', 'Kola'], durum: 'Hazırlanıyor', tutar: 120 },
      { id: 2, masaNo: 5, urunler: ['Burger', 'Patates'], durum: 'Hazır', tutar: 85 },
    ]);
    
    // Örnek malzeme verileri
    setMalzemeler([
      { id: 1, ad: 'Un', miktar: 50, birim: 'kg', kritik: 10 },
      { id: 2, ad: 'Peynir', miktar: 30, birim: 'kg', kritik: 5 },
      { id: 3, ad: 'Domates', miktar: 40, birim: 'kg', kritik: 10 },
      { id: 4, ad: 'Patates', miktar: 20, birim: 'kg', kritik: 5 },
    ]);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const siparisDurumuGuncelle = (id, durum) => {
    setSiparisler(siparisler.map(s => 
      s.id === id ? { ...s, durum: durum } : s
    ));
  };

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gold">👨‍🍳 Aşçı Paneli</h1>
              <p className="text-white/70 mt-1">Hoş geldiniz, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              🚪 Çıkış Yap
            </button>
          </div>
          
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-gold font-semibold">📦 Gelen Siparişler</h3>
              <p className="text-2xl font-bold text-white mt-2">{siparisler.filter(s => s.durum === 'Hazırlanıyor').length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-gold font-semibold">✅ Hazırlanan</h3>
              <p className="text-2xl font-bold text-white mt-2">{siparisler.filter(s => s.durum === 'Hazır').length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-gold font-semibold">📊 Toplam Sipariş</h3>
              <p className="text-2xl font-bold text-white mt-2">{siparisler.length}</p>
            </div>
          </div>

          {/* Sipariş Listesi */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">📋 Siparişler</h2>
            {siparisler.length === 0 ? (
              <p className="text-white/50 text-center py-8">Henüz sipariş yok</p>
            ) : (
              <div className="grid gap-4">
                {siparisler.map((siparis) => (
                  <div key={siparis.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">Sipariş #{siparis.id}</div>
                      <div className="text-white/50 text-sm">Masa {siparis.masaNo}</div>
                      <div className="text-white/70 text-sm mt-1">
                        {siparis.urunler.join(', ')}
                      </div>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          siparis.durum === 'Hazırlanıyor' ? 'bg-yellow-500/20 text-yellow-400' :
                          siparis.durum === 'Hazır' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {siparis.durum}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-gold font-bold">₺{siparis.tutar}</div>
                      {siparis.durum === 'Hazırlanıyor' && (
                        <button
                          onClick={() => siparisDurumuGuncelle(siparis.id, 'Hazır')}
                          className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                        >
                          Hazırlandı ✅
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Malzeme Durumu */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">📦 Malzeme Durumu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {malzemeler.map((malzeme) => (
                <div key={malzeme.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="text-white font-medium">{malzeme.ad}</div>
                  <div className={`text-sm mt-1 ${
                    malzeme.miktar <= malzeme.kritik ? 'text-red-400' : 'text-white/70'
                  }`}>
                    {malzeme.miktar} {malzeme.birim}
                    {malzeme.miktar <= malzeme.kritik && ' ⚠️ Kritik'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsciPanel;