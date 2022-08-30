<template>
  <base-form :is-loading="isLoading" :no-submit-btn="true" @form-submit="book">
    <base-input
      :id="nameInput.id"
      v-model.trim="nameInput.value"
      label="Full name *"
      :is-valid="nameInput.isValid"
      :err-msg="nameInput.errMsg"
      @input="filedValidation($event, nameInput, false)"
      @blur="filedValidation($event, nameInput, true)"
    />
    <base-input
      :id="emailInput.id"
      v-model.trim="emailInput.value"
      label="email *"
      :is-valid="emailInput.isValid"
      :err-msg="emailInput.errMsg"
      @input="filedValidation($event, emailInput, false, emailValidator)"
      @blur="filedValidation($event, emailInput, true, emailValidator)"
    />
    <base-button type="submit">
      Book
    </base-button>
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

  props: {
    saleId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      nameInput: {
        id: 'buyer-name-' + this.productId,
        value: this.buyerName,
        isTouched: false,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      emailInput: {
        id: 'buyer-email-' + this.productId,
        value: this.buyerEmail,
        isTouched: false,
        isValid: null,
        errMsg: 'Invalid email.',
      },
    };
  },

  watch: {
    buyerName(newValue) {
      this.nameInput.value = newValue;
    },
    buyerEmail(newValue) {
      this.emailInput.value = newValue;
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

    emailValidator(value) {
      const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      value = String(value).trim().toLowerCase();
      const isValid = regexp.test(value);
      return isValid;
    },

    async book() {
      this.filedValidation(this.emailInput.value, this.emailInput, true);
      this.filedValidation(this.nameInput.value, this.nameInput, true);

      if (!this.emailInput.isValid || !this.nameInput.isValid) { return; }

      const buyer = {
        saleId: this.saleId,
        productId: this.productId,
        name: this.nameInput.value,
        email: this.emailInput.value,
      };

      this.isLoading = true;
      const data = await this.$store.dispatch('product/saveBuyer', buyer);
      this.isLoading = false;

      if (data?.status === 200) {
        this.$store.commit('dialog/setBuyerFormIsShown', false);
      }

      if (data?.status === 202) {
        this.$store.commit('dialog/setBuyerFormIsShown', false);
        this.$store.commit('dialog/setBookingWarning', true);
      }
    }
  },
};
</script>
