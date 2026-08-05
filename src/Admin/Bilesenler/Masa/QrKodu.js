// src/Admin/Bilesenler/Masa/QrKodu.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaCopy, FaPrint, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { tableService } from '../../../api/api';

const QrKodu = ({ acik, kapat }) => {
  const [masalar, setMasalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (acik) {
      verileriYukle();
      const hostname = window.location.hostname;
      const port = window.location.port;
      setBaseUrl(`${window.location.protocol}//${hostname}:${port}`);
    }
  }, [acik]);

  if (!acik) return null;

  const verileriYukle = async () => {
    try {
      setLoading(true);
      const response = await tableService.getAll();
      setMasalar(response.data || []);
    } catch (error) {
      toast.error('Masalar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const generateQRContent = (masa) => {
    return `${baseUrl}/qr/masa/${masa.masaId}`;
  };

  const downloadQR = (masa) => {
    const canvas = document.getElementById(`qr-${masa.masaId}`);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `masa-${masa.masaNo}-qr.png`;
      link.href = url;
      link.click();
      toast.success('✅ QR kod indirildi!');
    }
  };

  const printQR = (masa) => {
    const qrContent = generateQRContent(masa);
    const printWindow = window.open('', '_blank', 'width=400,height=500');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Masa ${masa.masaNo} QR Kod</title>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                flex-direction: column; 
                font-family: Arial, sans-serif;
                margin: 0;
                background: white;
              }
              .qr-container {
                text-align: center;
                padding: 20px;
              }
              h2 { 
                color: #2E7D32; 
                margin-bottom: 10px;
              }
              .qr-code {
                margin: 20px 0;
              }
              .qr-text {
                font-size: 12px;
                color: #666;
                word-break: break-all;
                max-width: 300px;
              }
              .footer {
                margin-top: 20px;
                font-size: 11px;
                color: #999;
                border-top: 1px solid #eee;
                padding-top: 10px;
              }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>🍽️ Masa ${masa.masaNo}</h2>
              <p style="color:#666;font-size:14px;">QR kodu okutarak menüye erişin</p>
              <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}" />
              </div>
              <p class="qr-text">${qrContent}</p>
              <div class="footer">
                ${new Date().toLocaleDateString('tr-TR')} • Şeker Restoran
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const copyQRContent = (masa) => {
    const content = generateQRContent(masa);
    navigator.clipboard.writeText(content);
    toast.success('✅ QR içeriği kopyalandı!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-slate-900 font-bold text-lg">📱 QR Kod Yönetimi</h2>
            <p className="text-slate-500 text-xs">Masalara ait QR kodlarını oluşturun ve yazdırın</p>
          </div>
          <button onClick={kapat} className="text-slate-400 hover:text-slate-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="bg-blue-50 border-b border-blue-100 p-3 text-sm text-blue-700 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          <span>
            QR kodları <strong>telefonla okutarak</strong> müşteriler doğrudan masaya yönlendirilir.
            <br />
            <span className="text-xs text-blue-500">
              Base URL: <span className="font-mono">{baseUrl}</span>
            </span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              <FaSpinner className="animate-spin mx-auto text-2xl mb-2" />
              Yükleniyor...
            </div>
          ) : masalar.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Henüz masa eklenmemiş
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {masalar.map((masa) => {
                const qrContent = generateQRContent(masa);
                return (
                  <div key={masa.masaId} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-slate-900 font-bold text-lg">Masa {masa.masaNo}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${masa.masaDurumu === 'BOŞ' ? 'bg-green-100 text-green-700' :
                          masa.masaDurumu === 'DOLU' ? 'bg-red-100 text-red-700' :
                          masa.masaDurumu === 'REZERVE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {masa.masaDurumu || 'Bilinmiyor'}
                      </span>
                    </div>

                    <div className="flex justify-center mb-3 bg-white rounded-xl p-3 border border-slate-200">
                      <QRCodeSVG
                        id={`qr-${masa.masaId}`}
                        value={qrContent}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#1a1a1a"
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 bg-slate-100 rounded-lg p-2">
                      <span className="truncate flex-1 font-mono">{qrContent}</span>
                      <button
                        onClick={() => copyQRContent(masa)}
                        className="p-1 hover:bg-slate-200 rounded transition"
                        title="Kopyala"
                      >
                        <FaCopy size={14} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadQR(masa)}
                        className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <FaDownload size={14} /> İndir
                      </button>
                      <button
                        onClick={() => printQR(masa)}
                        className="flex-1 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                      >
                        🖨️ Yazdır
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center bg-slate-50">
          <span className="text-slate-500 text-xs">Toplam {masalar.length} masa QR kodu</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                masalar.forEach(m => printQR(m));
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm transition-all"
            >
              🖨️ Tümünü Yazdır
            </button>
            <button onClick={kapat} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-all">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrKodu;