<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <base-button link to="/sales" mode="link">
          Sales
        </base-button>
        <span>
          > {{ sale.description }}
        </span>
      </section>
      <section>
        <h1>
          {{ sale.description }}
        </h1>
        <p class="subline">
          <span>
            Author: {{ user.name }},
          </span>
          <span>
            Date: {{ date }}
          </span>
        </p>
        <p>
          Contact with
          <span>
            {{ user.name }}
          </span>
        </p>
        <p>
          email: {{ user.email }}
        </p>
        <p v-if="user.phone && user.phone.number">
          phone: {{ user.phone.number }}
          <span v-if="user.phone.whatsApp" class="ico ico--whatsapp" />
          <span v-if="user.phone.viber" class="ico ico--viber" />
          <span v-if="user.phone.telegram" class="ico ico--telegram" />
        </p>
      </section>
      <product-list :products="sale.products" />
    </article>
  </Fragment>
</template>

<script>
import openSocket from 'socket.io-client';
import ProductList from '~/components/product/ProductList';

export default {
  components: {
    ProductList
  },

  async validate(data) {
    if (!data.store.getters['sale/getSales'].length) {
      await data.store.dispatch('sale/fetchSales');
    }
    const salesIDs = data.store.getters['sale/getSalesIDs'];
    return salesIDs.includes(data.params.id);
  },

  scrollToTop: false,

  computed: {
    id() {
      return this.$route.params.id;
    },
    sale() {
      return this.$store.getters['sale/getSaleById'](this.id);
    },
    user() {
      return this.sale.owner;
    },
    date() {
      const date = new Date(this.sale.updatedAt);
      const locale = this.$store.getters.getLocale;
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleDateString(locale, options);
    },
  },

  created() {
    const socket = openSocket(`${process.env.fullHostName}`);
    socket.on('booking', (buyer) => {
      this.$store.commit('sale/setBuyer', buyer);
    });
    socket.on('product', () => {
      this.$store.dispatch('sale/fetchSales');
    });
    socket.on('deletedUser', () => {
      this.$store.dispatch('sale/fetchSales');
      this.$router.push('/sales');
    });
  },
};
</script>

<style scoped>
.subline {
  color: var(--light);
  font-size: 0.8rem;
}
</style>
