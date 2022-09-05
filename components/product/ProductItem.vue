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
      <p v-if="isBooked" class="prod__buyer">
        Booked by <b><span class="nowrap">{{ product.buyer.name }}</span></b>
      </p>
      <div v-else class="btn-container">
        <base-button @click="book">
          Book
        </base-button>
        <base-button v-show="buyerName && buyerEmail" @click="openForm">
          Edit contact data
        </base-button>
        <base-spinner :is-loading="isLoading" />
      </div>
    </div>
    <image-slider :key="product.images.length" :images="product.images" />
  </li>
</template>

<script>
import ImageSlider from '~/components/ui/ImageSlider';
import BaseSpinner from '~/components/ui/BaseSpinner';

export default {
  components: {
    ImageSlider,
    BaseSpinner,
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

  data() {
    return {
      isLoading: false,
    };
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
    openForm() {
      this.$store.commit('dialog/setBuyerFormData', {
        saleId: this.saleId,
        productId: this.product._id,
        buyerName: this.buyerName,
        buyerEmail: this.buyerEmail,
        buyerPhone: this.buyerPhone,
      });
      this.$store.commit('dialog/setBuyerFormIsShown', true);
    },

    async book() {
      if (!this.buyerName || !this.buyerEmail) {
        this.openForm();
        return;
      }

      const buyer = {
        saleId: this.saleId,
        productId: this.product._id,
        name: this.buyerName,
        email: this.buyerEmail,
        phone: this.buyerPhone,
      };

      this.isLoading = true;
      const data = await this.$store.dispatch('product/saveBuyer', buyer);
      this.isLoading = false;

      if (data?.status === 202) {
        this.$store.commit('dialog/setBookingWarning', true);
      }
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
  position: relative;
  min-width: 200px;
}

@media (min-width: 768px) {
  .btn-container {
    text-align: right;
  }
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

@media (min-width: 768px) {
  .prod__txt {
    padding-right: 16px;
  }
}

.prod__buyer {
  min-width: 200px;
}
</style>
