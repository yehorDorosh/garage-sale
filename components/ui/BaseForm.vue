<template>
  <form v-bind="$attrs" @submit.prevent="submit">
    <slot />
    <base-button v-if="!noSubmitBtn" type="submit">
      {{ btnTxt }}
    </base-button>
    <base-spinner :is-loading="isLoading" />
  </form>
</template>

<script>
import BaseSpinner from '~/components/ui/BaseSpinner';

export default {
  components: {
    BaseSpinner,
  },

  props: {
    btnTxt: {
      type: String,
      default: 'Submit',
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    },
    noSubmitBtn: {
      type: Boolean,
      required: false,
      default: false,
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
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
