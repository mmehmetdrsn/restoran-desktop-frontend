import React from 'react';
import { FaChartLine, FaPizzaSlice, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const RaporButonlari = ({ 
  fetchGunlukSatis, 
  fetchUrunSatis, 
  fetchRezervasyonRaporu, 
  fetchGelirIstatistikleri 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaChartBar />} title="Raporlar ve Istatistikler" />
      <p className="text-gray-400 text-sm mb-6">Isletmenizin tum rapor ve istatistiklerine buradan ulasin.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton 
          icon={<FaChartLine />} 
          label="Gunluk Satis Raporlari" 
          onClick={fetchGunlukSatis} 
        />
        <Buton 
          icon={<FaPizzaSlice />} 
          label="Urun Satis Raporu" 
          onClick={fetchUrunSatis} 
        />
        <Buton 
          icon={<FaCalendarCheck />} 
          label="Rezervasyon Raporu" 
          onClick={fetchRezervasyonRaporu} 
        />
        <Buton 
          icon={<FaMoneyBillWave />} 
          label="Gelir Istatistikleri" 
          onClick={fetchGelirIstatistikleri} 
        />
      </div>
    </div>
  );
};

export default RaporButonlari;