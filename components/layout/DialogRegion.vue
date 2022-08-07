<template>
  <div>
    <base-dialog :show="regIsShown" :cross="true" @close="$store.commit('dialog/setRegIsShown', false)">
      <reg-form @reg-compleated="regIsSuccessfull" />
    </base-dialog>
    <base-dialog :show="regMsgIsShown" @close="closeRegMsgIsShown">
      <p>
        The registration completed successfully!
      </p>
    </base-dialog>
    <base-dialog :show="loginIsShown" :cross="true" @close="$store.commit('dialog/setLoginIsShown', false)">
      <login-form @login-compleated="$store.commit('dialog/setLoginIsShown', false)" />
    </base-dialog>
  </div>
</template>

<script>
import RegForm from '~/components/user/RegForm';
import LoginForm from '~/components/user/LoginForm';
import BaseDialog from '~/components/ui/BaseDialog.vue';

export default {
  components: {
    RegForm,
    LoginForm,
    BaseDialog,
  },

  computed: {
    regIsShown() {
      return this.$store.getters['dialog/getRegIsShown'];
    },
    regMsgIsShown() {
      return this.$store.getters['dialog/getRegMsgIsShown'];
    },
    loginIsShown() {
      return this.$store.getters['dialog/getLoginIsShown'];
    },
  },

  methods: {
    regIsSuccessfull() {
      this.$store.commit('dialog/setRegIsShown', false);
      this.$store.commit('dialog/setRegMsgIsShown', true);
    },
    closeRegMsgIsShown() {
      this.$store.commit('dialog/setRegMsgIsShown', false);
      this.$router.push('/sale-editor');
    }
  },
};
</script>
