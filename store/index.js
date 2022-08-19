export const state = () => ({
  siteEmail: process.env.siteEmail,
  siteFBEmail: process.env.siteFBEmail,
  sessionBuyer: {
    name: '',
    email: '',
  },
});

export const getters = {
  getSiteEmail(state) {
    return state.siteEmail;
  },

  getSiteFBEmail(state) {
    return state.siteFBEmail;
  },

  getLocale() {
    if (!process.client) { return 'ru'; }
    if (navigator.languages !== undefined) { return navigator.languages[0]; }
    return navigator.language;
  },

  getSessionBuyer(state) {
    if (process.client && !state.sessionBuyer.name && !state.sessionBuyer.email) {
      const name = localStorage.getItem('buyer-name');
      const email = localStorage.getItem('buyer-email');
      if (name && email) { return { name, email }; }
    }
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
