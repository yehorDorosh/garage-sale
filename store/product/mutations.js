const mutations = {
  setUserProducts(state, payload) {
    state.userProducts = payload;
  },

  addUserProducts(state, payload) {
    state.userProducts.push(payload);
  },

  replaceProduct(state, payload) {
    const index = state.userProducts.findIndex(product => product._id === payload.tempId);
    if (index !== -1 && payload.product) {
      state.userProducts.splice(index, 1, payload.product);
    }
  },

  removeProduct(state, id) {
    state.userProducts = state.userProducts.filter(product => product._id !== id);
  }
};

export default mutations;