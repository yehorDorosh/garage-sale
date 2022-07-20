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
      if (status === 200) {
        context.commit('setUserProducts', data.products);
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async saveUserProduct(context, product) {
    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('isPublished', product.isPublished);
    formData.append('isBooked', product.isBooked);
    formData.append('buyer', JSON.stringify(product.buyer));

    formData.append('imagesData', JSON.stringify(product.images));
    product.images.forEach((img) => {
      formData.append('images', img.file);
    });

    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/products`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + context.rootGetters['user/getToken'],
        },
        body: formData,
      });
      const status = response.status;
      const data = await response.json();
      if (status === 200 || status === 201) {
        context.commit('replaceProduct', {
          id: product.id,
          product: data.product,
        });
      } else {
        return {
          ...data,
          status,
        };
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
      if (status === 200) {
        context.commit('removeProduct', data.prodId);
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  async saveBuyer(context, buyer) {
    try {
      const response = await fetch(`${process.env.protocol}://${process.env.hostName}/buyer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyer),
      });
      const status = response.status;
      const data = await response.json();
      console.log(data);

      if (status === 200 || status === 201) {
        context.commit('sale/setBuyer', data.buyer, { root: true });
        context.commit('setSessionBuyer', data.buyer, { root: true });
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default actions;
