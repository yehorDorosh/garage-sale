<template>
  <section>
    <ul class="sale-list">
      <li v-for="sale in sales" :key="sale._id" class="card sale-item">
        <nuxt-link :to="`/sales/${sale._id}`" class="sale-item__link">
          <div class="sale-item__info">
            <h4 class="sale-item__title">
              {{ sale.description }}
            </h4>
            <p class="sale-item__author">
              Author: {{ sale.owner.name }}
            </p>
          </div>
          <div class="sale-item__products">
            <div v-for="product in sale.products" :key="product._id" class="sale-item__product">
              <img :src="product.images[0].path" :alt="product.images[0].alt" class="sale-item__img">
              <h5 class="sale-item__product-title">
                {{ product.title }}
              </h5>
            </div>
          </div>
        </nuxt-link>
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

  async created() {
    await this.$store.dispatch('sale/fetchSales');
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

  .sale-item__products {
    display: flex;
  }

  .sale-item__product {
    padding: 8px;
  }

  .sale-item__img {
    widows: 100px;
    height: 100px;
    display: block;
  }

  .sale-item__product-title {
    margin: 8px 0 0;
    text-align: center;
  }
</style>
