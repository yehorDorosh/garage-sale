<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          Product list editor.
        </h1>
      </section>
      <sale-form />
      <product-form-list />
    </article>
  </Fragment>
</template>

<script>
import ProductFormList from '~/components/product/ProductFormList.vue';
import SaleForm from '~/components/sale/SaleForm.vue';

export default {
  components: {
    ProductFormList,
    SaleForm
  },

  middleware: 'auth',

  async created() {
    await this.$store.dispatch('sale/fetchUserSales');
    await this.$store.dispatch('product/fetchUserProducts');
  },
};
</script>
