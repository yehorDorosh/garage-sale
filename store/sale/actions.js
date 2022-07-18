const actions = {
  async fetchSales(context) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/sales`);
      const status = response.status;
      const data = await response.json();
      console.log(data, status);

      if (status === 200) {
        context.commit('setSales', data.sales);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default actions;
