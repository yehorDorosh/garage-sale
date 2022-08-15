<template>
  <button v-if="!link && !externalLink" v-bind="$attrs" :class="mode" :type="type" v-on="$listeners">
    <slot />
  </button>
  <a
    v-else-if="externalLink"
    :href="to"
    :class="mode"
    v-bind="$attrs"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <nuxt-link v-else :to="to" v-bind="$attrs" :class="mode">
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: 'button'
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    externalLink: {
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
  .button {
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

  .button:hover,
  .button:active {
    background-color: var(--accent-hover);
    color: var(--accent-hover-txt);
    border-color: var(--accent-hover);
  }

  .button.red {
    background-color: var(--danger);
    border-radius: 0;
  }

  .button.sm {
    padding: 4px 8px;
    font-size: 0.8rem;
  }

  .blank {
    display: inline-block;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .link {
    text-decoration: underline;
    color: var(--accent);
  }

  .arrow {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%237952B3' d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z'/%3E%3C/svg%3E");
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;
    padding: 0;
    border: none;
    min-width: 8px;
    min-height: 8px;
    cursor: pointer;
  }

  .arrow.right {
    transform: rotate(0deg);
  }

  .arrow.left {
    transform: rotate(-180deg);
  }

  .arrow.up {
    transform: rotate(-90deg);
  }

  .arrow.down {
    transform: rotate(90deg);
  }
</style>
