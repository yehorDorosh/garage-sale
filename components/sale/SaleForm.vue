<template>
  <section>
    <base-form :is-loading="isLoading" :no-submit-btn="!isChanged" class="card" @form-submit="saveSale">
      <h3>Sale configuration</h3>
      <base-input
        :id="titleInput.id"
        v-model="titleInput.value"
        label="Sale name/short description"
        :is-valid="titleInput.isValid"
        :err-msg="titleInput.errMsg"
        @input="filedValidation($event, titleInput, false)"
        @blur="filedValidation($event, titleInput, true)"
      />
      <base-checkbox
        :id="isPublishedInput.id"
        v-model="isPublishedInput.value"
        label="Publish"
        :value="isPublishedInput.value"
      />
    </base-form>
  </section>
</template>

<script>
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import BaseForm from '~/components/ui/BaseForm';
import BaseInput from '~/components/ui/BaseInput';

export default {
  components: {
    BaseCheckbox,
    BaseForm,
    BaseInput,
  },

  data() {
    return {
      titleInput: {
        id: 'sale-title',
        value: '',
        isTouched: false,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      isPublishedInput: {
        id: 'sale-publish',
        value: true,
      },
      isLoading: false,
    };
  },

  computed: {
    userId() {
      return this.$store.getters['user/getUserId'];
    },
    userSale() {
      return this.$store.getters['sale/getUserSales'][0];
    },
    isChanged() {
      if (
        this.userSale?.description !== this.titleInput.value ||
        this.userSale?.isPublished !== this.isPublishedInput.value
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    userSale(sale) {
      if (sale) {
        this.titleInput.value = sale.description;
        this.isPublishedInput.value = sale.isPublished;
      }
    },
  },

  // created() {
  //   this.$store.dispatch('sale/fetchUserSales');
  // },

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

    async saveSale() {
      this.filedValidation(this.titleInput.value, this.titleInput, true);
      if (!this.titleInput.isValid) { return; }
      const saleData = {
        description: this.titleInput.value,
        isPublished: this.isPublishedInput.value,
      };
      this.isLoading = true;
      await this.$store.dispatch('sale/saveSale', saleData);
      this.isLoading = false;
    }
  },
};
</script>
