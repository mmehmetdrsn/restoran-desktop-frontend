import React from 'react';
import { FaBoxes, FaWarehouse, FaPlusCircle, FaMinusCircle, FaHistory, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const StokButonlari = ({ 
  handleStokDurumu, 
  setShowMalzemeGiris, 
  setShowMalzemeCikis, 
  setShowStokHareket 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaBoxes />} title="Depo / Stok Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Stok seviyeleri ve malzeme işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton icon={<FaWarehouse />} label="Güncel Stok Durumları" onClick={handleStokDurumu} />
        <Buton icon={<FaPlusCircle />} label="Malzeme Giriş" onClick={() => setShowMalzemeGiris(true)} />
        <Buton icon={<FaMinusCircle />} label="Malzeme Çıkış" onClick={() => setShowMalzemeCikis(true)} />
        <Buton icon={<FaHistory />} label="Stok Hareketleri" onClick={() => setShowStokHareket(true)} />
        <Buton icon={<FaClipboardList />} label="Eksik Malzeme Talebi" onClick={() => toast.warning('⚠️ Malzeme sipariş işlemi henüz aktif değil.')} />
      </div>
    </div>
  );
};

export default StokButonlari;