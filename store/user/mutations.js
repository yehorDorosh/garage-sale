const mutations = {
  response(state, payload) {
    state.response = payload;
  },

  userId(state, payload) {
    state.userId = payload;
  },

  token(state, payload) {
    if (process.client) {
      if (payload === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', payload);
      }
      state.token = payload;
    }
  },
};

export default mutations;
