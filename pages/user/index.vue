<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <h1>
      Account settings
    </h1>
    <p>
      Email: {{ user.email }}
    </p>
    <base-form class="user-data" :is-loading="isLoading" :no-submit-btn="true">
      <base-input
        id="user-name"
        ref="name"
        v-model="newUserName"
        type="text"
        label="User name"
        @blur="updUserData"
        @keydown.enter="updUserData"
      />
      <p v-if="name.isUpdated" class="warning">
        The name was updated!
      </p>
      <base-spinner :is-loading="isLoading" />
    </base-form>
    <base-button @click="openConformation">
      Delete account
    </base-button>
    <base-dialog :show="conformationIsShown" :cross="true" @close="closeConformation">
      <p>A you sure?</p>
      <div>
        <base-button @click="deleteAccount">
          Delete account
        </base-button>
        <base-button @click="closeConformation">
          Cancel
        </base-button>
      </div>
      <base-spinner :is-loading="isLoading" />
    </base-dialog>
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
      newUserName: this.$store.getters['user/getUser']?.name,
      name: {
        isUpdated: false,
        isTouched: false,
      },
    };
  },

  computed: {
    user() {
      return this.$store.getters['user/getUser'];
    },
  },

  methods: {
    openConformation() {
      this.conformationIsShown = true;
    },

    closeConformation() {
      this.conformationIsShown = false;
    },

    async deleteAccount() {
      this.isLoading = true;
      await this.$store.dispatch('user/deleteAccount');
      this.isLoading = false;
      const status = this.$store.getters['user/getResponse'].status;
      if (status === 200) {
        this.$store.dispatch('user/logout');
        this.$router.push('/');
      }
    },

    async updUserData() {
      this.name.isUpdated = false;
      this.isLoading = true;
      await this.$store.dispatch('user/updUserData', { name: this.newUserName });
      this.isLoading = false;
      this.name.isTouched = false;
      const status = this.$store.getters['user/getResponse'].status;
      if (status === 200) { this.name.isUpdated = true; }
    }
  },
};
</script>

<style scoped>
  form.user-data {
    max-width: 260px;
  }

  .warning {
    color: lightgrey;
    font-size: 0.5rem;
    margin-top: 0;
    margin-bottom: 8px;
  }
</style>
