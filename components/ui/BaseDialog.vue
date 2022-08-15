<template>
  <Fragment>
    <div v-if="show" class="backdrop" @click="close" />
    <transition name="dialog">
      <dialog v-if="show" open>
        <button v-if="cross" class="cross" @click="close" />
        <div>
          <slot />
        </div>
        <base-button v-if="!cross" @click="close">
          Close
        </base-button>
      </dialog>
    </transition>
  </Fragment>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    cross: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
dialog {
  position: fixed;
  z-index: 99;
  top: 100px;
  border-radius: 24px;
  text-align: center;
  padding: 24px;
  border: none;
}

@media (min-width: 768) {
  dialog {
    border-radius: 32px;
    padding: 32px;
  }
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 98;
  background-color: var(--bg-drop);
  opacity: 0.6;
}

.dialog-enter,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

.cross {
  position: absolute;
  top: 12px;
  right: 12px;
  height: 16px;
  width: 16px;
  opacity: 0.3;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  display: block;
}

.cross:hover {
  opacity: 1;
}

.cross::before,
.cross::after {
  position: absolute;
  top: 0;
  left: 7px;
  content: " ";
  height: 17px;
  width: 2px;
  background-color: var(--cross);
}

.cross::before {
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}
</style>
