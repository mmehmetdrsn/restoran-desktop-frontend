import { FaTimes } from 'react-icons/fa';

const SifreModal = ({
  showPasswordModal,
  onClose,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  handlePasswordChange,
  passwordLoading,
  isDayMode = false
}) => {
  if (!showPasswordModal) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDayMode ? 'bg-slate-900/35 backdrop-blur-[2px]' : 'bg-black/70 backdrop-blur-sm'}`}>
      <div className={`${isDayMode ? 'bg-white border-slate-200 text-slate-900 shadow-[0_22px_60px_rgba(15,23,42,0.16)]' : 'bg-black/95 border-white/10 text-white'} backdrop-blur-sm rounded-2xl border shadow-2xl max-w-md w-full p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>🔑 Şifre Değiştir</h2>
          <button onClick={onClose} className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`}
              placeholder="Mevcut şifreniz"
              disabled={passwordLoading}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`}
              placeholder="Yeni şifreniz (min 6 karakter)"
              disabled={passwordLoading}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'} mb-1.5`}>Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all ${isDayMode ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300' : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent'}`}
              placeholder="Yeni şifrenizi tekrar girin"
              disabled={passwordLoading}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm ${isDayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-900 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-200 text-black'}`}
            >
              {passwordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Değiştiriliyor...
                </>
              ) : (
                'Şifreyi Değiştir'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SifreModal;
