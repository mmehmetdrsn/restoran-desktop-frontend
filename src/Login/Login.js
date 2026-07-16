// src/pages/Login/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login } from '../api/api'; // Dosya src/pages/Login/ içindeyse: '../../api/api'

const backgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

// DB'deki RolAdi -> frontend route eşlemesi
// SOL taraf Roller tablosundaki RolAdi ile, SAĞ taraf App.js'teki route ile BİREBİR aynı olmalı!
const rolYonlendirme = {
  'Yönetici': '/admin',
  'Garson': '/garson',
  'Aşçı': '/asci',
  'Kurye': '/kurye',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const navigate = useNavigate();

  // ============ GİRİŞ YAP ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasyon
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      toast.warning('Lütfen tüm alanları doldurun!');
      setLoading(false);
      return;
    }

    try {
      // GERÇEK API ÇAĞRISI: POST /api/Auth/login
      // Backend yanıtı: { token, refreshToken, personelId, adSoyad, rol }
      const data = await login(email, password);

      // Token'lar HER ZAMAN localStorage'a (api.js request() oradan okuyor)
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      const userData = {
        personelId: data.personelId,
        name: data.adSoyad,
        role: data.rol,
        loginTime: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      toast.success(`Hoş geldiniz, ${data.adSoyad}! 🎉`);

      // Role göre yönlendir (rol adı DB'deki RolAdi ile birebir eşleşmeli)
      navigate(rolYonlendirme[data.rol] ?? '/');

    } catch (err) {
      const errorMessage = err.message || 'Giriş başarısız. Lütfen tekrar deneyin.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ ŞİFRE SIFIRLAMA ============
  // NOT: Backend'de şifre sıfırlama endpoint'i henüz yok
  const handleResetPassword = (e) => {
    e.preventDefault();
    toast.info('Şifre sıfırlama özelliği yakında eklenecek. Lütfen yöneticinizle iletişime geçin.');
    setIsResetMode(false);
    setResetEmail('');
  };

  // Şifre Sıfırlama Ekranı
  if (isResetMode) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setIsResetMode(false)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
            >
              <FaArrowLeft size={16} />
              <span className="text-sm">Giriş ekranına dön</span>
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Şifre Sıfırlama</h2>
              <p className="mt-2 text-sm text-gray-500">
                Kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını göndereceğiz.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-posta
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                             text-gray-800 placeholder:text-gray-400 focus:ring-2 
                             focus:ring-gray-800 focus:border-transparent outline-none"
                    placeholder="ad@restoran.com"
                    disabled={resetLoading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-semibold 
                         rounded-lg transition-all duration-300 disabled:opacity-70 
                         disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resetLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  'Bağlantı Gönder'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Ana Giriş Ekranı
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl"></div>
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Sol Taraf */}
          <div 
            className="p-8 lg:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[600px] relative"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative z-10">
              <div className="text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <h1 className="text-white font-bold text-4xl tracking-wider">RESTORAN</h1>
                <p className="text-white/80 text-sm tracking-wider mt-1">OTOMASYON SİSTEMİ</p>
                
                <div className="w-20 h-1 bg-white/30 mx-auto my-6"></div>
                
                <p className="text-white text-xl font-light leading-relaxed max-w-sm mx-auto">
                  Restoranınızı tek ekrandan yönetin.
                </p>
                <p className="text-white/70 text-sm font-light max-w-sm mx-auto mt-2">
                  Sipariş, masa, mutfak ve kasa operasyonlarınızı kesintisiz yürütün.
                </p>
              </div>
            </div>

            <div className="relative z-10"></div>
          </div>

          {/* Sağ Taraf - Giriş Formu */}
          <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 tracking-wide">HOŞ GELDİNİZ</h2>
              <p className="text-sm text-gray-500 mt-1">Giriş Yapın</p>
              <p className="text-xs text-gray-400 mt-2 mb-6">Yönetim panelinize erişmek için bilgilerinizi girin.</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-posta
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                               text-gray-800 placeholder:text-gray-400 focus:ring-2 
                               focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                      placeholder="ad@restoran.com"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Şifre
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg 
                               text-gray-800 placeholder:text-gray-400 focus:ring-2 
                               focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                      placeholder="********"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 
                               focus:ring-gray-800 cursor-pointer"
                    />
                    Beni hatırla
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-gray-800 hover:text-black transition-colors font-medium"
                  >
                    Şifremi unuttum
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white font-semibold 
                           rounded-lg transition-all duration-300 disabled:opacity-70 
                           disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    'Giriş Yap ›'
                  )}
                </button>
              </form>

              {/* Demo Hesaplar - Backend ile de çalışır */}
              <div className="mt-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">veya</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <p className="text-xs text-gray-500 mb-3 font-medium tracking-wider">DEMO HESAPLAR</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setEmail('admin@restoran.com');
                      setPassword('admin123');
                      toast.info('Admin demo hesabı dolduruldu');
                    }}
                    className="flex items-center justify-between p-2.5 border border-gray-200 
                             hover:border-gray-600 rounded-lg transition-all duration-300
                             hover:bg-gray-50 group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Yönetici
                      </span>
                      <span className="text-[10px] text-gray-400">admin yetkisi</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-700">
                      admin@restoran.com
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setEmail('garson@restoran.com');
                      setPassword('garson123');
                      toast.info('Garson demo hesabı dolduruldu');
                    }}
                    className="flex items-center justify-between p-2.5 border border-gray-200 
                             hover:border-gray-600 rounded-lg transition-all duration-300
                             hover:bg-gray-50 group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Garson
                      </span>
                      <span className="text-[10px] text-gray-400">garson yetkisi</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-700">
                      garson@restoran.com
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEmail('asci@restoran.com');
                      setPassword('asci123');
                      toast.info('Aşçı demo hesabı dolduruldu');
                    }}
                    className="flex items-center justify-between p-2.5 border border-gray-200 
                             hover:border-gray-600 rounded-lg transition-all duration-300
                             hover:bg-gray-50 group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Aşçı
                      </span>
                      <span className="text-[10px] text-gray-400">aşçı yetkisi</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-700">
                      asci@restoran.com
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEmail('kurye@restoran.com');
                      setPassword('kurye123');
                      toast.info('Kurye demo hesabı dolduruldu');
                    }}
                    className="flex items-center justify-between p-2.5 border border-gray-200 
                             hover:border-gray-600 rounded-lg transition-all duration-300
                             hover:bg-gray-50 group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Kurye
                      </span>
                      <span className="text-[10px] text-gray-400">kurye yetkisi</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-700">
                      kurye@restoran.com
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;