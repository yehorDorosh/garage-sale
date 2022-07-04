<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          Product list editor.
        </h1>
      </section>
      <product-form-list />
    </article>
  </Fragment>
</template>

<script>
import ProductFormList from '~/components/product/ProductFormList.vue';

export default {
  components: {
    ProductFormList
  },

  middleware: 'auth',

  data() {
    return {

    };
  },
};
</script>
