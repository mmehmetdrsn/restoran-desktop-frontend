    // src/Admin/components/Uye/UyeEkle.js
    import React from 'react';
    import { FaUserPlus, FaTimes } from 'react-icons/fa';
    import { toast } from 'react-toastify';
    import { userService } from '../../../api/api';

    const UyeEkle = ({ acik, kapat, onSuccess, yeniUye, setYeniUye, loading, setLoading }) => {
    if (!acik) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!yeniUye.ad || !yeniUye.soyad || !yeniUye.email) {
        toast.warning('Lütfen tüm zorunlu alanları doldurun!');
        return;
        }
        
        setLoading(true);
        try {
    await userService.create({
    uyeAdi: yeniUye.ad.trim(),     
    uyeSoyadi: yeniUye.soyad.trim(), 
    uyeEmail: yeniUye.email.trim(),  
    uyeTelefon: yeniUye.telefon || null, 
    
    });
        toast.success('✅ Üye başarıyla eklendi!');
        setYeniUye({ ad: '', soyad: '', email: '', telefon: '', adres: '' });
        kapat();
        if (onSuccess) onSuccess();
        } catch (error) {
        console.error('Üye eklenirken hata:', error);
        toast.error('❌ Üye eklenirken hata oluştu!');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="text-2xl text-gray-400"><FaUserPlus /></div>
                <div>
                <h2 className="text-white font-bold text-lg">Yeni Üye Ekle</h2>
                <p className="text-gray-400 text-xs">Üye bilgilerini girin</p>
                </div>
            </div>
            <button onClick={kapat} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
            </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ad *</label>
                <input
                value={yeniUye.ad}
                onChange={(e) => setYeniUye({...yeniUye, ad: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Adını girin"
                required
                disabled={loading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Soyad *</label>
                <input
                value={yeniUye.soyad}
                onChange={(e) => setYeniUye({...yeniUye, soyad: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="Soyadını girin"
                required
                disabled={loading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                <input
                type="email"
                value={yeniUye.email}
                onChange={(e) => setYeniUye({...yeniUye, email: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="email@ornek.com"
                required
                disabled={loading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefon</label>
                <input
                value={yeniUye.telefon}
                onChange={(e) => setYeniUye({...yeniUye, telefon: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none"
                placeholder="05XX XXX XX XX"
                disabled={loading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Adres</label>
                <textarea
                value={yeniUye.adres}
                onChange={(e) => setYeniUye({...yeniUye, adres: e.target.value})}
                className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                placeholder="Adres bilgisi"
                rows="2"
                disabled={loading}
                />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={kapat} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg" disabled={loading}>
                İptal
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Ekleniyor...</> : 'Üye Ekle'}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default UyeEkle;