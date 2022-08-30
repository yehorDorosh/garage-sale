const mutations = {
  setUserProducts(state, payload) {
    state.userProducts = payload;
  },

  addUserProducts(state, payload) {
    state.userProducts.push(payload);
  },

  replaceProduct(state, payload) {
    const index = state.userProducts.findIndex(product => product._id === payload.id);
    if (index !== -1 && payload.product) {
      state.userProducts.splice(index, 1, payload.product);
    }
  },

  removeProduct(state, id) {
    state.userProducts = state.userProducts.filter(product => product._id !== id);
  },

  clearUserProduct(state) {
    state.userProducts = [];
  },

  setBuyer(state, buyer) {
    const product = state.userProducts.find(product => product._id === buyer.productId);
    if (!product) { return; }
    product.buyer.name = buyer.name;
    product.buyer.email = buyer.email;
    product.buyer.phone = buyer.phone;
    product.isBooked = !!buyer.name && !!buyer.email;
  },

  setStatusSold(state, payload) {
    const product = state.userProducts.find(product => product._id === payload.productId);
    product.isSold = payload.isSold;
  }
};

export default mutations;
