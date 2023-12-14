import crypto from 'crypto';
import isJson from '../../server/utils/is-json';

const encryptSale = (sale) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ownerContactsKey, 'hex');
  const decrypt = (text, key) => {
    if (!text || !key || typeof text.iv !== 'string') { return null; }
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  };

  const ownerEmail = isJson(sale.owner.email) ? JSON.parse(sale.owner.email) : null;
  const ownerPhone = sale.owner.phone && isJson(sale.owner.phone.number) ? JSON.parse(sale.owner.phone.number) : null;
  const ownerName = isJson(sale.owner.name) ? JSON.parse(sale.owner.name) : null;
  const newSale = JSON.parse(JSON.stringify(sale));
  if (ownerEmail) {
    const hashedOwnerEmail = decrypt(ownerEmail, key);
    newSale.owner.email = hashedOwnerEmail;
  }
  if (ownerPhone) {
    const hashedOwnerPhone = decrypt(ownerPhone, key);
    newSale.owner.phone.number = hashedOwnerPhone;
  }
  if (ownerName) {
    const hashedOwnerName = decrypt(ownerName, key);
    newSale.owner.name = hashedOwnerName;
  }
  newSale.products.forEach((product) => {
    const buyerEmail = isJson(product.buyer.email) ? JSON.parse(product.buyer.email) : null;
    const buyerPhone = product.buyer.phone && isJson(product.buyer.phone.number) ? JSON.parse(product.buyer.phone.number) : null;
    const buyerName = isJson(product.buyer.name) ? JSON.parse(product.buyer.name) : null;
    if (buyerEmail) {
      const hashedBuyerEmail = decrypt(buyerEmail, key);
      product.buyer.email = hashedBuyerEmail;
    }
    if (buyerPhone) {
      const hashedBuyerPhone = decrypt(buyerPhone, key);
      product.buyer.phone.number = hashedBuyerPhone;
    }
    if (buyerName) {
      const hashedBuyerName = decrypt(buyerName, key);
      product.buyer.name = hashedBuyerName;
    }
  });
  return newSale;
};

const getters = {
  getSales(state) {
    return state.sales.map((sale) => {
      return encryptSale(sale);
    });
  },

  getSalesAmount(state) {
    return state.salesAmount;
  },

  getSalesIDs(state) {
    return state.sales.map(sale => sale._id);
  },

  getSaleById(state) {
    return (id) => {
      const sale = state.sales.find(sale => sale._id === id);
      return sale ? encryptSale(sale) : null;
    };
  },

  getUserSales(state) {
    return state.userSales;
  },
};

export default getters;
