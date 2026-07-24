// src/Garson/modals/MasaDurumuModal.js
import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaLock, FaClock, FaPlus, FaExchangeAlt, FaCreditCard, FaTools, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tableService,orderService } from '../../api/api';


const MasaDurumuModal = ({
  showStatusModal,
  onClose,
  selectedTable,
  verileriYukle,
  onOpenOrderModal,
  onOpenMoveModal,
  onOpenPaymentModal
}) => {
  const [resSaat, setResSaat] = useState('19:00');
  const [showResInput, setShowResInput] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!showStatusModal || !selectedTable) return null;

  const isOccupied = selectedTable.status === 'occupied';
  const isEmpty = selectedTable.status === 'empty';
  const isReserved = selectedTable.status === 'reserved';
  const isBroken = selectedTable.status === 'broken';
  const isKullanimDisi = selectedTable.rawStatus === 'KULLANIM DIŞI';

  const handleStatusChange = async (yeniDurum, ekBilgi = '') => {
    if (busy) return;
    setBusy(true);
    try {
      await tableService.updateStatus(selectedTable.id, yeniDurum, ekBilgi);
      toast.success(`Masa durumu ${yeniDurum} olarak güncellendi.`);
      await verileriYukle();
      onClose();
    } catch (err) {
      console.error("Hata:", err);
      toast.error(err.response?.data?.Mesaj || "Güncellenemedi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">📊 Masa Durumu Yönetimi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Masa Özeti */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Seçili Masa:</p>
          <p className="text-white font-bold text-lg">{selectedTable.name}</p>
          <p className="text-gray-400 text-sm mt-1">
            Mevcut Durum: <span className="text-yellow-400 font-semibold uppercase">
              {isOccupied ? '🔴 DOLU' :
               isReserved ? '🟡 REZERVE' :
               isKullanimDisi ? '🚫 KULLANIM DIŞI' :
               isBroken ? '⚠️ ARIZALI' :
               '🟢 BOŞ'}
            </span>
          </p>
        </div>

        <div className="space-y-3">

          {/* 🔴 DOLU MASA */}
          {isOccupied && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3">
              <p className="text-red-400 text-xs flex items-center gap-2 font-medium">
                <FaLock /> Dolu masa doğrudan boşaltılamaz! Ödeme alınmalı veya arızalı işaretlenmelidir.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={busy}
                  onClick={() => { onClose(); onOpenPaymentModal?.(selectedTable); }}
                  className="py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaCreditCard /> Ödeme Al
                </button>
                   <button
                  disabled={busy}
                  onClick={() => { onClose(); onOpenMoveModal?.(selectedTable); }}
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaExchangeAlt /> Masa Taşı
                </button>
                <button
                  disabled={busy}
                  onClick={() => handleStatusChange("ARIZALI")}
                  className="py-2.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaTools /> Arızalı Yap
                </button>
              </div>
            </div>
          )}

          {/* 🟢 BOŞ MASA */}
          {isEmpty && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
              <p className="text-emerald-400 text-xs font-medium">
                Masayı dolu yapmak için sipariş ekleyebilir veya başka masadan taşıyabilirsiniz:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={busy}
                  onClick={() => { onClose(); onOpenOrderModal?.(selectedTable); }}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaPlus /> Sipariş Ekle
                </button>
             
              </div>
            </div>
          )}

          {/* 🟡 REZERVE MASA */}
          {isReserved && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl space-y-3">
              <p className="text-yellow-400 text-xs font-medium">
                Müşteri geldiyse siparişe geçebilir, gelmediyse rezervasyonu iptal edebilirsiniz.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={busy}
                  onClick={() => { onClose(); onOpenOrderModal?.(selectedTable); }}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaPlus /> Müşteri Geldi
                </button>
                <button
                  disabled={busy}
                  onClick={() => handleStatusChange("BOŞ")}
                  className="py-2.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FaBan /> Rezervasyonu İptal Et
                </button>
              </div>
            </div>
          )}

          {/* ⚠️ ARIZALI / 🚫 KULLANIM DIŞI MASA */}
          {isBroken && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-3">
              <p className="text-orange-400 text-xs font-medium">
                {isKullanimDisi
                  ? 'Bu masa kalıcı olarak kullanım dışı bırakılmış.'
                  : 'Bu masa arızalı olarak işaretli. Sorun giderildiyse tekrar kullanıma açabilirsiniz.'}
              </p>
              <button
                disabled={busy}
                onClick={() => handleStatusChange("BOŞ")}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaCheckCircle /> {isKullanimDisi ? 'Tekrar Aktif Et' : 'Onarıldı, Kullanıma Aç'}
              </button>
            </div>
          )}
{/* ⚠️ ARIZALI / 🚫 KULLANIM DIŞI MASA */}
{isBroken && (
  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-3">

    {selectedTable.order ? (
      <>
        <p className="text-red-400 text-xs flex items-center gap-2 font-medium">
          <FaLock /> Bu masada eski/ödenmemiş bir sipariş var (₺{selectedTable.order?.toplam ?? 0}).
          Onarıldı diyip açmadan önce bu siparişi çözmelisiniz.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={busy}
            onClick={() => { onClose(); onOpenPaymentModal?.(selectedTable); }}
            className="py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <FaCreditCard /> Ödeme Al
          </button>
          <button
            disabled={busy}
            onClick={async () => {
              if (busy) return;
              setBusy(true);
              try {
                await orderService.cancel(selectedTable.order.siparisId);
                toast.success('Eski sipariş iptal edildi, masa boşaltılıyor...');
                await handleStatusChange("BOŞ");
              } catch (err) {
                toast.error(err.response?.data?.Mesaj || 'Sipariş iptal edilemedi.');
                setBusy(false);
              }
            }}
            className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <FaBan /> Siparişi İptal Et
          </button>
        </div>
      </>
    ) : (
      <>
        <p className="text-orange-400 text-xs font-medium">
          {isKullanimDisi
            ? 'Bu masa kalıcı olarak kullanım dışı bırakılmış.'
            : 'Bu masa arızalı olarak işaretli. Sorun giderildiyse tekrar kullanıma açabilirsiniz.'}
        </p>
        <button
          disabled={busy}
          onClick={() => handleStatusChange("BOŞ")}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
<FaCheckCircle /> Yenilendi Kullanıma Aç      </button>
      </>
    )}
  </div>
)}
          {/* 🟡 REZERVE YAP (BOŞ masa için, opsiyonel) */}
          {isEmpty && (
            <div>
              {!showResInput ? (
                <button
                  disabled={busy}
                  onClick={() => setShowResInput(true)}
                  className="w-full py-3 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 text-yellow-400 rounded-xl transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaClock /> Rezerve Yap (Saat Gir)
                </button>
              ) : (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl space-y-2">
                  <label className="text-yellow-300 text-xs font-medium block">Rezervasyon Saati Seçin:</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={resSaat}
                      onChange={(e) => setResSaat(e.target.value)}
                      className="p-2 bg-black/60 border border-white/20 rounded-lg text-white text-sm outline-none flex-1"
                    />
                    <button
                      disabled={busy}
                      onClick={() => handleStatusChange("REZERVE", resSaat)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-xs transition disabled:opacity-50"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ⚠️ ARIZALI YAP (sadece BOŞ ve REZERVE masalar için genel seçenek) */}
          {(isEmpty || isReserved) && (
            <button
              disabled={busy}
              onClick={() => handleStatusChange("ARIZALI")}
              className="w-full py-3 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/50 text-orange-400 rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaTools /> Arızalı / Kullanım Dışı Yap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasaDurumuModal;