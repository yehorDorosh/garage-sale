<template>
  <section>
    <ul>
      <product-item
        v-for="(product, i) in products"
        :id="i"
        :key="product._id"
        :product="product"
        :buyer-name="sessionBuyer.name"
        :buyer-email="sessionBuyer.email"
        :buyer-phone="sessionBuyer.phone"
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
    sessionBuyer() {
      return this.$store.getters.getSessionBuyer;
    },
  },

  mounted() {
    this.$nextTick(this.scroll);
  },

  methods: {
    scroll() {
      const id = this.$route.hash ? this.$route.hash.slice(4) : null;
      if (id === null || +id === 0) {
        window.scrollTo({
          top: 0,
        });
        return;
      }
      const headerHight = document.querySelector('.page-header')?.clientHeight;
      const elem = document.getElementById(id);
      if (id === null) { return; }
      const headerOffset = headerHight ?? 100;
      const elemPos = elem.getBoundingClientRect().top;
      const offsetPos = elemPos + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    }
  }
};
</script>
