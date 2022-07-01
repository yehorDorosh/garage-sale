const actions = {
  async userReg(context, userData) {
    try {
      const response = await fetch(`${context.getters.protocol}://${context.getters.hostName}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        userData,
      });

      const data = await JSON.stringify(response);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
};

export default actions;
