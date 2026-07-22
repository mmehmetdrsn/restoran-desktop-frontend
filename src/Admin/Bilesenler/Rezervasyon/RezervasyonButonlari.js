import React from 'react';
import { FaCalendarCheck, FaPlus, FaTrash, FaEdit, FaList } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const RezervasyonButonlari = ({ 
  setShowRezervasyonEkle, 
  setShowRezervasyonSil, 
  setShowRezervasyonDuzenle, 
  handleRezervasyonListele 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaCalendarCheck />} title="Rezervasyon Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Rezervasyon işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlus />} label="Rezervasyon Ekle" onClick={() => setShowRezervasyonEkle(true)} />
        <Buton icon={<FaTrash />} label="Rezervasyon Sil" onClick={() => setShowRezervasyonSil(true)} />
        <Buton icon={<FaEdit />} label="Rezervasyon Düzenle" onClick={() => setShowRezervasyonDuzenle(true)} />
        <Buton icon={<FaList />} label="Rezervasyon Listele" onClick={handleRezervasyonListele} />
      </div>
    </div>
  );
};

export default RezervasyonButonlari;