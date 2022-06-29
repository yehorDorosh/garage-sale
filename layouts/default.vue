<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <TheHeader />
    <div class="wrap">
      <Nuxt />
    </div>
  </Fragment>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';

export default {
  components: {
    TheHeader,
  },
};
</script>
