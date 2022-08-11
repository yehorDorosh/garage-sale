<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <the-header />
    <div class="wrap">
      <Nuxt />
    </div>
    <the-footer />
    <dialog-region />
  </Fragment>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';
import DialogRegion from '@/components/layout/DialogRegion.vue';
import TheFooter from '@/components/layout/TheFooter.vue';

export default {
  components: {
    TheHeader,
    DialogRegion,
    TheFooter,
  },
};
</script>
