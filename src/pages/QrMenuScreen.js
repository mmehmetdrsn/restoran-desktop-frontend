// src/pages/QrMenuScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaUser, FaHome } from 'react-icons/fa';
import { productService, tableService } from '../api/api';

const QrMenuScreen = () => {
  const navigate = useNavigate();
  const [masaId, setMasaId] = useState(null);
  const [masaNo, setMasaNo] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // QR ile gelen masa ID'sini al
    const qrMasaId = localStorage.getItem('qrMasaId');
    if (qrMasaId) {
      setMasaId(qrMasaId);
      // Masa bilgilerini getir
      fetchMasaBilgisi(qrMasaId);
    } else {
      // QR ile gelmediyse ana sayfaya yönlendir
      navigate('/');
    }
    
    fetchProducts();
  }, []);

  const fetchMasaBilgisi = async (id) => {
    try {
      const response = await tableService.getById(id);
      const data = response.data;
      if (data) {
        setMasaNo(data.masaNo || data.masaNo);
      }
    } catch (error) {
      console.error('Masa bilgisi alınamadı:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      const data = response.data || [];
      
      // Kategorileri çıkar
      const uniqueCategories = ['Tümü', ...new Set(data.map(p => p.kategoriAdi || 'Genel'))];
      setCategories(uniqueCategories);
      
      // Ürünleri filtrele (aktif olanlar)
      const activeProducts = data.filter(p => p.isActive !== false);
      setProducts(activeProducts);
    } catch (error) {
      toast.error('Ürünler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'Tümü' 
    ? products 
    : products.filter(p => (p.kategoriAdi || 'Genel') === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.urunId === product.urunId);
      if (existing) {
        return prev.map(p => 
          p.urunId === product.urunId 
            ? { ...p, adet: p.adet + 1 } 
            : p
        );
      }
      return [...prev, { ...product, adet: 1 }];
    });
    setCartCount(prev => prev + 1);
    toast.success(`${product.urunAdi} sepete eklendi!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const existing = prev.find(p => p.urunId === productId);
      if (existing) {
        if (existing.adet > 1) {
          return prev.map(p => 
            p.urunId === productId 
              ? { ...p, adet: p.adet - 1 } 
              : p
          );
        }
        return prev.filter(p => p.urunId !== productId);
      }
      return prev;
    });
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const goToCart = () => {
    if (cart.length === 0) {
      toast.warning('Sepetiniz boş!');
      return;
    }
    // Sepet bilgilerini localStorage'a kaydet
    localStorage.setItem('qrCart', JSON.stringify(cart));
    localStorage.setItem('qrMasaId', masaId);
    navigate('/qr/sepet');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🍽️ Şeker Restoran</h1>
            {masaNo && (
              <p className="text-sm text-green-200">Masa #{masaNo}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={goToCart}
              className="relative bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('qrMasaId');
                localStorage.removeItem('qrCart');
                navigate('/');
              }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <FaHome size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Kategoriler */}
      <div className="bg-white border-b border-gray-200 p-3 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ürünler */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin text-3xl text-green-600">⏳</div>
            <p className="text-gray-500 mt-2">Menü yükleniyor...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p>Bu kategoride ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.urunId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-32 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {product.urunAdi}
                  </h3>
                  <p className="text-green-600 font-bold mt-1">
                    ₺{product.fiyat?.toFixed(2) || '0.00'}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 rounded-lg transition"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sepet Özeti (Mobil için) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg md:hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <span className="font-bold text-gray-800">{cartCount} ürün</span>
              <span className="text-green-600 font-bold ml-2">
                ₺{cart.reduce((sum, p) => sum + (p.fiyat * p.adet), 0).toFixed(2)}
              </span>
            </div>
            <button
              onClick={goToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Sepete Git 🛒
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrMenuScreen;