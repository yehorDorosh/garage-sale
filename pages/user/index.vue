<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Fragment>
    <h1>
      Account settings
    </h1>
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

export default {
  components: {
    BaseSpinner
  },

  data() {
    return {
      conformationIsShown: false,
      isLoading: false,
    };
  },

  methods: {
    openConformation() {
      this.conformationIsShown = true;
    },

    closeConformation() {
      this.conformationIsShown = false;
    },

    async deleteAccount() {
      try {
        this.isLoading = true;
        const response = await fetch(`${process.env.protocol}://${process.env.hostName}/user/delete`, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + this.$store.getters['user/getToken'],
          }
        });
        const status = response.status;
        this.isLoading = false;

        if (status === 200) {
          this.$store.dispatch('user/logout');
          this.$router.push('/');
        }
      } catch (err) {
        this.isLoading = false;
        throw new Error(err);
      }
    }
  },
};
</script>
