const mutations = {
  response(state, payload) {
    state.response = payload;
  },

  userId(state, payload) {
    state.userId = payload;
  },
};

export default mutations;
