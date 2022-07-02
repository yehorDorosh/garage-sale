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
        await context.dispatch('getUserData', data.token);
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
        await context.dispatch('getUserData', data.token);
        Cookie.set('jwt', data.token);
        if (process.client) {
          localStorage.setItem('token', data.token);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async checkAuth(context) {
    if (process.client && !context.getters.isAuth) {
      const token = localStorage.getItem('token');
      if (!token) { return; }
      await context.dispatch('getUserData', token);
    }
  },

  async getUserData(context, token) {
    context.commit('setToken', token);
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/user/data`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const userData = await response.json();
      context.commit('setUser', {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default actions;
