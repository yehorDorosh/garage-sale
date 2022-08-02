const mutations = {
  setSales(state, payload) {
    state.sales = payload.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  },

  setSalesAmount(state, payload) {
    state.salesAmount = payload;
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
