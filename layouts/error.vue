<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </Fragment>
</template>

<script>

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
};
</script>
