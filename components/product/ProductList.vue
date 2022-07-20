<template>
  <section>
    <ul>
      <product-item v-for="product in filteredProducts" :key="product._id" :product="product" />
    </ul>
  </section>
</template>

<script>
import ProductItem from '~/components/product/ProductItem.vue';

export default {
  components: {
    ProductItem
  },

  props: {
    products: {
      type: Array,
      require: true,
      default: () => [],
    },
  },

  computed: {
    filteredProducts() {
      return this.products.filter(product => product.isPublished);
    },
  },
};
</script>
