// src/Admin/components/Dashboard/Dashboard.js
import React from 'react';
import { FaSpinner, FaFire, FaArrowRight } from 'react-icons/fa';

// 🔥 Dashboard'a özel durum renkleri
const getDashboardStatusColor = (durum) => {
  switch (durum) {
    case 'Bekliyor': return 'bg-yellow-500/20 text-yellow-400';
    case 'Hazırlanıyor': return 'bg-blue-500/20 text-blue-400';
    case 'Hazır': return 'bg-green-500/20 text-green-400';
    case 'Tamamlandı': return 'bg-green-500/20 text-green-400';
    case 'Teslim Edildi': return 'bg-purple-500/20 text-purple-400';
    case 'İptal': return 'bg-red-500/20 text-red-400';
    case 'İade': return 'bg-red-500/20 text-red-400';
    case 'Kısmi İade': return 'bg-orange-500/20 text-orange-400';
    case 'Ödendi': return 'bg-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const Dashboard = ({ 
  loading, 
  dashboardData, 
  topProducts, 
  recentOrders, 
  onMenuGor 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-2">
          {dashboardData.date} - Restoran Özeti
        </h2>
        <p className="text-gray-400 text-sm mb-4">İşletmenizin anlık verileri</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-5">
            <p className="text-gray-400 text-xs">Bugünkü Ciro</p>
            <p className="text-white text-3xl font-bold">₺{dashboardData.totalRevenue.toLocaleString()}</p>
            <p className={`text-xs mt-1 ${dashboardData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {dashboardData.changePercent >= 0 ? '↑' : '↓'} %{Math.abs(dashboardData.changePercent)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <p className="text-gray-400 text-xs">Dünkü Ciro</p>
            <p className="text-white text-3xl font-bold">₺{dashboardData.oncekiGunCiro?.toLocaleString() || 0}</p>
            <p className="text-gray-400 text-xs mt-1">Önceki gün</p>
          </div>
          <div className="bg-white/5 rounded-xl p-5">
            <p className="text-gray-400 text-xs">Toplam Sipariş</p>
            <p className="text-white text-3xl font-bold">{dashboardData.totalOrders}</p>
            <p className="text-gray-400 text-xs mt-1">Bugün</p>
          </div>
        </div>
      </div>

      {/* En Çok Satanlar ve Son Siparişler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">En Çok Satanlar</h2>
            <FaFire className="text-orange-500" />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Henüz veri yok</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {product.index}. {product.name}
                    </p>
                    <p className="text-gray-400 text-xs">{product.quantity} porsiyon</p>
                  </div>
                  <p className="text-white font-semibold">₺{product.revenue.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={onMenuGor}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm transition-all"
          >
            Tüm Menüyü Gör
            <FaArrowRight size={12} />
          </button>
        </div>

        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Son Siparişler</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-black/90">
                <tr className="text-gray-400 text-xs border-b border-white/5">
                  <th className="text-left py-2 px-2">Sipariş No</th>
                  <th className="text-left py-2 px-2">Masa/Tür</th>
                  <th className="text-left py-2 px-2">İçerik</th>
                  <th className="text-left py-2 px-2">Saat</th>
                  <th className="text-left py-2 px-2">Tutar</th>
                  <th className="text-left py-2 px-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-gray-400">Henüz sipariş yok</td></tr>
                ) : (
                  recentOrders.map((order, index) => {
                    const durumRenk = getDashboardStatusColor(order.durum);
                    const isIade = order.durum === 'İade' || order.durum === 'IADE' || order.iadeMi;
                    return (
                      <tr key={index} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isIade ? 'bg-red-500/5' : ''}`}>
                        <td className="py-2 px-2 text-white text-xs">{order.siparisNo}</td>
                        <td className="py-2 px-2 text-gray-300 text-xs">{order.masa}</td>
                        <td className="py-2 px-2 text-gray-400 text-xs">{order.icerik}</td>
                        <td className="py-2 px-2 text-gray-400 text-xs">{order.saat}</td>
                        <td className="py-2 px-2 text-white text-xs font-medium">₺{order.tutar}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-1 rounded text-[10px] ${durumRenk}`}>
                            {order.durum}
                            {isIade && ' 🔄'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;