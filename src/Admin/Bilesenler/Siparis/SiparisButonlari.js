// src/Admin/Bilesenler/Siparis/SiparisButonlari.js
import React from 'react';
import { FaClipboardList, FaList, FaShoppingCart, FaUndo, FaEye } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const SiparisButonlari = ({ 
  tumSiparisler, 
  aktifSiparisler, 
  iptalIadeSiparisler,
  siparisGosterimModu,
  setSiparisGosterimModu,
  handleSiparisListele,
  setShowSiparisDetay
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaClipboardList />} title="Sipariş Yönetimi" />
      <p className="text-gray-400 text-sm mb-6">Aktif siparişler ve sipariş işlemleri.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Buton 
          icon={<FaList />} 
          label={`Tüm Siparişler (${tumSiparisler.length})`}
          onClick={() => {
            setSiparisGosterimModu('all');
            handleSiparisListele();
          }} 
        />
        <Buton 
          icon={<FaShoppingCart />} 
          label={`Aktif (${aktifSiparisler.length})`}
          onClick={() => {
            setSiparisGosterimModu('active');
            handleSiparisListele();
          }} 
        />
        <Buton 
          icon={<FaUndo />} 
          label={`İptal/İade (${iptalIadeSiparisler.length})`}
          onClick={() => {
            setSiparisGosterimModu('iptal_iade');
            handleSiparisListele();
          }} 
        />
        <Buton 
          icon={<FaEye />} 
          label="Sipariş Detay" 
          onClick={() => setShowSiparisDetay(true)} 
        />
      </div>
    </div>
  );
};

export default SiparisButonlari;