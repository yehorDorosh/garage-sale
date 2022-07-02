<template>
  <div>
    <h1>Helo world!</h1>
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
    <button @click="getUserData">
      get user data
    </button>
  </div>
</template>

<script>
export default {
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

    getUserData() {
      this.$store.dispatch('user/getUserData');
    }
  }
};
</script>
