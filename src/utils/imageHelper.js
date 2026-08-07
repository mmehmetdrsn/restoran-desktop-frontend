// src/utils/imageHelper.js

export const getProductImage = (urunAdi) => {
  if (!urunAdi) return null;

  const normalized = urunAdi
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');

  return `${process.env.PUBLIC_URL}/images/${normalized}.jpg`;
};