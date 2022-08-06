<template>
  <header>
    <div class="wrap container">
      <router-link to="/">
        <img src="/favicon.ico">
      </router-link>
      <the-burger :external-state="menuIsShown" @open="burgerHandler" />
      <div class="menu-container" :class="{ 'is-open': menuIsShown }" @click="menuHandler">
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
          <base-button v-if="!isAuth" @click="openReg">
            Signup
          </base-button>
          <base-button v-if="!isAuth" @click="openLogin">
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
    <base-dialog :show="regIsShown" :cross="true" @close="closeReg">
      <reg-form @reg-compleated="regIsSuccessfull" />
    </base-dialog>
    <base-dialog :show="popupIsShown" @close="closePopup">
      <p>
        The registration completed successfully!
      </p>
    </base-dialog>
    <base-dialog :show="loginIsShown" :cross="true" @close="closeLogin">
      <login-form @login-compleated="closeLogin" />
    </base-dialog>
  </header>
</template>

<script>
import RegForm from '~/components/user/RegForm';
import LoginForm from '~/components/user/LoginForm';
import BaseDialog from '~/components/ui/BaseDialog.vue';
import TheBurger from '~/components/ui/TheBurger.vue';

export default {
  components: {
    RegForm,
    LoginForm,
    BaseDialog,
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

  methods: {
    openReg() {
      this.regIsShown = true;
    },

    closeReg() {
      this.regIsShown = false;
    },

    closePopup() {
      this.popupIsShown = false;
      this.$router.push('/sale-editor');
    },

    regIsSuccessfull() {
      this.closeReg();
      this.popupIsShown = true;
    },

    logout() {
      this.$router.push('/');
      this.$store.dispatch('user/logout');
    },

    openLogin() {
      this.loginIsShown = true;
    },

    closeLogin() {
      this.loginIsShown = false;
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
  }

  .container {
    align-items: center;
    padding-block: 16px;
  }

  .menu-container {
    position: fixed;
    inset: 0;
    top: 85px;
    background-color: #fff;
    z-index: 10;
    transform: translateX(100vw);
    transition: transform 300ms ease-out;
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

  .cta-block {
    display: flex;
    justify-content: space-between;
  }
</style>
