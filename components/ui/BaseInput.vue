<template>
  <div class="row">
    <label v-if="label" :for="id">{{ label }}</label>
    <input :id="id" v-bind="$attrs" @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>

<style scoped>
  input {
    width: 100%;
    box-sizing: border-box;
  }

  label {
    font-size: 0.8rem;
  }

  .row {
    margin-block: 8px;
  }
</style>
