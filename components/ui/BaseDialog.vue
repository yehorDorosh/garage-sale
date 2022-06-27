<template>
  <dialog v-if="show" open>
    <slot />
    <base-button @click="close">
      Close
    </base-button>
  </dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>
