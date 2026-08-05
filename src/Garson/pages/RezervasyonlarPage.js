import { FaUser, FaPhone, FaUsers, FaClock, FaStickyNote, FaCheck, FaTimes } from "react-icons/fa";

const DURUM_ETIKET = {
  BEKLEMEDE: { text: "Beklemede", color: "bg-orange-100 text-orange-700" },
  ONAYLANDI: { text: "Onaylandı", color: "bg-green-100 text-green-700" },
  IPTAL: { text: "İptal", color: "bg-gray-200 text-gray-600" },
  REDDEDILDI: { text: "Reddedildi", color: "bg-red-100 text-red-700" },
  TAMAMLANDI: { text: "Tamamlandı", color: "bg-blue-100 text-blue-700" },
};

const formatTarihSaat = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const gun = date.toLocaleDateString("tr-TR");
  const saat = date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${gun} • ${saat}`;
};

// En son OLUŞTURULAN rezervasyon en üstte görünsün.
// OlusturulmaTarihi yoksa/aynıysa rezervasyonId'ye göre (büyük id = daha yeni) sıralanır.
const sonOlusturulanaGoreSirala = (liste) => {
  return [...(liste || [])].sort((a, b) => {
    const aTarih = a.olusturulmaTarihi ? new Date(a.olusturulmaTarihi).getTime() : NaN;
    const bTarih = b.olusturulmaTarihi ? new Date(b.olusturulmaTarihi).getTime() : NaN;

    if (!Number.isNaN(aTarih) && !Number.isNaN(bTarih) && aTarih !== bTarih) {
      return bTarih - aTarih;
    }

    return (b.rezervasyonId || 0) - (a.rezervasyonId || 0);
  });
};

const RezervasyonlarPage = ({
  reservations,
  tables,
  reservationTableChoice,
  setReservationTableChoice,
  reservationActionId,
  onAssignTable,
  onReject,
  isDayMode,
}) => {
  const bosMasalar = (tables || []).filter((t) => t.status === "empty");

  const bekleyenler = sonOlusturulanaGoreSirala(
    (reservations || []).filter((r) => r.durum === "BEKLEMEDE"),
  );
  const digerleri = sonOlusturulanaGoreSirala(
    (reservations || []).filter((r) => r.durum !== "BEKLEMEDE"),
  );

  const cardBase = `rounded-2xl border p-4 ${
    isDayMode
      ? "bg-white border-slate-200"
      : "bg-black/40 border-white/10 text-white"
  }`;

  const renderReservation = (r, showAssign) => {
    const durumBilgi = DURUM_ETIKET[r.durum] || {
      text: r.durum || "Bilinmiyor",
      color: "bg-gray-100 text-gray-600",
    };
    const isBusy = reservationActionId === r.rezervasyonId;

    return (
      <div key={r.rezervasyonId} className={cardBase}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-base">
              {r.musteriAdi} {r.musteriSoyadi}
            </p>
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm ${
                isDayMode ? "text-slate-600" : "text-gray-300"
              }`}
            >
              <span className="flex items-center gap-1">
                <FaPhone size={12} /> {r.telefon || "-"}
              </span>
              <span className="flex items-center gap-1">
                <FaUsers size={12} /> {r.kisiSayisi} kişi
              </span>
              <span className="flex items-center gap-1">
                <FaClock size={12} /> {formatTarihSaat(r.tarihSaat)}
              </span>
            </div>
            {r.aciklama && (
              <p
                className={`flex items-center gap-1 mt-2 text-sm ${
                  isDayMode ? "text-slate-500" : "text-gray-400"
                }`}
              >
                <FaStickyNote size={12} /> {r.aciklama}
              </p>
            )}
            {r.masaNo && (
              <p className="mt-2 text-sm font-medium text-emerald-600">
                Masa: {r.masaNo}
              </p>
            )}
          </div>
          <span
            className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${durumBilgi.color}`}
          >
            {durumBilgi.text}
          </span>
        </div>

        {showAssign && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <select
              value={reservationTableChoice[r.rezervasyonId] || ""}
              onChange={(e) =>
                setReservationTableChoice((prev) => ({
                  ...prev,
                  [r.rezervasyonId]: e.target.value,
                }))
              }
              disabled={isBusy}
              className={`text-sm rounded-lg px-3 py-2 border ${
                isDayMode
                  ? "bg-white border-slate-300 text-slate-900"
                  : "bg-black/40 border-white/20 text-white"
              }`}
            >
              <option value="">Masa seç...</option>
              {bosMasalar.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.capacity} kişilik)
                </option>
              ))}
            </select>

            <button
              onClick={() => onAssignTable(r.rezervasyonId)}
              disabled={isBusy}
              className="flex items-center gap-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <FaCheck size={12} /> Masa Ata
            </button>

            <button
              onClick={() => onReject(r.rezervasyonId)}
              disabled={isBusy}
              className="flex items-center gap-1.5 text-sm font-medium bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 px-3 py-2 rounded-lg transition-colors"
            >
              <FaTimes size={12} /> Reddet
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2
          className={`flex items-center gap-2 font-bold text-lg mb-3 ${
            isDayMode ? "text-slate-900" : "text-white"
          }`}
        >
          <FaUser /> Bekleyen Talepler ({bekleyenler.length})
        </h2>

        {bekleyenler.length === 0 ? (
          <div
            className={`rounded-2xl border p-6 text-sm text-center ${
              isDayMode
                ? "bg-white border-slate-200 text-slate-500"
                : "bg-black/30 border-white/10 text-gray-400"
            }`}
          >
            Şu an bekleyen rezervasyon talebi yok.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bekleyenler.map((r) => renderReservation(r, true))}
          </div>
        )}
      </div>

      {digerleri.length > 0 && (
        <div>
          <h2
            className={`font-bold text-lg mb-3 ${
              isDayMode ? "text-slate-900" : "text-white"
            }`}
          >
            Diğer Rezervasyonlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digerleri.map((r) => renderReservation(r, false))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RezervasyonlarPage;