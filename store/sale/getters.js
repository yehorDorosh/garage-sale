const getters = {
  getSales(state) {
    return state.sales;
  },

  getSalesAmount(state) {
    return state.salesAmount;
  },

  getSalesIDs(state) {
    return state.sales.map(sale => sale._id);
  },

  getSaleById(state) {
    return id => state.sales.find(sale => sale._id === id);
  },

  getUserSales(state) {
    return state.userSales;
  },
};

export default getters;
