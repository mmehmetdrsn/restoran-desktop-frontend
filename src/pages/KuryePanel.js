// src/pages/KuryePanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KuryePanel = () => {
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

  const [teslimatlar, setTeslimatlar] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'kurye') {
      navigate('/');
      return;
    }
    
    // Örnek teslimat verileri
    setTeslimatlar([
      { id: 1, adres: 'Cafer Ağa Mah. No:15', musteri: 'Ahmet Y.', durum: 'Teslim Edilecek', tutar: 120 },
      { id: 2, adres: 'Kazım Paşa Mah. No:8', musteri: 'Mehmet D.', durum: 'Teslim Edilecek', tutar: 85 },
      { id: 3, adres: 'Sümbül Sok. No:22', musteri: 'Ayşe K.', durum: 'Teslim Edildi', tutar: 45 },
    ]);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const teslimatGuncelle = (id, durum) => {
    setTeslimatlar(teslimatlar.map(t => 
      t.id === id ? { ...t, durum: durum } : t
    ));
  };

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gold">🛵 Kurye Paneli</h1>
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
              <h3 className="text-gold font-semibold">📦 Teslim Edilecek</h3>
              <p className="text-2xl font-bold text-white mt-2">{teslimatlar.filter(t => t.durum === 'Teslim Edilecek').length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-gold font-semibold">✅ Teslim Edilen</h3>
              <p className="text-2xl font-bold text-white mt-2">{teslimatlar.filter(t => t.durum === 'Teslim Edildi').length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-gold font-semibold">📊 Toplam</h3>
              <p className="text-2xl font-bold text-white mt-2">{teslimatlar.length}</p>
            </div>
          </div>

          {/* Teslimat Listesi */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">📋 Teslimatlar</h2>
            {teslimatlar.length === 0 ? (
              <p className="text-white/50 text-center py-8">Henüz teslimat yok</p>
            ) : (
              <div className="grid gap-4">
                {teslimatlar.map((teslimat) => (
                  <div key={teslimat.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">Teslimat #{teslimat.id}</div>
                      <div className="text-white/50 text-sm">{teslimat.adres}</div>
                      <div className="text-white/70 text-sm mt-1">👤 {teslimat.musteri}</div>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          teslimat.durum === 'Teslim Edilecek' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {teslimat.durum}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-gold font-bold">₺{teslimat.tutar}</div>
                      {teslimat.durum === 'Teslim Edilecek' && (
                        <button
                          onClick={() => teslimatGuncelle(teslimat.id, 'Teslim Edildi')}
                          className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                        >
                          Teslim Edildi ✅
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KuryePanel;