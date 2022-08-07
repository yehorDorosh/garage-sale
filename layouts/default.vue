<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <TheHeader />
    <div class="wrap">
      <Nuxt />
    </div>
    <dialog-region />
  </Fragment>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';
import DialogRegion from '@/components/layout/DialogRegion.vue';

export default {
  components: {
    TheHeader,
    DialogRegion,
  },
};
</script>
