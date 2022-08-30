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
    <base-dialog :show="bookingWarning" @close="$store.commit('dialog/setBookingWarning', false)">
      <p>
        Unfortunately, the item has already been booked.
      </p>
    </base-dialog>
    <base-dialog cross :show="buyerFormIsShown" @close="$store.commit('dialog/setBuyerFormIsShown', false)">
      <buyer-form
        :sale-id="buyerFormData.saleId"
        :product-id="buyerFormData.productId"
        :buyer-name="buyerFormData.buyerName"
        :buyer-email="buyerFormData.buyerEmail"
        :buyer-phone="buyerFormData.buyerPhone"
      />
    </base-dialog>
    <base-dialog :show="deleteUserWarning" :cross="true" @close="$store.commit('dialog/setDeleteUserWarning', false)">
      <p>A you sure?</p>
      <div>
        <base-button @click="deleteAccount">
          Delete account
        </base-button>
        <base-button @click="$store.commit('dialog/setDeleteUserWarning', false)">
          Cancel
        </base-button>
      </div>
      <base-spinner :is-loading="isLoading" />
    </base-dialog>
  </div>
</template>

<script>
import BaseSpinner from '~/components/ui/BaseSpinner';
import RegForm from '~/components/user/RegForm';
import LoginForm from '~/components/user/LoginForm';
import BaseDialog from '~/components/ui/BaseDialog';
import BuyerForm from '~/components/buyer/BuyerForm';

export default {
  components: {
    RegForm,
    LoginForm,
    BaseDialog,
    BuyerForm,
    BaseSpinner
  },

  data() {
    return {
      isLoading: false,
    };
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
    bookingWarning() {
      return this.$store.getters['dialog/getBookingWarning'];
    },
    buyerFormIsShown() {
      return this.$store.getters['dialog/getBuyerFormIsShown'];
    },
    buyerFormData() {
      return this.$store.getters['dialog/getBuyerFormData'];
    },
    deleteUserWarning() {
      return this.$store.getters['dialog/getDeleteUserWarning'];
    }
  },

  methods: {
    regIsSuccessfull() {
      this.$store.commit('dialog/setRegIsShown', false);
      this.$store.commit('dialog/setRegMsgIsShown', true);
    },
    closeRegMsgIsShown() {
      this.$store.commit('dialog/setRegMsgIsShown', false);
      this.$router.push('/sale-editor');
    },
    async deleteAccount() {
      this.isLoading = true;
      await this.$store.dispatch('user/deleteAccount');
      this.isLoading = false;
      const status = this.$store.getters['user/getResponse'].status;
      if (status === 200) {
        this.$store.commit('dialog/setDeleteUserWarning', false);
        this.$store.dispatch('user/logout');
        this.$router.push('/');
      }
    },
  },
};
</script>
