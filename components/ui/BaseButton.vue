<template>
  <button v-if="!link" :class="mode" :type="type" v-on="$listeners">
    <slot />
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    },
    type: {
      type: String,
      required: false,
      default: 'button'
    }
  }
};
</script>

<style scoped>
  button,
  a {
    text-decoration: none;
    padding: 8px 16px;
    font: inherit;
    background-color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 32px;
    color: var(--accent-txt);
    cursor: pointer;
    margin: 8px;
    display: inline-block;
    transition: background-color, color, border-color, 300ms linear;
  }

  a:hover,
  a:active,
  button:hover,
  button:active {
    background-color: var(--accent-hover);
    color: var(--accent-hover-txt);
    border-color: var(--accent-hover);
  }

  .flat {
    background-color: transparent;
    border: none;
    color: var(--accent);
  }
</style>
