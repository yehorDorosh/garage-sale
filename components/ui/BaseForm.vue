<template>
  <form @submit.prevent="submit">
    <slot />
    <base-button type="submit">
      {{ btnTxt }}
    </base-button>
  </form>
</template>

<script>
export default {
  props: {
    btnTxt: {
      type: String,
      default: 'Submit'
    }
  },
  emits: ['form-submit'],
  methods: {
    submit(e) {
      this.$emit('form-submit', e);
    }
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
