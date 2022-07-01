const getters = {
  response(state) {
    return state.response;
  },

  userId(state) {
    return state.userId;
  },

  token(state) {
    return localStorage.getItem('token') || state.token;
  }
};

export default getters;
