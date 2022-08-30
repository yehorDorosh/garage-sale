const getters = {
  getResponse(state) {
    return state.response;
  },

  getUserId(state) {
    return state.user.id;
  },

  getUserName(state) {
    return state.user.name;
  },

  getUserEmail(state) {
    return state.user.email;
  },

  getUserPhone(state) {
    return state.user.phone;
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
