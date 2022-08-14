<template>
  <section>
    <ul class="sale-list">
      <li v-for="sale in sales" :key="sale._id" class="card sale-item">
        <nuxt-link class="sale-item__info" :to="`/sales/${sale._id}`">
          <h4 class="sale-item__title">
            {{ sale.description }}
          </h4>
          <p class="sale-item__author">
            Author: {{ sale.owner.name }}
          </p>
        </nuxt-link>
        <div class="sale-item__products">
          <base-carusel :key="sale.products.length" :slide-amount="[1, 2, 4, 6]" @open="openSlide">
            <div v-for="product in sale.products" :key="product._id" class="sale-item__product carusel__item" :data-sale-id="sale._id">
              <div class="sale-item__card">
                <h5 class="sale-item__product-title">
                  {{ product.title }}
                </h5>
                <div class="sale-item__img-container">
                  <img :src="product.images[0].preview" :alt="product.images[0].alt" class="sale-item__img">
                </div>
                <p v-if="product.price === 0" class="sale-item__product-price sale-item__product-price--free">
                  It's FREE!!!
                </p>
                <p v-else class="sale-item__product-price">
                  {{ new Intl.NumberFormat($store.getters.getLocale, { style: 'currency', currency: 'EUR' }).format(product.price) }}
                </p>
              </div>
            </div>
          </base-carusel>
        </div>
      </li>
    </ul>
    <div v-if="allSales.length > 3 && previewMode" class="view-more">
      <base-button :link="true" to="/sales">
        View more
      </base-button>
    </div>
    <base-pagginator
      v-else-if="!previewMode"
      :total-amount="salesAmount"
      :per-page="10"
      :is-loading="isLoading"
      path="api-sales"
      :rest-api="true"
    />
    <base-spinner :is-loading="isLoading" />
  </section>
</template>

<script>
import BaseCarusel from '~/components/ui/BaseCarusel.vue';
import BasePagginator from '~/components/ui/BasePagginator.vue';
import BaseSpinner from '~/components/ui/BaseSpinner.vue';

export default {
  components: {
    BaseCarusel,
    BasePagginator,
    BaseSpinner,
  },

  props: {
    previewMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLoading: false,
    };
  },

  async fetch() {
    const page = this.$route.query.page || 1;
    this.isLoading = true;
    await this.$store.dispatch('sale/fetchSales', { page });
    this.isLoading = false;
  },

  computed: {
    sales() {
      const salesList = this.$store.getters['sale/getSales'];
      const previewList = salesList.slice(0, 3);
      if (this.previewMode) {
        return previewList;
      }
      return salesList;
    },
    salesAmount() {
      return this.$store.getters['sale/getSalesAmount'];
    },
    allSales() {
      return this.$store.getters['sale/getSales'];
    },
  },

  watch: {
    '$route.query': '$fetch'
  },

  methods: {
    openSlide(e, i) {
      this.$router.push({ path: `/sales/${e.currentTarget.dataset.saleId}`, hash: `#id=${i}` });
    },
  },
};
</script>

<style scoped>
  section {
    position: relative;
  }

  .sale-item__link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .sale-item__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    color: inherit;
    text-decoration: none;
  }

  .sale-item__title {
    margin: 0;
  }

  .sale-item__author {
    margin: 0;
    font-size: 0.7rem;
    color: lightgrey;
  }

  .carusel__item {
    padding: 3px;
  }

  .sale-item__card {
    box-shadow: 0 0 4px 1px lightgray;
    padding: 8px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sale-item__img-container {
    overflow: hidden;
  }

  .sale-item__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sale-item__product-title {
    margin: 0;
    padding-bottom: 4px;
    text-align: center;
    font-weight: 400;
  }

  .sale-item__product-price {
    padding-top: 4px;
    text-align: center;
    font-weight: 400;
    font-size: 0.6rem;
  }

  .sale-item__product-price--free {
    color: var(--accent);
  }

  .view-more {
    text-align: center;
  }
</style>
