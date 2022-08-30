<template>
  <li class="card prod">
    <div class="prod__info">
      <div class="prod__txt">
        <h3 class="prod__title">
          {{ product.title }}
        </h3>
        <p class="prod__desc">
          {{ product.description }}
        </p>
        <p v-if="product.price === 0" class="prod__price prod__price--free">
          It's FREE!!!
        </p>
        <p v-else class="prod__price">
          Price: {{ new Intl.NumberFormat($store.getters.getLocale, { style: 'currency', currency: 'EUR' }).format(product.price) }}
        </p>
      </div>
      <p v-if="isBooked">
        Booked by <b><span class="nowrap">{{ product.buyer.name }}</span></b>
      </p>
      <div v-else class="btn-container">
        <base-button @click="book">
          Book
        </base-button>
      </div>
    </div>
    <image-slider :key="product.images.length" :images="product.images" />
  </li>
</template>

<script>
import ImageSlider from '~/components/ui/ImageSlider';

export default {
  components: {
    ImageSlider,
  },

  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        description: '',
        price: 0,
        images: [],
      }),
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    buyerPhone: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    saleId() {
      return this.$route.params.id;
    },
    isBooked() {
      return this.product.isBooked;
    },
  },

  methods: {
    book() {
      this.$store.commit('dialog/setBuyerFormData', {
        saleId: this.saleId,
        productId: this.product._id,
        buyerName: this.buyerName,
        buyerEmail: this.buyerEmail,
        buyerPhone: this.buyerPhone,
      });
      this.$store.commit('dialog/setBuyerFormIsShown', true);
    }
  },
};
</script>

<style scoped>
@media (min-width: 768px) {
  .prod__info {
    display: flex;
    justify-content: space-between;
  }
}

.btn-container {
  text-align: center;
}

@media (min-width: 768px) {
  .btn-container .button {
    margin-top: 0;
  }
}

.prod__price {
  font-weight: 700;
}

.prod__price--free {
  color: var(--accent);
}
</style>
