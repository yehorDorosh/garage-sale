<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <section>
      <h1 class="m-0">
        Account settings
      </h1>
    </section>
    <section>
      <p>
        Email: {{ user.email }}
      </p>
      <base-form class="user-data" :is-loading="isLoading" :no-submit-btn="!isChanged" @form-submit="updUserData">
        <base-input
          :id="name.id"
          v-model="name.value"
          label="User name"
          type="text"
          :is-valid="name.isValid"
          :err-msg="name.errMsg"
          @input="filedValidation($event, name, false)"
          @blur="filedValidation($event, name, true)"
        />
        <base-spinner :is-loading="isLoading" />
      </base-form>
    </section>
    <section>
      <base-button @click="$store.commit('dialog/setDeleteUserWarning', true)">
        Delete account
      </base-button>
    </section>
  </Fragment>
</template>

<script>
import BaseSpinner from '~/components/ui/BaseSpinner';
import BaseForm from '~/components/ui/BaseForm';
import BaseInput from '~/components/ui/BaseInput';

export default {
  components: {
    BaseSpinner,
    BaseForm,
    BaseInput,
  },

  middleware: 'auth',

  data() {
    return {
      conformationIsShown: false,
      isLoading: false,
      name: {
        id: 'user-name',
        value: this.$store.getters['user/getUser'].name,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
        touched: false,
      },
    };
  },

  computed: {
    user() {
      return this.$store.getters['user/getUser'];
    },
    isChanged() {
      return this.user.name !== this.name.value;
    }
  },

  methods: {
    filedValidation(value, field, touch, validation) {
      if (touch === true) { field.isTouched = true; }
      if (!field.isTouched) { return; }
      if (validation === undefined) {
        validation = (value) => {
          return String(value).trim().length > 0;
        };
      }
      field.isValid = validation(value);
    },
    async updUserData() {
      if (!this.name.isValid) { return; }
      this.isLoading = true;
      await this.$store.dispatch('user/updUserData', { name: this.name.value });
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
form.user-data {
  max-width: 260px;
}
</style>
