const mutations = {
  response(state, payload) {
    state.response = payload;
  },

  userId(state, payload) {
    state.userId = payload;
  },

  token(state, payload) {
    state.token = payload;
  },
};

export default mutations;
