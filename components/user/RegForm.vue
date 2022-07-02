<template>
  <base-form btn-txt="Create account" :is-loading="isLoading" @form-submit="submit">
    <base-input
      id="name-input"
      v-model.trim="name.value"
      :is-valid="name.isValid"
      :err-msg="name.errMsg"
      type="text"
      label="Name"
      placeholder="Name"
      @input="nameValidation"
      @blur="nameTouch"
    />
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
    <base-input
      id="pass-repeat-input"
      v-model.trim="passwordConfirmation.value"
      :is-valid="passwordConfirmation.isValid"
      :err-msg="passwordConfirmation.errMsg"
      type="password"
      label="Repeat password"
      placeholder="******"
      @input="passwordConfValidation"
      @blur="passwordConfTouch"
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

  emits: ['reg-compleated'],

  data() {
    return {
      name: {
        value: '',
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
        touched: false,
      },
      email: {
        value: '',
        isValid: null,
        errMsg: 'Please enter a valid email.',
        touched: false,
      },
      password: {
        value: '',
        isValid: null,
        errMsg: 'Password should contain at least 8 symbols. At least one char in upper case and at least 1 number.',
        touched: false,
      },
      passwordConfirmation: {
        value: '',
        isValid: null,
        errMsg: 'Passwords must match.',
        touched: false,
      },
      isLoading: false,
    };
  },

  methods: {
    nameValidation(value) {
      if (!this.name.touched) { return; }
      const isValid = String(value).trim().length;
      if (!isValid) {
        this.name.isValid = false;
      } else {
        this.name.isValid = true;
      }
    },

    emailValidation(value) {
      if (!this.email.touched) { return; }
      const isValid = String(value).trim().toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (!isValid) {
        this.email.isValid = false;
      } else {
        this.email.isValid = true;
      }
    },

    passwordValidation(value) {
      if (!this.password.touched) { return; }
      const isValid = String(value).trim().match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      );
      if (!isValid) {
        this.password.isValid = false;
      } else {
        this.password.isValid = true;
      }
    },

    passwordConfValidation(value) {
      if (!this.passwordConfirmation.touched) { return; }
      value = String(value).trim();
      const isValid = value === this.password.value && value.length > 0;
      if (!isValid) {
        this.passwordConfirmation.isValid = false;
      } else {
        this.passwordConfirmation.isValid = true;
      }
    },

    nameTouch(value) {
      this.name.touched = true;
      this.nameValidation(value);
    },

    emailTouch(value) {
      this.email.touched = true;
      this.emailValidation(value);
    },

    passwordTouch(value) {
      this.password.touched = true;
      this.passwordValidation(value);
    },

    passwordConfTouch(value) {
      this.passwordConfirmation.touched = true;
      this.passwordConfValidation(value);
    },

    async submit() {
      this.nameTouch(this.name.value);
      this.emailTouch(this.email.value);
      this.passwordTouch(this.password.value);
      this.passwordConfTouch(this.passwordConfirmation.value);

      if (!this.name.isValid || !this.email.isValid || !this.password.isValid || !this.passwordConfirmation.isValid) { return; }

      const userData = {
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
        passwordConfirmation: this.passwordConfirmation.value,
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
        this.$emit('reg-compleated');
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
