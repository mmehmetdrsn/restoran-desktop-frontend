// src/Admin/components/Sidebar/Sidebar.js
import React from 'react';
import { FaSignOutAlt, FaKey, FaTimes, FaBars } from 'react-icons/fa';

const Sidebar = ({ 
  acik, 
  mobilAcik, 
  mobilKapat, 
  genisligiDegistir,
  menuOgeleri,
  seciliMenu,
  menuSec,
  kullanici,
  cikisYap,
  sifreDegistirAc
}) => {
  return (
    <div className={`
      fixed lg:relative lg:flex lg:flex-col
      ${acik ? 'w-72' : 'w-20'}
      bg-black/90 backdrop-blur-sm border-r border-white/10
      h-screen transition-all duration-300 overflow-y-auto
      ${mobilAcik ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      z-50 flex-shrink-0
    `}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {acik ? (
          <div className="flex items-center gap-3">
            <div className="text-3xl">🍽️</div>
            <div>
              <h1 className="text-white font-bold text-lg">SekerRestoran</h1>
              <p className="text-gray-400 text-[10px]">{kullanici?.email || 'admin@restoran.com'}</p>
            </div>
          </div>
        ) : (
          <div className="text-3xl mx-auto">🍽️</div>
        )}
        <button 
          onClick={genisligiDegistir}
          className="text-gray-400 hover:text-white hidden lg:block"
        >
          {acik ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
        <button 
          onClick={mobilKapat}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <FaTimes size={24} />
        </button>
      </div>

      <div className="py-4 px-3">
        {menuOgeleri.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              menuSec(item.id);
              mobilKapat();
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
              ${seciliMenu === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              ${!acik && 'justify-center'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {acik && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            )}
          </button>
        ))}

        <div className="border-t border-white/10 my-3"></div>

        <button
          onClick={sifreDegistirAc}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
            text-gray-400 hover:text-white hover:bg-white/5
            ${!acik && 'justify-center'}
          `}
        >
          <FaKey size={18} />
          {acik && <span className="text-sm">Şifre Değiştir</span>}
        </button>

        <button
          onClick={cikisYap}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
            text-red-400 hover:text-red-300 hover:bg-red-500/10
            ${!acik && 'justify-center'}
          `}
        >
          <FaSignOutAlt size={18} />
          {acik && <span className="text-sm">Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;