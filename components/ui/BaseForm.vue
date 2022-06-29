<template>
  <form @submit.prevent="submitCB">
    <slot />
    <base-button type="submit">
      {{ btnTxt }}
    </base-button>
  </form>
</template>

<script>
export default {
  props: {
    submitCb: {
      type: Function,
      required: true
    },
    btnTxt: {
      type: String,
      default: 'Submit'
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
