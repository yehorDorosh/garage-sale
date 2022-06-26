<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <TheHeader />
    <div class="wrap">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';

export default {
  components: {
    TheHeader,
  },
};
</script>
