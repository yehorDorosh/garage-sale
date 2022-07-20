<template>
  <section>
    <ul v-if="products.length > 0">
      <li v-for="product in products" :key="product.id">
        <product-form
          :current-id="product._id"
          :current-title="product.title"
          :current-description="product.description"
          :current-price="product.price"
          :current-imgs="product.images"
          :current-is-published="product.isPublished"
          :current-is-booked="product.isBooked"
          :current-buyer="product.buyer"
          :sale-id="userSales[0]._id"
        />
      </li>
    </ul>
    <base-button v-if="userSales.length" @click="createProduct">
      Add new product
    </base-button>
  </section>
</template>

<script>
import { v4 as uuid } from 'uuid';

import ProductForm from '~/components/product/ProductForm';

export default {
  components: {
    ProductForm
  },

  computed: {
    products() {
      return this.$store.getters['product/getUserProducts'];
    },
    userSales() {
      return this.$store.getters['sale/getUserSales'];
    },
  },

  created() {
    this.$store.dispatch('product/fetchUserProducts');
  },

  methods: {
    createProduct() {
      const newProduct = {
        _id: uuid(),
        title: '',
        description: '',
        price: 0,
        images: [],
        isPublished: true,
        owner: this.$store.getters['user/getUserId'],
        isBooked: false,
        buyer: {
          name: '',
          email: '',
        }
      };

      this.$store.commit('product/addUserProducts', newProduct);
    },
  },
};
</script>
