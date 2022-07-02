import Cookie from 'js-cookie';

const actions = {
  async userReg(context, userData) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userData }),
      });
      const status = response.status;
      const data = await response.json();
      data.status = status;
      context.commit('setResponse', data);
      if (status === 200 || status === 201) {
        context.commit('setToken', data.token);
        context.dispatch('getUserData');
        Cookie.set('jwt', data.token);
        if (process.client) {
          localStorage.setItem('token', data.token);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  logout(context) {
    context.commit('clearToken');
    context.commit('clearResponse');
    context.commit('clearUserData');
    Cookie.remove('jwt');
    if (process.client) {
      localStorage.removeItem('token');
    }
  },

  async login(context, userData) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userData }),
      });
      const status = response.status;
      const data = await response.json();
      data.status = status;
      context.commit('setResponse', data);
      if (status === 200) {
        context.commit('setToken', data.token);
        context.dispatch('getUserData');
        Cookie.set('jwt', data.token);
        if (process.client) {
          localStorage.setItem('token', data.token);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  checkAuth(context, req) {
    let token;
    if (req) {
      if (!req.headers.cookie) { return; }
      const jwtCookie = req.headers.cookie.split(';')?.find(c => c.trim().startsWith('jwt'));
      if (!jwtCookie) { return; }
      token = jwtCookie.split('=')[1];
    } else if (process.client) {
      token = localStorage.getItem('token');
    }

    if (!token) { return; }

    context.commit('setToken', token);
    context.dispatch('getUserData');
  },

  async getUserData(context) {
    if (context.getters.isAuth) {
      try {
        const response = await fetch(`${process.env.protocol}://${process.env.hostName}/user/data`, {
          headers: {
            Authorization: 'Bearer ' + context.getters.getToken,
          },
        });
        const status = response.status;
        const userData = await response.json();
        userData.status = status;
        context.commit('setUser', {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};

export default actions;
