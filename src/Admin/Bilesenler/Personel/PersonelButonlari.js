import React from 'react';
import { FaUserCog, FaUserPlus, FaUserEdit, FaUserMinus, FaList, FaShieldAlt, FaUmbrella } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const PersonelButonlari = ({ 
  setShowPersonelEkle, 
  setShowPersonelDuzenle, 
  setShowPersonelSil, 
  handlePersonelListele,
  setShowPersonelIzin
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUserCog />} title="Personel Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel işlemleri ve yetki yönetimi.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Buton icon={<FaUserPlus />} label="Personel Ekle" onClick={() => setShowPersonelEkle(true)} />
        <Buton icon={<FaUserEdit />} label="Personel Düzenle" onClick={() => setShowPersonelDuzenle(true)} />
        <Buton icon={<FaUserMinus />} label="Personel Sil" onClick={() => setShowPersonelSil(true)} />
        <Buton icon={<FaList />} label="Personel Listele" onClick={handlePersonelListele} />
        <Buton icon={<FaUmbrella />} label="İzin Yönetimi" onClick={() => setShowPersonelIzin(true)} />
      </div>
    </div>
  );
};

export default PersonelButonlari;