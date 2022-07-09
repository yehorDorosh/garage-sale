const actions = {
  async fetchUserProducts(context) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/products`, {
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      throw new Error(error);
    }
  },

  async saveUserProduct(context, product) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/products`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...product }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default actions;
