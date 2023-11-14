const actions = {
  async fetchSales(context, payload) {
    const page = payload ? (!isNaN(payload.page) ? `?page=${payload.page}` : '') : '';
    try {
      const response = await fetch(`${process.env.fullHostName}/api-sales${page}`);
      const status = response.status;
      const data = await response.json();

      if (status === 200) {
        context.commit('setSales', data.sales);
        context.commit('setSalesAmount', data.totalItems);
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async isSaleExist(context, payload) {
    try {
      const response = await fetch(`${process.env.fullHostName}/api-sales`);
      const status = response.status;
      const data = await response.json();

      if (status === 200 && data.sales && data.sales.length > 0) {
        return data.sales.map(sale => sale._id).includes(payload.id);
      }

      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  async fetchUserSales(context) {
    try {
      const response = await fetch(`${process.env.fullHostName}/api-user-sales`, {
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
        },
      });
      const status = response.status;
      const data = await response.json();

      if (status === 200) {
        context.commit('setUserSales', data.sales);
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async saveSale(context, saleData) {
    try {
      const response = await fetch(`${process.env.fullHostName}/api-sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
        },
        body: JSON.stringify(saleData),
      });
      const status = response.status;
      const data = await response.json();
      data.status = status;

      if (status === 200 || status === 201) {
        context.commit('setUserSales', [data.sale]);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default actions;
