const getters = {
  getResponse(state) {
    return state.response;
  },

  getUserId(state) {
    return state.userId;
  },

  getUserName(state) {
    return state.userName;
  },

  getUserEmail(state) {
    return state.userEmail;
  },

  getUser(state) {
    return state.user;
  },

  getToken(state) {
    return state.token;
  },

  isAuth(state) {
    return !!state.token;
  },
};

export default getters;
