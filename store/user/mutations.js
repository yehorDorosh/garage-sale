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

  userName(state, payload) {
    state.userName = payload;
  },

  userEmail(state, payload) {
    state.userEmail = payload;
  }
};

export default mutations;
