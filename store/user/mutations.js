const mutations = {
  setResponse(state, payload) {
    state.response = payload;
  },

  setUserId(state, payload) {
    state.userId = payload;
  },

  setUserName(state, payload) {
    state.userName = payload;
  },

  setUserEmail(state, payload) {
    state.userEmail = payload;
  },

  setToken(state, payload) {
    state.token = payload;
  },

  clearToken(state) {
    state.token = null;
  },
};

export default mutations;
