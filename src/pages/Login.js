// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  // Mock kullanıcı veritabanı (API entegrasyonu için hazır)
  const users = {
    'admin@restoran.com': { password: 'admin123', role: 'admin', name: 'Admin Kullanıcı' },
    'garson@restoran.com': { password: 'garson123', role: 'garson', name: 'Garson Kullanıcı' },
    'asci@restoran.com': { password: 'asci123', role: 'asci', name: 'Aşçı Kullanıcı' },
    'kurye@restoran.com': { password: 'kurye123', role: 'kurye', name: 'Kurye Kullanıcı' }
  };

  // Giriş yapmış kullanıcıyı kontrol et
  useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        // Kullanıcı zaten giriş yapmışsa doğru panele yönlendir
        redirectUser(parsedUser.role);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const redirectUser = (role) => {
    const routes = {
      'admin': '/admin',
      'garson': '/garson',
      'asci': '/asci',
      'kurye': '/kurye'
    };
    navigate(routes[role] || '/');
  };

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

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      toast.error('Geçerli bir e-posta adresi girin!');
      setLoading(false);
      return;
    }

    try {
      // 🔄 API çağrısı - Backend bağlandığında aktif edin
      // const response = await axios.post('http://localhost:5000/api/auth/login', {
      //   email,
      //   password
      // });
      // const { token, user } = response.data;

      // 🧪 Mock API çağrısı (şimdilik)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Kullanıcı kontrolü
      const user = users[email];
      
      if (!user || user.password !== password) {
        throw new Error('E-posta veya şifre hatalı!');
      }

      // Kullanıcı bilgilerini hazırla
      const userData = {
        email: email,
        role: user.role,
        name: user.name,
        // token: token, // API'den gelen token
        loginTime: new Date().toISOString()
      };

      // Remember me kontrolü
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Başarılı giriş mesajı
      toast.success(`Hoş geldiniz, ${user.name}! 🎉`);

      // Yönlendirme
      redirectUser(user.role);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Giriş başarısız. Lütfen tekrar deneyin.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Demo hesap doldurma
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.info(`${demoEmail} demo hesabı dolduruldu`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-4">
      <div className="w-full max-w-md">
        {/* Ana Kart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
          
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-4">
              <span className="text-5xl">🍽️</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Restoran Yönetim</h2>
            <p className="mt-2 text-gold/80">Hesabınıza giriş yapın</p>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-6 flex items-start gap-2 animate-fade-in">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg 
                           text-white placeholder:text-white/30 focus:ring-2 focus:ring-gold 
                           focus:border-transparent outline-none transition-all duration-300"
                  placeholder="ornek@restoran.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg 
                           text-white placeholder:text-white/30 focus:ring-2 focus:ring-gold 
                           focus:border-transparent outline-none transition-all duration-300"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 
                           text-gold focus:ring-gold focus:ring-offset-0 
                           cursor-pointer"
                />
                Beni hatırla
              </label>
              <button
                type="button"
                className="text-sm text-gold/70 hover:text-gold transition-colors"
                onClick={() => toast.info('Şifre sıfırlama bağlantısı gönderildi!')}
              >
                Şifremi unuttum?
              </button>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold hover:bg-gold/80 text-primary font-semibold 
                       rounded-lg transition-all duration-300 transform hover:scale-[1.02] 
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Demo Hesaplar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-white/50 mb-3">
              🔑 Demo hesapları deneyin
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(users).map(([email, user]) => (
                <button
                  key={email}
                  onClick={() => fillDemoAccount(email, user.password)}
                  className="text-xs bg-white/5 hover:bg-white/10 text-white/70 
                           hover:text-white p-2 rounded-lg transition-all duration-300
                           border border-white/10 hover:border-gold/30"
                >
                  <span className="block font-medium capitalize">{user.role}</span>
                  <span className="text-[10px] text-white/40">{email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alt Bilgi */}
          <p className="mt-6 text-center text-xs text-white/30">
            © 2024 Restoran Yönetim Sistemi v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;