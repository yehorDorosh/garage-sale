<template>
  <div>
    <h1>Helo world!</h1>
    <button type="button" @click="testReq">
      test
    </button>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  methods: {
    async testReq() {
      try {
        const response = await fetch('http://localhost:3000/test');
        const data = await response.json();
        /* eslint no-console: "off" */
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
