import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

const actions = {
  async userReg(context, userData) {
    try {
      const response = await fetch(`${context.rootGetters.protocol}://${context.rootGetters.hostName}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userData }),
      });
      const status = response.status;
      const data = await response.json();
      data.status = status;
      context.commit('response', data);
      if (status === 200 || status === 201) {
        context.commit('userId', data.userId);
        context.commit('setToken', data.token);
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
    context.commit('userId', null);
    context.commit('response', null);
    Cookie.remove('jwt');
    if (process.client) {
      localStorage.removeItem('token');
    }
  },

  async login(context, userData) {
    try {
      const response = await fetch(`${context.rootGetters.protocol}://${context.rootGetters.hostName}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userData }),
      });
      const status = response.status;
      const data = await response.json();
      data.status = status;
      context.commit('response', data);
      if (status === 200) {
        context.commit('userId', data.userId);
        context.commit('setToken', data.token);
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
    const userData = jwt.decode(token);
    context.commit('userId', userData.userId);
    context.commit('setToken', token);
  }
};

export default actions;
