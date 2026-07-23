// src/Admin/Bilesenler/Siparis/SiparisYonetimi.js
import React, { useState } from 'react';
import SiparisButonlari from './SiparisButonlari';
import SiparisListesi from './SiparisListesi';

const SiparisYonetimi = ({ 
  orders, 
  siparisGosterimModu, 
  setSiparisGosterimModu,
  handleSiparisListele,
  handleSiparisTamamla,
  setShowSiparisDetay
}) => {
  const [listeyiGoster, setListeyiGoster] = useState(false);

  // Aktif siparişler
  const aktifSiparisler = orders.filter(
    o => o.siparisDurumu !== 'TAMAMLANDI' && 
         o.siparisDurumu !== 'IPTAL' && 
         o.siparisDurumu !== 'ODENDI' &&
         o.siparisDurumu !== 'IADE'
  );
  
  // Tamamlanan siparişler
  const tamamlananSiparisler = orders.filter(
    o => o.siparisDurumu === 'TAMAMLANDI' || o.siparisDurumu === 'ODENDI'
  );
  
  // İptal siparişler
  const iptalSiparisler = orders.filter(
    o => o.siparisDurumu === 'IPTAL'
  );
  
  // İade siparişler
  const iadeSiparisler = orders.filter(
    o => o.siparisDurumu === 'IADE'
  );

  // İptal + İade
  const iptalIadeSiparisler = orders.filter(
    o => o.siparisDurumu === 'IPTAL' || o.siparisDurumu === 'IADE'
  );

  // Butona tıklanınca listeyi göster
  const handleButonTikla = (mod) => {
    setSiparisGosterimModu(mod);
    setListeyiGoster(true);
    handleSiparisListele();
  };

  return (
    <div className="space-y-6">
      {/* Butonlar */}
      <SiparisButonlari 
        tumSiparisler={orders}
        aktifSiparisler={aktifSiparisler}
        iptalIadeSiparisler={iptalIadeSiparisler}
        siparisGosterimModu={siparisGosterimModu}
        setSiparisGosterimModu={setSiparisGosterimModu}
        handleSiparisListele={() => {
          setListeyiGoster(true);
          handleSiparisListele();
        }}
        setShowSiparisDetay={setShowSiparisDetay} 
      />

      {/* Sipariş Listesi*/}
      {listeyiGoster && (
        <SiparisListesi 
          orders={orders}
          siparisGosterimModu={siparisGosterimModu}
          aktifSiparisler={aktifSiparisler}
          tamamlananSiparisler={tamamlananSiparisler}
          iptalSiparisler={iptalSiparisler}
          iadeSiparisler={iadeSiparisler}
          iptalIadeSiparisler={iptalIadeSiparisler}
          handleSiparisTamamla={handleSiparisTamamla}
        />
      )}
    </div>
  );
};

export default SiparisYonetimi;