<template>
  <div v-if="isLoading" class="dropdown">
    <div class="lds-hourglass" />
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  }
};
</script>

<style scoped>
.dropdown {
  background-color: var(--spinner-dropdown);
  opacity: 0.8;
  position: absolute;
  inset: 0;
  border-radius: 32px;
  margin: -8px;
}

.lds-hourglass {
  display: inline-block;
  position: absolute;
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lds-hourglass::after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid var(--spinner);
  border-block-color: var(--spinner);
  border-inline-color: transparent;
  animation: lds-hourglass 1.2s infinite;
}

@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  100% {
    transform: rotate(1800deg);
  }
}
</style>
