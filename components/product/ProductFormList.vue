<template>
  <section>
    <ul>
      <li v-for="product in [...$store.getters['product/getUserProducts']]" :key="product.id">
        <product-form
          :current-id="product._id"
          :current-title="product.title"
          :current-description="product.description"
          :current-price="product.price"
          :current-imgs="product.images"
          :current-is-published="product.isPublished"
          @delete="deleteProduct"
        />
      </li>
    </ul>
    <base-button @click="createProduct">
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

  data() {
    return {

    };
  },

  computed: {
    products() {
      return this.$store.getters['product/getUserProducts'];
    }
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

    deleteProduct(id) {
      this.$store.commit('product/removeProduct', id);
    },
  },
};
</script>
