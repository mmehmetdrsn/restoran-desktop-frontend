// src/pages/QrRedirect.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QrRedirect = () => {
  const { masaId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (masaId) {
      // ✅ Masa ID'yi localStorage'a kaydet
      localStorage.setItem('qrMasaId', masaId);
      
      // ✅ QR ile gelen kullanıcı için "misafir" girişi yap
      const misafirKullanici = {
        id: 0,
        name: `Masa ${masaId} Misafiri`,
        email: `masa${masaId}@qr.com`,
        role: 'user',
        isQrUser: true,
        masaId: masaId
      };
      
      localStorage.setItem('user', JSON.stringify(misafirKullanici));
      
      toast.success(`✅ Masa #${masaId} seçildi! Menüye yönlendiriliyorsunuz.`);
      
      // ✅ 1.5 saniye sonra menüye yönlendir (Login değil!)
      setTimeout(() => {
        navigate('/qr/menu');  // ✅ YENİ ROUTE!
      }, 1500);
    }
  }, [masaId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Masa #{masaId} Seçildi!
          </h1>
          <p className="text-gray-600 mb-4">
            Menüye yönlendiriliyorsunuz...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QrRedirect;