<template>
  <footer>
    <div class="wrap">
      <div class="footer-inner">
        <p>
          © {{ year }}, Garage sale
        </p>
        <address>
          Email: <a :href="`mailto:${email}`">{{ email }}</a>
        </address>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
    email() {
      return this.$store.getters.getSiteEmail;
    }
  }
};
</script>

<style scoped>
.footer-inner {
  padding: 64px 0;
  border-top: 1px solid var(--light);
  font-size: 0.8rem;
  color: var(--light);
}

address a {
  color: var(--light);
}
</style>
