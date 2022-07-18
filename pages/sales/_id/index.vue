<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <article>
      <section>
        <h1>
          {{ userName }} sale
        </h1>
      </section>
    </article>
  </Fragment>
</template>

<script>

export default {
  data() {
    return {

    };
  },

  computed: {
    userName() {
      return 'Egor';
    },
  },
};
</script>
