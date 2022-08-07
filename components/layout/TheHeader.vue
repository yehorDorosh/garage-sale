<template>
  <header>
    <div class="wrap container">
      <router-link to="/">
        <img src="/favicon.ico">
      </router-link>
      <the-burger :external-state="menuIsShown" @open="burgerHandler" />
      <div ref="menu" class="menu-container animation" :class="{ 'is-open': menuIsShown }" @click="menuHandler">
        <nav>
          <ul>
            <li>
              <router-link to="/sales">
                Sales
              </router-link>
            </li>
            <li v-if="isAuth">
              <router-link to="/sale-editor">
                My sale
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="cta-block">
          <base-button v-if="!isAuth" @click="$store.commit('dialog/setRegIsShown', true)">
            Signup
          </base-button>
          <base-button v-if="!isAuth" @click="$store.commit('dialog/setLoginIsShown', true)">
            Login
          </base-button>
          <base-button v-if="isAuth" @click="logout">
            Logout
          </base-button>
          <base-button v-if="isAuth" :link="true" to="/user">
            {{ userName }}
          </base-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import TheBurger from '~/components/ui/TheBurger.vue';

export default {
  components: {
    TheBurger,
  },

  data() {
    return {
      regIsShown: false,
      popupIsShown: false,
      loginIsShown: false,
      menuIsShown: false,
    };
  },

  computed: {
    isAuth() {
      return this.$store.getters['user/isAuth'];
    },

    userName() {
      return this.$store.getters['user/getUserName'];
    }
  },

  mounted() {
    let timer;
    const menu = this.$refs.menu;
    if (!menu) { return; }
    window.addEventListener('resize', () => {
      menu.classList.remove('animation');
      clearTimeout(timer);
      timer = setTimeout(() => {
        menu.classList.add('animation');
      }, 0);
    });
  },

  methods: {
    logout() {
      this.$router.push('/');
      this.$store.dispatch('user/logout');
    },

    burgerHandler() {
      this.menuIsShown = !this.menuIsShown;

      if (this.menuIsShown) {
        document.body.classList.add('stop-scrolling');
      } else {
        document.body.classList.remove('stop-scrolling');
      }
    },

    menuHandler() {
      this.menuIsShown = false;
      document.body.classList.remove('stop-scrolling');
    }
  }
};
</script>

<style scoped>
  header {
    box-shadow: 0 1px 8px 2px lightgray;
    position: sticky;
    top: 0;
    z-index: 5;
    background-color: white;
  }

  .container {
    align-items: center;
    padding-block: 16px;
  }

  .animation {
    transition: transform 300ms ease-out;
  }

  .menu-container {
    position: fixed;
    inset: 0;
    top: 85px;
    background-color: #fff;
    z-index: 10;
    transform: translateX(100vw);
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 1024px) {
    .menu-container {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
      padding-left: 15%;
      position: static;
      transform: translateX(0);
      transition: none;
    }
  }

  .menu-container.is-open {
    transform: translateX(0);
  }

  nav {
    padding: 0 16px;
    order: 1;
  }

  @media (min-width: 1024px) {
    nav {
      order: 0;
    }
  }

  @media (min-width: 1024px) {
    nav ul {
      display: flex;
      justify-content: space-between;
    }
  }

  nav li {
    padding: 8px;
    border-bottom: solid 1px lightgray;
  }

  @media (min-width: 1024px) {
    nav li {
      border-bottom: none;
    }
  }

  nav a {
    text-decoration: none;
    color: var(--accent);
    transition: color 300ms;
  }

  nav a:hover {
    color: var(--accent-hover);
  }

  nav a.nuxt-link-active {
    text-decoration: underline;
  }

  .cta-block {
    display: flex;
    justify-content: space-between;
  }
</style>
