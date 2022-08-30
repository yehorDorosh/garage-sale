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
          label="User full name"
          type="text"
          :is-valid="name.isValid"
          :err-msg="name.errMsg"
          @input="filedValidation($event, name, false)"
          @blur="filedValidation($event, name, true)"
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
import BaseCheckbox from '~/components/ui/BaseCheckbox';

export default {
  components: {
    BaseSpinner,
    BaseForm,
    BaseInput,
    BaseCheckbox,
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
      phone: {
        id: 'user-phone',
        value: this.$store.getters['user/getUser'].phone?.number || '',
        isValid: null,
        errMsg: 'Please enter a valid phone.',
        touched: false,
      },
      whatsApp: {
        value: this.$store.getters['user/getUserPhone']?.whatsApp ?? false,
      },
      viber: {
        value: this.$store.getters['user/getUserPhone']?.viber ?? false,
      },
      telegram: {
        value: this.$store.getters['user/getUserPhone']?.telegram ?? false,
      },
    };
  },

  computed: {
    user() {
      return this.$store.getters['user/getUser'];
    },
    isChanged() {
      if (this.phone.value || this.user.phone.number) {
        return this.user.name !== this.name.value ||
          this.user.phone.number !== this.phone.value ||
          this.user.phone.whatsApp !== this.whatsApp.value ||
          this.user.phone.viber !== this.viber.value ||
          this.user.phone.telegram !== this.telegram.value;
      } else {
        return this.user.name !== this.name.value;
      }
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
    phoneValidator(value) {
      if (!value) { return true; }
      const regexp = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/;
      const isValid = !!value.trim().match(regexp);
      return isValid;
    },
    async updUserData() {
      this.filedValidation(this.name.value, this.name, true);
      this.filedValidation(this.phone.value, this.phone, true, this.phoneValidator);
      if (!this.name.isValid || !this.phone.isValid) { return; }

      const data = {
        name: this.name.value,
      };

      if (this.phone.value) {
        data.phone = {
          number: this.phone.value,
          whatsApp: this.whatsApp.value,
          viber: this.viber.value,
          telegram: this.telegram.value,
        };
      } else {
        data.phone = {};
      }

      this.isLoading = true;
      await this.$store.dispatch('user/updUserData', data);
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
form.user-data {
  max-width: 260px;
}

.checkboxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.checkboxes .row {
  width: 50%;
}
</style>
