<template>
  <base-form btn-txt="Login" :is-loading="isLoading" @form-submit="submit">
    <base-input
      id="email-input"
      v-model.trim="email.value"
      :is-valid="email.isValid"
      :err-msg="email.errMsg"
      type="email"
      label="Email"
      placeholder="user@email.com"
      @input="emailValidation"
      @blur="emailTouch"
    />
    <base-input
      id="pass-input"
      v-model.trim="password.value"
      :is-valid="password.isValid"
      :err-msg="password.errMsg"
      type="password"
      label="Password"
      placeholder="******"
      @input="passwordValidation"
      @blur="passwordTouch"
    />
  </base-form>
</template>

<script>
import BaseForm from '~/components/ui/BaseForm';
import BaseInput from '~/components/ui/BaseInput';

export default {
  components: {
    BaseForm,
    BaseInput,
  },

  emits: ['login-compleated'],

  data() {
    return {
      email: {
        value: '',
        isValid: null,
        errMsg: 'This field shouldn\'t be empty',
        touched: false,
      },
      password: {
        value: '',
        isValid: null,
        errMsg: 'This field shouldn\'t be empty',
        touched: false,
      },
      isLoading: false,
    };
  },

  methods: {
    emailValidation(value) {
      if (!this.email.touched) { return; }
      const isValid = String(value).trim().length;
      if (!isValid) {
        this.email.isValid = false;
      } else {
        this.email.isValid = true;
      }
    },

    passwordValidation(value) {
      if (!this.password.touched) { return; }
      const isValid = String(value).trim().length;
      if (!isValid) {
        this.password.isValid = false;
      } else {
        this.password.isValid = true;
      }
    },

    emailTouch(value) {
      this.email.touched = true;
      this.emailValidation(value);
    },

    passwordTouch(value) {
      this.password.touched = true;
      this.passwordValidation(value);
    },

    async submit() {
      this.emailTouch(this.email.value);
      this.passwordTouch(this.password.value);

      if (!this.email.isValid || !this.password.isValid) { return; }

      const userData = {
        email: this.email.value,
        password: this.password.value,
      };

      this.isLoading = true;
      await this.$store.dispatch('user/userReg', userData);
      this.isLoading = false;

      const res = this.$store.getters['user/response'];
      if (res.status === 422) {
        res.data.forEach((err) => {
          if (this[err.param]) {
            this[err.param].isValid = false;
            this[err.param].errMsg = err.msg;
          }
        });
      }

      if (res.status === 200 || res.status === 201) {
        this.$emit('login-compleated');
      }
    },
  },
};
</script>

<style scoped>
form {
  text-align: left;
  width: 260px;
}
</style>
