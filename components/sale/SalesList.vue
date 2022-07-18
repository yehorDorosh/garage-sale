<template>
  <section>
    <ul>
      <li v-for="sale in sales" :key="sale._id">
        {{ sale._id }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    sales() {
      return this.$store.getters['sale/getSales'];
    },
  },

  created() {
    this.$store.dispatch('sale/fetchSales');
  },
};
</script>
