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
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 12px;
    background-color: transparent;
    cursor: pointer;
  }

  .left {
    transform: rotate(135deg);
  }

  .right {
    transform: rotate(-45deg);
  }

  .up {
    transform: rotate(-135deg);
  }

  .down {
    transform: rotate(45deg);
  }
</style>
