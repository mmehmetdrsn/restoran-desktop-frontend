// src/Garson/pages/HesapIslemleri.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../api/api';

const HesapIslemleri = ({ 
  occupiedTables = [], 
  processPayment, 
  isDayMode, 
  selectedTable, 
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);

  // Eğer modal veya sayfadan tek bir masa seçilerek geldiyse sadece onu göster, yoksa tüm dolu masaları listele
  const tablesToDisplay = selectedTable ? [selectedTable] : occupiedTables;

  // Ödeme handler'ı: GarsonPanel'den processPayment gelmişse onu kullanır, gelmemişse doğrudan API'ye istek atar
  const handlePayment = async (tableId, method) => {
    if (loading) return;

    if (processPayment) {
      processPayment(tableId, method);
      return;
    }

    const table = tablesToDisplay.find(t => t.id === tableId);
    if (!table) {
      toast.error('Masa bulunamadı!');
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

    const odemeTipiBackend = method === 'Nakit' ? 'NAKIT' : 'KREDI KARTI';

    setLoading(true);
    try {
      const response = await paymentService.masaOdeme({
        masaId: tableId,
        odemeTipi: odemeTipiBackend,
        personelId: personelId,
        kasaId: 1
      });

      if (response?.status === 200 || response?.data) {
        toast.success(`✅ Ödeme başarıyla alındı!`);
        if (onPaymentSuccess) {
          onPaymentSuccess(tableId);
        }
      }
    } catch (error) {
      console.error('❌ Ödeme hatası:', error);
      const errorMsg = error.response?.data?.mesaj || error.response?.data?.Mesaj || error.message || 'Ödeme alınamadı!';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-semibold text-lg`}>
          {selectedTable ? `Ödeme Al: ${selectedTable.name}` : 'Ödeme Alınacak Masalar'}
        </p>
        {loading && (
          <span className="text-yellow-400 text-sm animate-pulse">
            ⏳ İşlem yapılıyor...
          </span>
        )}
      </div>

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
              className={`
                ${isDayMode ? 'bg-slate-100 border border-slate-200/50 text-slate-900' : 'bg-white/5 border border-white/10 text-white'} 
                p-4 rounded-xl flex items-center justify-between gap-4
                ${loading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <div>
                <p className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-base`}>
                  {table.name}
                  {!table.order && (
                    <span className="text-xs text-yellow-400 ml-2 font-normal">(Sipariş yok)</span>
                  )}
                </p>
                <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-300'} text-sm mt-0.5`}>
                  Toplam Tutar: <span className="font-bold text-emerald-400">₺{Number(total).toFixed(2)}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handlePayment(table.id, 'Nakit')} 
                  disabled={loading}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💵 Nakit
                </button>
                <button 
                  onClick={() => handlePayment(table.id, 'Kart')} 
                  disabled={loading}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition shadow-md"
                >
                  💳 Kart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HesapIslemleri;