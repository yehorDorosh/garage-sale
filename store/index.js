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

export const actions = {
  async nuxtServerInit(storeContext, nuxtContext) {
    const req = nuxtContext.req;
    if (!req) { return; }
    if (!req.headers.cookie) { return; }

    const jwtCookie = req.headers.cookie.split(';')?.find(c => c.trim().startsWith('jwt'));
    if (!jwtCookie) { return; }

    const token = jwtCookie.split('=')[1];
    if (!token) { return; }

    await storeContext.dispatch('user/getUserData', token);
  }
};
