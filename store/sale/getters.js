const getters = {
  getSales(state) {
    return state.sales;
  },

  getSalesIDs(state) {
    return state.sales.map(sale => sale._id);
  },

  getSaleById(state) {
    return id => state.sales.filter(sale => sale._id === id)[0];
  },

  getUserSales(state) {
    return state.userSales;
  },
};

export default getters;
