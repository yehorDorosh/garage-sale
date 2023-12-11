const mutations = {
  setSales(state, payload) {
    payload.forEach((sale) => {
      sale.products = sale.products.reverse().sort((a, b) => (a.isBooked === b.isBooked) ? 0 : a.isBooked ? 1 : -1);
    });
    state.sales = payload;
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
    if (!sale) { return; }
    const product = sale.products.find(product => product._id === buyer.productId);
    if (!product) { return; }
    product.buyer.name = buyer.name;
    product.buyer.email = buyer.email;
    product.isBooked = !!buyer.name && !!buyer.email;
  }
};

export default mutations;
