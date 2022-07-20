export const state = () => ({
  hostName: 'localhost:3000',
  protocol: 'http',
  sessionBuyer: {
    name: '',
    email: '',
  },
});

export const getters = {
  hostName(state) {
    return state.hostName;
  },

  protocol(state) {
    return state.protocol;
  },

  getLocale() {
    if (!process.client) { return 'ru'; }
    if (navigator.languages !== undefined) { return navigator.languages[0]; }
    return navigator.language;
  },

  getSessionBuyer(state) {
    return state.sessionBuyer;
  },
};

export const mutations = {
  setSessionBuyer(state, payload) {
    state.sessionBuyer.name = payload.name;
    state.sessionBuyer.email = payload.email;
  },
};

export const actions = {
  async nuxtServerInit(storeContext, nuxtContext) {
    // Check user is auth. on backend; And get user data.
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
