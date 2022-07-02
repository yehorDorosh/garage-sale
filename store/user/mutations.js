const mutations = {
  response(state, payload) {
    state.response = payload;
  },

  userId(state, payload) {
    state.userId = payload;
  },

  setToken(state, payload) {
    state.token = payload;
  },

  clearToken(state) {
    state.token = null;
  },
};

export default mutations;
