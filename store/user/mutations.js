const mutations = {
  setResponse(state, payload) {
    state.response = payload;
  },

  clearResponse(state) {
    state.response = null;
  },

  setToken(state, payload) {
    state.token = payload;
  },

  clearToken(state) {
    state.token = null;
  },

  setUserId(state, payload) {
    state.user.id = payload;
  },

  setUserName(state, payload) {
    state.user.name = payload;
  },

  setUserEmail(state, payload) {
    state.user.email = payload;
  },

  setUserPhone(state, payload) {
    state.user.phone = payload;
  },

  setUser(state, payload) {
    state.user = {
      ...payload,
    };
  },

  clearUserData(state) {
    state.user.id = null;
    state.user.name = null;
    state.user.email = null;
  }
};

export default mutations;
