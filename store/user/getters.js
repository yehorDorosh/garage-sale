const getters = {
  response(state) {
    return state.response;
  },

  userId(state) {
    return state.userId;
  },

  token(state) {
    return state.token;
  },

  isAuth(state) {
    return !!state.token;
  },

  userName(state) {
    return state.userName;
  },

  userEmail(state) {
    return state.userEmail;
  },
};

export default getters;
