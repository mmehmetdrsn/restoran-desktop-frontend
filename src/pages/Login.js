// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Yönlendirme için

  // Mock kullanıcı veritabanı (şimdilik)
  const users = {
    'admin@restoran.com': { password: 'admin123', role: 'admin' },
    'garson@restoran.com': { password: 'garson123', role: 'garson' },
    'asci@restoran.com': { password: 'asci123', role: 'asci' },
    'kurye@restoran.com': { password: 'kurye123', role: 'kurye' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasyon
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }

    try {
      // API çağrısını simüle et
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Kullanıcı kontrolü
      const user = users[email];
      
      if (!user || user.password !== password) {
        throw new Error('Geçersiz e-posta veya şifre');
      }

      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify({
        email: email,
        role: user.role
      }));

      // Role göre yönlendirme
      switch(user.role) {
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
          navigate('/');
      }

    } catch (err) {
      setError(err.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        {/* Başlık */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">🍽️ Restoran</h2>
          <p className="mt-2 text-gray-600">Hesabınıza giriş yapın</p>
        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="ornek@restoran.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Giriş yapılıyor...
              </span>
            ) : 'Giriş Yap'}
          </button>
        </form>

        {/* Demo bilgisi */}
        <div className="border-t pt-4">
          <p className="text-center text-sm text-gray-500 mb-2">Demo hesaplar:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Admin:</span><br/>
              admin@restoran.com<br/>
              admin123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Garson:</span><br/>
              garson@restoran.com<br/>
              garson123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Aşçı:</span><br/>
              asci@restoran.com<br/>
              asci123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Kurye:</span><br/>
              kurye@restoran.com<br/>
              kurye123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;