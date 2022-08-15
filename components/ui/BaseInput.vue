<template>
  <div class="row">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      v-if="!textArea"
      :id="id"
      v-bind="$attrs"
      ref="input"
      :class="{ invalid: isValid === false }"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      @keydown.enter="$emit('keydown', $event)"
    >
    <textarea
      v-else
      :id="id"
      ref="input"
      v-bind="$attrs"
      type="text"
      :class="{ invalid: isValid === false }"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      @keydown.enter="$emit('keydown', $event)"
    />
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
      default: '',
    },
    isValid: {
      type: Boolean,
      required: false,
      default: null,
    },
    errMsg: {
      type: String,
      required: false,
      default: '',
    },
    textArea: {
      type: Boolean,
      default: false,
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
    border-color: var(--error);
    outline-color: transparent;
  }

  .err {
    font-size: 0.5rem;
    color: var(--error);
    margin-top: 8px;
    margin-bottom: 0;
  }

  textarea {
    width: 100% !important;
    box-sizing: border-box;
    resize: none;
    overflow-y: scroll;
    min-height: 50px;
  }
</style>
