<template>
  <div class="menu-button-container" @click="open">
    <div class="menu-button-inner">
      <div class="menu-button" :class="{ 'is-open': externalState, }" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    externalState: {
      type: Boolean,
      required: true,
      default: false,
    }
  },

  emits: ['open'],

  methods: {
    open() {
      this.$emit('open');
    }
  },
};
</script>

<style scoped>
.menu-button-container {
  display: flex;
  align-items: center;
  height: 30px;
  width: 30px;
  cursor: pointer;
}

.menu-button-inner {
  position: relative;
  height: 4px;
}

.menu-button,
.menu-button::before,
.menu-button::after {
  display: block;
  background-color: #000;
  position: absolute;
  height: 4px;
  width: 30px;
  transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 2px;
}

.is-open.menu-button {
  background: rgb(0 0 0 / 0%);
}

.menu-button::before {
  content: "";
  margin-top: -8px;
}

.is-open.menu-button::before {
  margin-top: 0;
  transform: rotate(405deg);
}

.menu-button::after {
  content: "";
  margin-top: 8px;
}

.is-open.menu-button::after {
  margin-top: 0;
  transform: rotate(-405deg);
}

@media (min-width: 1024px) {
  .menu-button-container {
    display: none;
  }
}
</style>
