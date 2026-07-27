// src/Admin/components/Sidebar/Sidebar.js
import React from 'react';
import { FaSignOutAlt, FaKey, FaBars } from 'react-icons/fa';

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
  sifreDegistirAc,
  isDayMode = false,
  profilAksiyonlariniGoster = true
}) => {
  return (
    <div className={`
      fixed lg:relative lg:flex lg:flex-col
      ${acik ? 'w-72' : 'w-20'}
      ${isDayMode ? 'bg-slate-50/95 border-r border-slate-200/70 text-slate-900' : 'bg-black/90 border-r border-white/10 text-white'}
      backdrop-blur-sm
      h-screen transition-all duration-300 overflow-y-auto
      ${mobilAcik ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      z-50 flex-shrink-0
    `}>
      <div className={`flex flex-col items-center justify-center gap-2 p-4 border-b ${isDayMode ? 'border-slate-200/80' : 'border-white/10'}`}>
        {acik && (
          <div className="text-center w-full">
            <img
              src={`${process.env.PUBLIC_URL}/new-logo.jpeg`}
              alt="SekerRestoran Logo"
              className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
            />
            <h1 className={`${isDayMode ? 'text-slate-900' : 'text-white'} font-bold text-lg`}>SekerRestoran</h1>
            <p className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} text-[10px]`}>Admin Paneli</p>
          </div>
        )}
        {!acik && (
          <img
            src={`${process.env.PUBLIC_URL}/new-logo.jpeg`}
            alt="SekerRestoran Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <button 
          onClick={genisligiDegistir}
          className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'} hidden lg:flex items-center justify-center`}
        >
          <FaBars size={18} />
        </button>
        <button 
          onClick={mobilKapat}
          className={`${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'} lg:hidden flex items-center justify-center`}
        >
          <FaBars size={20} />
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
              ${seciliMenu === item.id
                ? (isDayMode ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-white')
                : (isDayMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5')}
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

        {profilAksiyonlariniGoster && (
          <>
            <div className={`border-t ${isDayMode ? 'border-slate-200' : 'border-white/10'} my-3`}></div>

            <button
              onClick={sifreDegistirAc}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${isDayMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}
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
                ${isDayMode ? 'text-red-700 hover:text-red-800 hover:bg-red-50' : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'}
                ${!acik && 'justify-center'}
              `}
            >
              <FaSignOutAlt size={18} />
              {acik && <span className="text-sm">Çıkış Yap</span>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;