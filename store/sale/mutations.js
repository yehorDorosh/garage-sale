const mutations = {
  setSales(state, payload) {
    state.sales = payload;
  },

  setUserSales(state, payload) {
    state.userSales = payload;
  },

  clearUserSales(state) {
    state.userSales = [];
  },

  setBuyer(state, buyer) {
    const sale = state.sales.find(sale => sale._id === buyer.saleId);
    const product = sale.products.find(product => product._id === buyer.productId);
    product.buyer.name = buyer.name;
    product.buyer.email = buyer.email;
    product.isBooked = !!buyer.name && !!buyer.email;
  }
};

export default mutations;
