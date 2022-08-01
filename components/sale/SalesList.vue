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
  </section>
</template>

<script>
import BaseCarusel from '~/components/ui/BaseCarusel.vue';
export default {
  components: {
    BaseCarusel
  },

  computed: {
    sales() {
      return this.$store.getters['sale/getSales'];
    },
  },

  async created() {
    await this.$store.dispatch('sale/fetchSales');
  },

  methods: {
    openSale(id) {
      this.$router.push({ path: `/sales/${id}` });
    },
    prevent(e) {
      e.preventDefault();
    },
  },
};
</script>

<style scoped>
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
</style>
