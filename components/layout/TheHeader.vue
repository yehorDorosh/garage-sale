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
        <base-button @click="openReg">
          Sign In
        </base-button>
      </div>
    </div>
    <base-dialog :show="regIsShown" :cross="true" @close="closeReg">
      <reg-form @reg-compleated="regIsSuccessfull" />
    </base-dialog>
    <base-dialog :show="popupIsShown" @close="closePopup">
      The registration completed successfully!
    </base-dialog>
  </header>
</template>

<script>
import RegForm from '~/components/user/RegForm';
import BaseDialog from '~/components/ui/BaseDialog.vue';

export default {
  components: {
    RegForm,
    BaseDialog,
  },

  data() {
    return {
      regIsShown: false,
      popupIsShown: false,
    };
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
    }
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
