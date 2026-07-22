import React from 'react';
import { FaMoneyBillWave, FaHistory, FaCheckDouble, FaUndo, FaExchangeAlt } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const FinansButonlari = ({ 
  handleOdemeListele, 
  setShowGunSonu, 
  setShowIade, 
  handleKasaHareketleri 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaMoneyBillWave />} title="Finans ve Kasa Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Kasa hareketleri ve finansal işlemler.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaHistory />} label="Ödeme Geçmişi" onClick={handleOdemeListele} />
        <Buton icon={<FaCheckDouble />} label="Gün Sonu İşlemleri" onClick={() => setShowGunSonu(true)} />
        <Buton icon={<FaUndo />} label="Ödeme İade İşlemleri" onClick={() => setShowIade(true)} />
        <Buton icon={<FaExchangeAlt />} label="Kasa Hareketleri" onClick={handleKasaHareketleri} />
      </div>
    </div>
  );
};

export default FinansButonlari;