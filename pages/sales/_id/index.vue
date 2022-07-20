<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          {{ sale.description }}
        </h1>
        <p>
          <span>
            Author: {{ userName }},
          </span>
          <span>
            Date: {{ date }}
          </span>
        </p>
      </section>
      <product-list :products="sale.products" />
    </article>
  </Fragment>
</template>

<script>
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

  data() {
    return {

    };
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
    sale() {
      return this.$store.getters['sale/getSaleById'](this.id);
    },
    userName() {
      return this.sale.owner.name;
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
};
</script>
