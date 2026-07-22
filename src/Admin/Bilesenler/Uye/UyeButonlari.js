import React from 'react';
import { FaUsers, FaUserPlus, FaUserMinus, FaUserEdit, FaList, FaEye } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const UyeButonlari = ({ 
  setShowUyeEkle, 
  setShowUyeSil, 
  setShowUyeDuzenle, 
  handleUyeListele,
  setShowUyeDetay
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUsers />} title="Üye Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Personel ve müşteri üye işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Buton icon={<FaUserPlus />} label="Üye Ekle" onClick={() => setShowUyeEkle(true)} />
        <Buton icon={<FaUserMinus />} label="Üye Sil" onClick={() => setShowUyeSil(true)} />
        <Buton icon={<FaUserEdit />} label="Üye Düzenle" onClick={() => setShowUyeDuzenle(true)} />
        <Buton icon={<FaList />} label="Üye Listele" onClick={handleUyeListele} />
        <Buton icon={<FaEye />} label="Üye Detay" onClick={() => setShowUyeDetay(true)} />
      </div>
    </div>
  );
};

export default UyeButonlari;