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

      const data = await response.json();
      console.log(data);
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default actions;
