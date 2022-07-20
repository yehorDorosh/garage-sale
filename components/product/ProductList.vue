<template>
  <section>
    <ul>
      <product-item
        v-for="product in filteredProducts"
        :key="product._id"
        :product="product"
        :buyer-name="sessionBuyer.name"
        :buyer-email="sessionBuyer.email"
      />
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
      required: true,
      default: () => [],
    },
  },

  computed: {
    filteredProducts() {
      return this.products.filter(product => product.isPublished);
    },
    sessionBuyer() {
      return this.$store.getters.getSessionBuyer;
    },
  },
};
</script>
