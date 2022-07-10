const actions = {
  async fetchUserProducts(context) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/products`, {
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
        },
      });
      const status = response.status;
      const data = await response.json();
      console.log(data);
      if (status === 200) {
        context.commit('setUserProducts', data.products);
      }
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
      const status = response.status;
      const data = await response.json();
      console.log(data);
      if (status === 200 || status === 201) {
        context.commit('replaceProduct', {
          tempId: product.tempId,
          product: data.product,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async deleteUserProduct(context, prodId) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/products`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodId }),
      });
      const status = response.status;
      const data = await response.json();
      console.log(data);
      if (status === 200) {
        context.commit('removeProduct', data.prodId);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default actions;
