<template>
  <base-form btn-txt="Create account" @form-submit="submit">
    <base-input
      id="name-input"
      v-model.trim="name.value"
      :is-valid="name.isValid"
      :err-msg="name.errMsg"
      type="text"
      label="Name"
      placeholder="Name"
    />
    <base-input
      id="email-input"
      v-model.trim="email.value"
      :is-valid="email.isValid"
      :err-msg="email.errMsg"
      type="email"
      label="Email"
      placeholder="user@email.com"
    />
    <base-input
      id="pass-input"
      v-model.trim="password.value"
      :is-valid="password.isValid"
      :err-msg="password.errMsg"
      type="password"
      label="Password"
      placeholder="******"
    />
    <base-input
      id="pass-repeat-input"
      v-model.trim="passwordConfirmation.value"
      :is-valid="passwordConfirmation.isValid"
      :err-msg="passwordConfirmation.errMsg"
      type="password"
      label="Repeat password"
      placeholder="******"
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
  data() {
    return {
      name: {
        value: '',
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      email: {
        value: '',
        isValid: null,
        errMsg: 'Please enter a valid email.',
      },
      password: {
        value: '',
        isValid: null,
        errMsg: 'Password should contain at least 8 symbols. At least one char in upper case and at least 1 number.'
      },
      passwordConfirmation: {
        value: '',
        isValid: null,
        errMsg: 'Passwords must match.'
      },
    };
  },
  methods: {
    async submit() {
      const userData = {
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
        passwordConfirmation: this.passwordConfirmation.value,
      };

      await this.$store.dispatch('user/userReg', userData);
      const res = this.$store.getters['user/response'];
      if (res.status === 422) {
        res.data.forEach((err) => {
          if (this[err.param]) {
            this[err.param].isValid = false;
            this[err.param].errMsg = err.msg;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
form {
  text-align: left;
}
</style>
