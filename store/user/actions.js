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
      if (status === 200 || status === 201) { context.commit('userId', data.userId); }
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default actions;
