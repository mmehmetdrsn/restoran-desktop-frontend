import React from 'react';
import { FaUtensils, FaPlus, FaTrash, FaEdit, FaList } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const UrunButonlari = ({ 
  setShowUrunEkle, 
  setShowUrunSil, 
  setShowUrunDuzenle, 
  handleUrunListele
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUtensils />} title="Urun Yonetimi" />
      <p className="text-gray-400 text-sm mb-6">Urun islemlerinizi buradan yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlus />} label="Urun Ekle" onClick={() => setShowUrunEkle(true)} />
        <Buton icon={<FaTrash />} label="Urun Sil" onClick={() => setShowUrunSil(true)} />
        <Buton icon={<FaEdit />} label="Urun Duzenle" onClick={() => setShowUrunDuzenle(true)} />
        <Buton icon={<FaList />} label="Urun Listele" onClick={handleUrunListele} />
      </div>
    </div>
  );
};

export default UrunButonlari;