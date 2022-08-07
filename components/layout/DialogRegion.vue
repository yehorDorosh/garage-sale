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
      />
    </base-dialog>
  </div>
</template>

<script>
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
