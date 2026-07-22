import React from 'react';
import { FaUtensils, FaPlus, FaTrash, FaEdit, FaList, FaPlusCircle } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const UrunButonlari = ({ 
  setShowUrunEkle, 
  setShowUrunSil, 
  setShowUrunDuzenle, 
  handleUrunListele,
  setShowKategoriEkle,
  setShowKategoriSil,
  setShowKategoriDuzenle,
  handleKategoriListele
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaUtensils />} title="Ürün ve Menü Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Ürün ve menü işlemlerinizi buradan yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlus />} label="Ürün Ekle" onClick={() => setShowUrunEkle(true)} />
        <Buton icon={<FaTrash />} label="Ürün Sil" onClick={() => setShowUrunSil(true)} />
        <Buton icon={<FaEdit />} label="Ürün Düzenle" onClick={() => setShowUrunDuzenle(true)} />
        <Buton icon={<FaList />} label="Ürün Listele" onClick={handleUrunListele} />
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs mb-3">Kategori İşlemleri</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Buton icon={<FaPlusCircle />} label="Kategori Ekle" onClick={() => setShowKategoriEkle(true)} />
          <Buton icon={<FaTrash />} label="Kategori Sil" onClick={() => setShowKategoriSil(true)} />
          <Buton icon={<FaEdit />} label="Kategori Düzenle" onClick={() => setShowKategoriDuzenle(true)} />
          <Buton icon={<FaList />} label="Kategori Listele" onClick={handleKategoriListele} />
        </div>
      </div>
    </div>
  );
};

export default UrunButonlari;