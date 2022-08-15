<template>
  <div class="row">
    <input
      :id="id"
      v-bind="$attrs"
      ref="checkbox"
      :class="{ invalid: isValid === false }"
      type="checkbox"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <label v-if="label" :for="id">{{ label }}</label>
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
    },
    value: {
      type: Boolean,
      required: true,
    }
  }
};
</script>

<style scoped>
  input {
    box-sizing: border-box;
  }

  label {
    font-size: 0.8rem;
  }

  .row {
    margin-block: 8px;
  }

  input.invalid {
    border-color: var(--error);
    outline-color: transparent;
  }

  .err {
    font-size: 0.5rem;
    color: var(--error);
    margin-top: 8px;
    margin-bottom: 0;
  }
</style>
