<template>
  <Fragment>
    <h1>Garage sales</h1>
    <section>
      <sales-list />
    </section>
    <section>
      <button type="button" @click="testReq">
        test
      </button>
      <ul>
        <li v-for="item in testItems" :key="item._id">
          {{ item.testText }}
        </li>
      </ul>
      <form @submit.prevent="submitForm">
        <input v-model.trim="testInput" type="text">
        <button type="submit">
          submit
        </button>
      </form>
    </section>
  </Fragment>
</template>

<script>
import SalesList from '~/components/sale/SalesList';

export default {
  components: {
    SalesList
  },

  name: 'IndexPage',

  data() {
    return {
      testInput: 'some text',
      testItems: []
    };
  },

  methods: {
    async testReq() {
      try {
        const response = await fetch('http://localhost:3000/test');
        const data = await response.json();
        /* eslint no-console: "off" */
        console.log(data);
        this.testItems = data.items;
      } catch (error) {
        console.log(error);
      }
    },

    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/test-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            test: this.testInput
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>
