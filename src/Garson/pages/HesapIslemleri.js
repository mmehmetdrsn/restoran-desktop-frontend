<<<<<<< HEAD
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../api/api';

const HesapIslemleri = ({ occupiedTables, onPaymentSuccess, isDayMode }) => {
  const [loading, setLoading] = useState(false);

  // ========== ÖDEME İŞLEMİ ==========
  const handlePayment = async (masaId, odemeTipi) => {
    if (loading) return;

    // ✅ Önce masayı bul ve sipariş kontrolü yap
    const table = occupiedTables.find(t => t.id === masaId);
    if (!table) {
      toast.error('Masa bulunamadı!');
      return;
    }

    if (!table.order || table.order.total === 0) {
      toast.warning('⚠️ Bu masada ödenecek sipariş bulunmuyor!');
      return;
    }

    let personelId = 1;
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        personelId = user.PersonelId || user.personelId || user.id || 1;
      }
    } catch (e) {
      console.error('Kullanıcı bilgisi alınamadı:', e);
    }

    const odemeTipiBackend = odemeTipi === 'Nakit' ? 'NAKIT' : 'KREDI KARTI';

    setLoading(true);
    try {
      console.log(`💰 Masa #${masaId} için ${odemeTipiBackend} ödeme alınıyor...`);
      console.log(`📦 Sipariş ID: ${table.order.id}, Tutar: ${table.order.total}`);

      const response = await paymentService.masaOdeme({
        masaId: masaId,
        odemeTipi: odemeTipiBackend,
        personelId: personelId,
        kasaId: 1
      });

      console.log('✅ Ödeme cevabı:', response);

      if (response?.status === 200) {
        toast.success(`✅ ${response.data?.mesaj || 'Ödeme başarıyla alındı!'}`);
        
        if (onPaymentSuccess) {
          onPaymentSuccess(masaId);
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Ödeme hatası:', error);
      
      let errorMsg = 'Ödeme alınamadı!';
      if (error.response?.data?.mesaj) {
        errorMsg = error.response.data.mesaj;
      } else if (error.response?.data?.Mesaj) {
        errorMsg = error.response.data.Mesaj;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
          Dolu Masalar
        </p>
        {loading && (
          <span className="text-yellow-400 text-sm animate-pulse">
            ⏳ İşlem yapılıyor...
          </span>
        )}
      </div>

      {occupiedTables.length === 0 && (
        <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
          Ödeme alınacak masa yok
        </p>
      )}

      <div className="grid grid-cols-1 gap-3">
        {occupiedTables.map(table => (
          <div 
            key={table.id} 
            className={`
              ${isDayMode ? 'bg-slate-100 border border-slate-200/50 text-slate-900' : 'bg-white/5 border border-white/10 text-white'} 
              p-3 rounded-lg flex items-center justify-between
              ${loading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div>
              <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-medium`}>
                {table.name}
                {!table.order && (
                  <span className="text-xs text-yellow-400 ml-2">(Sipariş yok)</span>
                )}
              </p>
              <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'} text-sm`}>
                Toplam: ₺{table.order?.total || 0}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePayment(table.id, 'Nakit')}
                disabled={loading || !table.order || table.order.total === 0}
                className={`
                  py-2 px-3 rounded text-sm font-medium transition-all
                  ${isDayMode 
                    ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }
                  ${(loading || !table.order || table.order.total === 0) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                  }
                `}
              >
                Nakit
              </button>
              <button 
                onClick={() => handlePayment(table.id, 'Kart')}
                disabled={loading || !table.order || table.order.total === 0}
                className={`
                  py-2 px-3 rounded text-sm font-medium transition-all
                  ${isDayMode 
                    ? 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30' 
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }
                  ${(loading || !table.order || table.order.total === 0) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                  }
                `}
              >
                Kart
              </button>
            </div>
          </div>
        ))}
=======
// src/Garson/pages/HesapIslemleri.js
import React from 'react';

const HesapIslemleri = ({ occupiedTables, processPayment, isDayMode, selectedTable }) => {
  // Eğer özel olarak tek bir masa gönderilmişse sadece onu göster, yoksa dolu masaları listele
  const tablesToDisplay = selectedTable 
    ? [selectedTable] 
    : occupiedTables;

  return (
    <div className="space-y-4">
      <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold`}>
        {selectedTable ? `Ödeme Al: ${selectedTable.name}` : 'Ödeme Alınacak Masalar'}
      </p>
      
      {tablesToDisplay.length === 0 && (
        <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
          Ödeme alınacak masa bulunmuyor.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {tablesToDisplay.map(table => {
          const total = table.order?.toplam ?? table.order?.total ?? table.order?.tutar ?? 0;
          return (
            <div 
              key={table.id} 
              className={`${isDayMode ? 'bg-slate-100 border border-slate-200/50 text-slate-900' : 'bg-white/5 border border-white/10 text-white'} p-4 rounded-xl flex items-center justify-between gap-4`}
            >
              <div>
                <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-base`}>
                  {table.name}
                </p>
                <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-300'} text-sm mt-0.5`}>
                  Toplam Tutar: <span className="font-bold text-emerald-400">₺{Number(total).toFixed(2)}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => processPayment(table.id, 'Nakit')} 
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💵 Nakit
                </button>
                <button 
                  onClick={() => processPayment(table.id, 'Kart')} 
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💳 Kart
                </button>
              </div>
            </div>
          );
        })}
>>>>>>> 9c3ec6798f35772834ff05f9d3f509748daad53b
      </div>
    </div>
  );
};

export default HesapIslemleri;