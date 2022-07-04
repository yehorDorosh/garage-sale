<template>
  <header>
    <div class="wrap container">
      <router-link to="/">
        <img src="/favicon.ico">
      </router-link>
      <nav>
        <ul>
          <li v-if="isAuth">
            <router-link to="/sale-editor">
              My sale
            </router-link>
          </li>
          <li>
            <span>Menu item 2</span>
          </li>
        </ul>
      </nav>
      <div>
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

export default {
  components: {
    RegForm,
    LoginForm,
    BaseDialog
  },

  data() {
    return {
      regIsShown: false,
      popupIsShown: false,
      loginIsShown: false
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
