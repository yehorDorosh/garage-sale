<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          {{ userName }} sale
        </h1>
      </section>
    </article>
  </Fragment>
</template>

<script>

export default {
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
  },
};
</script>
