// src/Login/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaUtensils, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [beniHatirla, setBeniHatirla] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!kullaniciAdi || !sifre) {
      toast.warning('Lütfen kullanıcı adı ve şifrenizi girin!');
      return;
    }

    setLoading(true);
    try {
      // 🔥 BACKEND'İN BEKLEDİĞİ FORMAT (LoginDto)
      const loginData = {
        KullaniciAdi: kullaniciAdi,
        Sifre: sifre
      };
      
      console.log('📤 Login isteği gönderiliyor:', loginData);
      
      const response = await authService.login(loginData);
      console.log('📥 Backend yanıtı:', response);

      // Backend'den gelen veriyi kontrol et
      // apiRequest() cevabı { data: {...}, status } şeklinde sarıyor,
      // bu yüzden gerçek backend verisi response.data içinde.
      const data = response.data;

      if (data?.success === true) {
        // Token'ı kaydet
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Refresh Token'ı kaydet
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        // ============ ROL BELİRLEME ============
        let userRole = data.rol || data.Rol || data.role || '';
        userRole = userRole.toLowerCase().trim();

        console.log('🔍 Backend\'den gelen ham rol:', userRole);

        // 🔥 ROL EŞLEME (Tüm roller için kapsamlı)
        const roleMapping = {
          // Admin ve yönetici varyasyonları
          'admin': 'admin',
          'administrator': 'admin',
          'administratör': 'admin',
          'yönetici': 'admin',
          'yonetici': 'admin',
          'superadmin': 'admin',
          'super admin': 'admin',
          'root': 'admin',
          'manager': 'admin',
          'sahibi': 'admin',
          'sahip': 'admin',
          'işletme sahibi': 'admin',
          'isletme sahibi': 'admin',

          // Garson varyasyonları
          'garson': 'garson',
          'garsons': 'garson',
          'waiter': 'garson',
          'waiters': 'garson',
          'servis': 'garson',
          'servis elemanı': 'garson',
          'servis elemani': 'garson',
          'komi': 'garson',

          // Aşçı varyasyonları
          'aşçı': 'asci',
          'asci': 'asci',
          'asçı': 'asci',
          'ascı': 'asci',
          'cook': 'asci',
          'chef': 'asci',
          'mutfak': 'asci',
          'şef': 'asci',
          'sef': 'asci',
          'mutfak şefi': 'asci',
          'mutfak sefi': 'asci',

          // Kurye varyasyonları
          'kurye': 'kurye',
          'kuryes': 'kurye',
          'courier': 'kurye',
          'delivery': 'kurye',
          'motokurye': 'kurye',
          'moto kurye': 'kurye',
          'kargo': 'kurye',
          'teslimat': 'kurye',

          // Diğer roller
          'müşteri': 'user',
          'musteri': 'user',
          'customer': 'user',
          'user': 'user',
          'kullanıcı': 'user',
          'kullanici': 'user'
        };

        const validRoles = ['admin', 'garson', 'asci', 'kurye'];

        // Eğer rol mapping'de varsa onu kullan
        if (roleMapping[userRole] && validRoles.includes(roleMapping[userRole])) {
          userRole = roleMapping[userRole];
          console.log('✅ Mapping ile rol bulundu:', userRole);
        } else {
          // ============ FALLBACK: Kullanıcı adına göre rol ata ============
          console.log('⚠️ Rol mapping bulunamadı, kullanıcı adına göre atanacak.');
          
          const kullaniciAdiLower = kullaniciAdi.toLowerCase().trim();
          
          if (kullaniciAdiLower.includes('admin') || 
              kullaniciAdiLower.includes('yonetici') || 
              kullaniciAdiLower.includes('yönetici') ||
              kullaniciAdiLower.includes('manager')) {
            userRole = 'admin';
          } else if (kullaniciAdiLower.includes('garson') || 
                     kullaniciAdiLower.includes('waiter') ||
                     kullaniciAdiLower.includes('servis') ||
                     kullaniciAdiLower.includes('komi')) {
            userRole = 'garson';
          } else if (kullaniciAdiLower.includes('asci') || 
                     kullaniciAdiLower.includes('aşçı') ||
                     kullaniciAdiLower.includes('asçı') ||
                     kullaniciAdiLower.includes('cook') ||
                     kullaniciAdiLower.includes('chef') ||
                     kullaniciAdiLower.includes('mutfak') ||
                     kullaniciAdiLower.includes('şef')) {
            userRole = 'asci';
          } else if (kullaniciAdiLower.includes('kurye') || 
                     kullaniciAdiLower.includes('courier') ||
                     kullaniciAdiLower.includes('delivery') ||
                     kullaniciAdiLower.includes('motokurye') ||
                     kullaniciAdiLower.includes('kargo') ||
                     kullaniciAdiLower.includes('teslimat')) {
            userRole = 'kurye';
          } else {
            userRole = 'user';
          }
          console.log('✅ Fallback ile rol atandı:', userRole);
        }

        console.log('✅ Sonuç - Kullanıcı rolü:', userRole);

        // Kullanıcı bilgilerini kaydet
        const user = {
          id: data.personelId || data.PersonelId || data.id || 0,
          name: data.adSoyad || data.AdSoyad || data.name || kullaniciAdi,
          email: data.email || kullaniciAdi,
          role: userRole,
          personelId: data.personelId || data.PersonelId || data.id || 0
        };

        localStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('user', JSON.stringify(user));

        toast.success(`✅ Hoş geldiniz, ${user.name}!`);

        console.log('✅ Yönlendiriliyor... Rol:', user.role);
        console.log('✅ Kullanıcı bilgileri:', user);

        // ============ YÖNLENDİRME ============
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'garson':
            navigate('/garson');
            break;
          case 'asci':
            navigate('/asci');
            break;
          case 'kurye':
            navigate('/kurye');
            break;
          default:
            toast.warning('⚠️ Bilinmeyen rol, ana sayfaya yönlendiriliyorsunuz.');
            navigate('/');
        }
      } else {
        // success false ise
        toast.error(`❌ ${data?.message || response.error || 'Giriş başarısız!'}`);
      }
    } catch (error) {
      console.error('❌ Login hatası:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
                            error.response.data?.title ||
                            'Giriş başarısız!';
        toast.error(`❌ ${errorMessage}`);
      } else if (error.request) {
        toast.error('❌ Sunucuya bağlanılamıyor! Backend çalışıyor mu?');
      } else {
        toast.error('❌ Giriş başarısız!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
      }}
    >
      {/* Sayfa arka planı - blurlu ve karartılmış */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* SOL PANEL - Görsel */}
        <div
          className="relative flex md:w-1/2 min-h-[220px] md:min-h-0 flex-col justify-between p-10 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 text-center mt-10">
            <FaUtensils className="text-white text-4xl mx-auto mb-4" />
            <h1 className="text-white text-3xl font-bold tracking-wide">RESTORAN</h1>
            <p className="text-gray-300 text-xs tracking-[0.2em] mt-1">OTOMASYON SİSTEMİ</p>
          </div>

          <div className="relative z-10 text-center mb-6">
            <p className="text-white text-lg font-medium">Restoranınızı tek ekrandan yönetin.</p>
            <p className="text-gray-300 text-sm mt-1">
              Sipariş, masa, mutfak ve kasa operasyonlarınızı kesintisiz yürütün.
            </p>
          </div>
        </div>

        {/* SAĞ PANEL - Form */}
        <div className="relative z-10 w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900">HOŞ GELDİNİZ</h2>
          <p className="text-gray-500 mt-1">Giriş Yapın</p>
          <p className="text-gray-400 text-sm mt-1 mb-8">
            Yönetim panelinize erişmek için bilgilerinizi girin.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={kullaniciAdi}
                  onChange={(e) => setKullaniciAdi(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-800/20 focus:border-gray-800 outline-none transition-all"
                  placeholder="kullanıcı adınız"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Şifre
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-800/20 focus:border-gray-800 outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={beniHatirla}
                  onChange={(e) => setBeniHatirla(e.target.checked)}
                  className="rounded border-gray-300 text-gray-800 focus:ring-gray-800/30"
                />
                Beni hatırla
              </label>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Şifremi unuttum
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;