<template>
  <section>
    <ul class="sale-list">
      <li v-for="sale in sales" :key="sale._id" class="card sale-item">
        <a :to="`/sales/${sale._id}`" class="sale-item__link" @click="prevent($event)">
          <div class="sale-item__info">
            <h4 class="sale-item__title">
              {{ sale.description }}
            </h4>
            <p class="sale-item__author">
              Author: {{ sale.owner.name }}
            </p>
          </div>
          <div class="sale-item__products">
            <base-carusel :slide-amount="[2, 4, 6, 8]" @open="openSale(sale._id)">
              <div v-for="product in sale.products" :key="product._id" class="sale-item__product">
                <h5 class="sale-item__product-title">
                  {{ product.title }}
                </h5>
                <img :src="product.images[0].preview" :alt="product.images[0].alt" class="sale-item__img">
              </div>
            </base-carusel>
          </div>
        </a>
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
      @getData="updSales"
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
      isLoading: false
    };
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

  async created() {
    this.isLoading = true;
    await this.$store.dispatch('sale/fetchSales');
    this.isLoading = false;
  },

  methods: {
    openSale(id) {
      this.$router.push({ path: `/sales/${id}` });
    },
    prevent(e) {
      e.preventDefault();
    },
    async updSales(page) {
      this.isLoading = true;
      await this.$store.dispatch('sale/fetchSales', { page });
      this.isLoading = false;
    }
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
  }

  .sale-item__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
  }

  .sale-item__title {
    margin: 0;
  }

  .sale-item__author {
    margin: 0;
    font-size: 0.7rem;
    color: lightgrey;
  }

  .sale-item__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sale-item__product-title {
    margin: 0;
    padding-bottom: 8px;
    text-align: center;
  }

  .view-more {
    text-align: center;
  }
</style>
