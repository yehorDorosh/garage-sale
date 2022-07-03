<template>
  <div class="row">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      ref="input"
      :class="{ invalid: isValid === false }"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      @keydown.enter="$emit('keydown', $event)"
    >
    <p v-if="isValid === false" class="err">
      {{ errMsg }}
    </p>
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
    },
    isValid: {
      type: Boolean,
      required: false,
      default: null
    },
    errMsg: {
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

  input.invalid {
    border-color: red;
    outline-color: transparent;
  }

  .err {
    font-size: 0.5rem;
    color: red;
    margin-top: 8px;
    margin-bottom: 0;
  }
</style>
