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
import openSocket from 'socket.io-client';

import salesList from '~/components/sale/SalesList';

export default {
  components: {
    salesList,
  },

  created() {
    const socket = openSocket(`${process.env.fullHostName}`);
    socket.on('sale', () => {
      this.$store.dispatch('sale/fetchSales');
    });
    socket.on('product', () => {
      this.$store.dispatch('sale/fetchSales');
    });
    socket.on('deletedUser', () => {
      this.$store.dispatch('sale/fetchSales');
    });
  },
};
</script>
