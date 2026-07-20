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
  passwordLoading
}) => {
  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">🔑 Şifre Değiştir</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
              placeholder="Mevcut şifreniz"
              disabled={passwordLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
              placeholder="Yeni şifreniz (min 6 karakter)"
              disabled={passwordLoading}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all"
              placeholder="Yeni şifrenizi tekrar girin"
              disabled={passwordLoading}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all text-sm"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex-1 px-4 py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
