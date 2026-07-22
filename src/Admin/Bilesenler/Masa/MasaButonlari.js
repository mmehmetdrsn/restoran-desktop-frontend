import React from 'react';
import { FaTable, FaPlus, FaTrash, FaEdit, FaChair } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const MasaButonlari = ({ 
  tables,
  setShowMasaEkle, 
  setShowMasaSil, 
  setShowMasaDuzenle 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaTable />} title="Masa Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Masa işlemlerini yönetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaPlus />} label="Masa Ekle" onClick={() => setShowMasaEkle(true)} />
        <Buton icon={<FaTrash />} label="Masa Sil" onClick={() => setShowMasaSil(true)} />
        <Buton icon={<FaEdit />} label="Masa Düzenle" onClick={() => setShowMasaDuzenle(true)} />
        <Buton icon={<FaChair />} label="Masa Planı" onClick={() => toast.info(`🪑 ${tables.length} masa bulunuyor`)} />
      </div>
    </div>
  );
};

export default MasaButonlari;