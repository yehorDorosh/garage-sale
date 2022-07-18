<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          Last sales
        </h1>
      </section>
      <sales-list />
    </article>
  </Fragment>
</template>

<script>
import salesList from '~/components/sale/SalesList';

export default {
  components: {
    salesList,
  },

  data() {
    return {

    };
  },
};
</script>
