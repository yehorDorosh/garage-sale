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
};

export default mutations;
