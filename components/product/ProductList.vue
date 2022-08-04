<template>
  <section>
    <ul>
      <product-item
        v-for="product in products"
        :key="product._id"
        :product="product"
        :buyer-name="sessionBuyer.name"
        :buyer-email="sessionBuyer.email"
        @bookingWasCanceled="bookingWasCanceled"
      />
    </ul>
    <base-dialog :show="bookingWarning" @close="closeBookingWarning">
      Unfortunately, the item has already been booked.
    </base-dialog>
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

  data() {
    return {
      bookingWarning: false,
    };
  },

  computed: {
    sessionBuyer() {
      return this.$store.getters.getSessionBuyer;
    },
  },

  methods: {
    bookingWasCanceled(data) {
      this.bookingWarning = true;
    },
    closeBookingWarning() {
      this.bookingWarning = false;
    },
  },
};
</script>
