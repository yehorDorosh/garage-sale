<template>
  <base-form btn-txt="Create account" @form-submit="submit">
    <base-input id="name-input" v-model.trim="name" type="text" label="Name" placeholder="Name" />
    <base-input id="email-input" v-model.trim="email" type="email" label="Email" placeholder="user@email.com" />
    <base-input id="pass-input" v-model.trim="password" type="password" label="Password" placeholder="******" />
    <base-input id="pass-repeat-input" v-model.trim="repeatedPassword" type="password" label="Repeat password" placeholder="******" />
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
      name: '',
      email: '',
      password: '',
      repeatedPassword: ''
    };
  },
  methods: {
    submit() {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      console.log(userData);
    }
  }
};
</script>

<style scoped>
form {
  text-align: left;
}
</style>
