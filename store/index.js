export const state = () => ({
  hostName: 'localhost:3000',
  protocol: 'http',
});

export const getters = {
  hostName(state) {
    return state.hostName;
  },

  protocol(state) {
    return state.protocol;
  },
};
