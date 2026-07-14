// src/pages/AdminPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
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

  const [istatistikler, setIstatistikler] = useState({
    toplamSiparis: 0,
    toplamCiro: 0,
    aktifPersonel: 0,
    toplamMusteri: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Örnek istatistik verileri
    setIstatistikler({
      toplamSiparis: 156,
      toplamCiro: 12450,
      aktifPersonel: 12,
      toplamMusteri: 89
    });
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gold">👑 Admin Paneli</h1>
              <p className="text-white/70 mt-1">Hoş geldiniz, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              🚪 Çıkış Yap
            </button>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="text-white/50 text-sm">Toplam Sipariş</h3>
                  <p className="text-2xl font-bold text-white">{istatistikler.toplamSiparis}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <h3 className="text-white/50 text-sm">Toplam Ciro</h3>
                  <p className="text-2xl font-bold text-gold">₺{istatistikler.toplamCiro}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-white/50 text-sm">Aktif Personel</h3>
                  <p className="text-2xl font-bold text-white">{istatistikler.aktifPersonel}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="text-white/50 text-sm">Toplam Müşteri</h3>
                  <p className="text-2xl font-bold text-white">{istatistikler.toplamMusteri}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Erişim Menüsü */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer">
              <div className="text-center">
                <span className="text-3xl">📋</span>
                <h3 className="text-white font-semibold mt-2">Sipariş Yönetimi</h3>
                <p className="text-white/50 text-sm mt-1">Tüm siparişleri görüntüle</p>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer">
              <div className="text-center">
                <span className="text-3xl">👥</span>
                <h3 className="text-white font-semibold mt-2">Personel Yönetimi</h3>
                <p className="text-white/50 text-sm mt-1">Personel ekle/düzenle</p>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer">
              <div className="text-center">
                <span className="text-3xl">📊</span>
                <h3 className="text-white font-semibold mt-2">Raporlar</h3>
                <p className="text-white/50 text-sm mt-1">Günlük/haftalık raporlar</p>
              </div>
            </div>
          </div>

          {/* Son Siparişler */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">📋 Son Siparişler</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <span className="text-white font-medium">Sipariş #1</span>
                  <span className="text-white/50 text-sm ml-3">Masa 3</span>
                </div>
                <span className="text-gold font-bold">₺120</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <span className="text-white font-medium">Sipariş #2</span>
                  <span className="text-white/50 text-sm ml-3">Masa 5</span>
                </div>
                <span className="text-gold font-bold">₺85</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <span className="text-white font-medium">Sipariş #3</span>
                  <span className="text-white/50 text-sm ml-3">Masa 2</span>
                </div>
                <span className="text-gold font-bold">₺45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;