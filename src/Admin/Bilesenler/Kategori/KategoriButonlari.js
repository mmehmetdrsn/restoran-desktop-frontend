import React from 'react';
import { FaTags, FaPlusCircle, FaTrash, FaEdit, FaList } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const KategoriButonlari = ({ 
  setShowKategoriEkle, 
  setShowKategoriSil, 
  setShowKategoriDuzenle, 
  handleKategoriListele 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaTags />} title="Kategori Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Kategori işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlusCircle />} label="Kategori Ekle" onClick={() => setShowKategoriEkle(true)} />
        <Buton icon={<FaTrash />} label="Kategori Sil" onClick={() => setShowKategoriSil(true)} />
        <Buton icon={<FaEdit />} label="Kategori Düzenle" onClick={() => setShowKategoriDuzenle(true)} />
        <Buton icon={<FaList />} label="Kategori Listele" onClick={handleKategoriListele} />
      </div>
    </div>
  );
};

export default KategoriButonlari;