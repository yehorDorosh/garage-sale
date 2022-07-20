<template>
  <li class="card prod">
    <div class="prod__info">
      <div class="prod__txt">
        <h3 class="prod__title">
          {{ product.title }}
        </h3>
        <p class="prod__desc">
          {{ product.description }}
        </p>
        <p class="prod__price">
          Price: {{ product.price }}€
        </p>
      </div>
      <p v-if="isBooked">
        Booked by {{ product.buyer.name }}
      </p>
      <base-form v-else :is-loading="isLoading" :no-submit-btn="true" @form-submit="book">
        <base-input
          :id="nameInput.id"
          v-model="nameInput.value"
          label="Name"
          :is-valid="nameInput.isValid"
          :err-msg="nameInput.errMsg"
          @input="filedValidation($event, nameInput, false)"
          @blur="filedValidation($event, nameInput, true)"
        />
        <base-input
          :id="emailInput.id"
          v-model="emailInput.value"
          label="email"
          :is-valid="emailInput.isValid"
          :err-msg="emailInput.errMsg"
          @input="filedValidation($event, emailInput, false, emailValidator)"
          @blur="filedValidation($event, emailInput, true, emailValidator)"
        />
        <base-button type="submit">
          Book
        </base-button>
      </base-form>
    </div>
    <div class="prod__img-list">
      <img v-for="image in product.images" :key="image.filename" class="pord__img" :src="image.path" :alt="image.alt">
    </div>
  </li>
</template>

<script>
import BaseForm from '~/components/ui/BaseForm.vue';
import BaseInput from '~/components/ui/BaseInput.vue';

export default {
  components: {
    BaseForm,
    BaseInput,
  },

  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        description: '',
        price: 0,
        images: [],
      }),
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
        id: 'buyer-name-' + this.product._id,
        value: this.buyerName,
        isTouched: false,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      emailInput: {
        id: 'buyer-email-' + this.product._id,
        value: this.buyerEmail,
        isTouched: false,
        isValid: null,
        errMsg: 'Invalid email.',
      },
    };
  },

  computed: {
    saleId() {
      return this.$route.params.id;
    },
    isBooked() {
      return this.product.isBooked;
    },
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
        productId: this.product._id,
        name: this.nameInput.value,
        email: this.emailInput.value,
      };

      this.isLoading = true;
      await this.$store.dispatch('product/saveBuyer', buyer);
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.prod__info {
  display: flex;
  justify-content: space-between;
}

.prod__price {
  font-weight: 700;
}

.prod__img-list {
  display: flex;
  margin-inline: -8px;
  justify-content: center;
  flex-wrap: wrap;
}

.pord__img {
  padding: 8px;
  height: auto;
  width: 25%;
  box-sizing: border-box;
}
</style>
