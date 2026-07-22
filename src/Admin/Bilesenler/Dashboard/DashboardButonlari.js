import React from 'react';
import { FaHome, FaChartLine, FaUsers, FaUtensils, FaClipboardList, FaMoneyBillWave, FaBoxes, FaTable, FaUserCog, FaChartBar } from 'react-icons/fa';
import BolumBasligi from '../Ortak/BolumBasligi';
import Buton from '../Ortak/Buton';

const DashboardButonlari = ({ setSelectedMenu }) => {
  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, label: 'Genel Bakış' },
    { id: 'product_menu', icon: <FaUtensils />, label: 'Ürün ve Menü Yönetimi' },
    { id: 'members', icon: <FaUsers />, label: 'Üye Yönetimi' },
    { id: 'finance', icon: <FaMoneyBillWave />, label: 'Finans ve Kasa Yönetimi' },
    { id: 'stock', icon: <FaBoxes />, label: 'Depo / Stok Yönetimi' },
    { id: 'orders', icon: <FaClipboardList />, label: 'Sipariş Yönetimi' },
    { id: 'tables', icon: <FaTable />, label: 'Masa ve Rezervasyon Yönetimi' },
    { id: 'personnel', icon: <FaUserCog />, label: 'Personel Yönetimi' },
    { id: 'reports', icon: <FaChartBar />, label: 'Raporlar ve İstatistikler' }
  ];

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-6xl mx-auto">
      <BolumBasligi icon={<FaHome />} title="Dashboard" />
      <p className="text-gray-400 text-sm mb-6">Hızlı erişim menüsü</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {menuItems.map((item) => (
          <Buton 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            onClick={() => setSelectedMenu(item.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardButonlari;