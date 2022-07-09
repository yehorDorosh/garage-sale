<template>
  <section>
    <ul>
      <li v-for="product in products" :key="product.id">
        <product-form
          :current-id="product.id"
          :current-title="product.title"
          :current-description="product.description"
          :current-price="product.price"
          :current-imgs="product.imgs"
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
      products: [],
      productTemplate: {
        title: '',
        description: '',
        price: 0,
        imgs: [],
        isPublished: true,
        owner: this.$store.getters['user/getUserEmail'],
        isBooked: false,
        buyer: {
          name: '',
          email: ''
        }
      }
    };
  },

  methods: {
    createProduct() {
      this.products.push({
        id: uuid(),
        ...this.productTemplate
      });
    },

    deleteProduct(id) {
      this.products = this.products.filter(product => product.id !== id);
    }
  }
};
</script>
