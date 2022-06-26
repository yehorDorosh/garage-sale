<template>
  <header>
    <div class="wrap container">
      <a href="#">
        <img src="/favicon.ico">
      </a>
      <nav>
        <ul>
          <li>
            <span>Menu item 1</span>
          </li>
          <li>
            <span>Menu item 2</span>
          </li>
        </ul>
      </nav>
      <div>
        <base-button>
          Sign In
        </base-button>
      </div>
    </div>
  </header>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton';

export default {
  components: {
    BaseButton
  }
};
</script>

<style scoped>
  header {
    padding: 16px;
    box-shadow: 0 1px 8px 2px lightgray;
  }

  .container {
    align-items: center;
  }

  nav {
    padding: 0 16px;
  }

  nav ul {
    display: flex;
    justify-content: space-between;
  }

  nav li {
    padding: 8px;
  }
</style>
