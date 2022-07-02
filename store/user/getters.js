const getters = {
  response(state) {
    return state.response;
  },

  userId(state) {
    return state.userId;
  },

  token(state) {
    if (process.client) {
      return localStorage.getItem('token') || state.token;
    }
  },

  isAuth(_, getters) {
    return !!getters.token;
  }
};

export default getters;
