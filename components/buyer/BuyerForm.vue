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
    <base-input
      :id="phone.id"
      v-model="phone.value"
      label="Phone (optional)"
      type="tel"
      :is-valid="phone.isValid"
      :err-msg="phone.errMsg"
      @input="filedValidation($event, phone, false, phoneValidator)"
      @blur="filedValidation($event, phone, true, phoneValidator)"
    />
    <div class="checkboxes">
      <base-checkbox
        id="whatsapp-input"
        v-model="whatsApp.value"
        label="WhatsApp"
        :value="whatsApp.value"
      />
      <base-checkbox
        id="viber-input"
        v-model="viber.value"
        label="Viber"
        :value="viber.value"
      />
      <base-checkbox
        id="telegram-input"
        v-model="telegram.value"
        label="Telegram"
        :value="telegram.value"
      />
    </div>
    <p v-if="serverValidation.error" class="error">
      {{ serverValidation.errMsg }}
    </p>
    <base-button type="submit">
      Book
    </base-button>
  </base-form>
</template>

<script>
import BaseForm from '~/components/ui/BaseForm';
import BaseInput from '~/components/ui/BaseInput';
import BaseCheckbox from '~/components/ui/BaseCheckbox';

export default {
  components: {
    BaseForm,
    BaseInput,
    BaseCheckbox,
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
    buyerPhone: {
      type: Object,
      default: () => ({}),
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
      phone: {
        id: 'buyer-phone' + this.productId,
        value: this.buyerPhone?.number || '',
        isValid: null,
        errMsg: 'Please enter a valid phone.',
        isTouched: false,
      },
      whatsApp: {
        value: this.buyerPhone?.whatsApp ?? false,
      },
      viber: {
        value: this.buyerPhone?.viber ?? false,
      },
      telegram: {
        value: this.buyerPhone?.telegram ?? false,
      },
      serverValidation: {
        error: false,
        errMsg: 'Validation faild.'
      },
    };
  },

  watch: {
    buyerName(newValue) {
      this.nameInput.value = newValue;
    },
    buyerEmail(newValue) {
      this.emailInput.value = newValue;
    },
    buyerPhone(newValue) {
      this.phone.value = newValue;
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
    phoneValidator(value) {
      if (!value) { return true; }
      const regexp = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/;
      const isValid = !!value.trim().match(regexp);
      return isValid;
    },

    async book() {
      this.filedValidation(this.emailInput.value, this.emailInput, true);
      this.filedValidation(this.nameInput.value, this.nameInput, true);
      this.filedValidation(this.phone.value, this.phone, true, this.phoneValidator);

      if (!this.emailInput.isValid || !this.nameInput.isValid || !this.phone.isValid) { return; }

      const buyer = {
        saleId: this.saleId,
        productId: this.productId,
        name: this.nameInput.value,
        email: this.emailInput.value,
        phone: {
          number: this.phone.value,
          whatsApp: this.whatsApp.value,
          viber: this.viber.value,
          telegram: this.telegram.value,
        }
      };

      this.isLoading = true;
      const data = await this.$store.dispatch('product/saveBuyer', buyer);
      this.isLoading = false;

      if (data?.status === 422) {
        this.serverValidation.error = true;
        this.serverValidation.errMsg = data?.data[0]?.msg;
      }

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

<style scoped>
.checkboxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.checkboxes .row {
  width: 50%;
  text-align: left;
}

.error {
  color: var(--error);
  font-size: 0.6rem;
  text-align: left;
}
</style>
