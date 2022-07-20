<template>
  <base-form :is-loading="isLoading" :no-submit-btn="true" class="card" @form-submit="saveProduct">
    <ul v-if="!validationErrFromBE.isValid" class="err">
      <li v-for="(msg, i) in validationErrFromBE.errMsg" :key="`${i}-${msg}`">
        {{ msg }}
      </li>
    </ul>
    <base-input
      :id="titleInput.id"
      v-model="titleInput.value"
      label="Product name"
      :is-valid="titleInput.isValid"
      :err-msg="titleInput.errMsg"
      @input="filedValidation($event, titleInput, false)"
      @blur="filedValidation($event, titleInput, true)"
    />
    <base-input
      :id="descriptionInput.id"
      v-model="descriptionInput.value"
      :text-area="true"
      label="Product description"
      :is-valid="descriptionInput.isValid"
      :err-msg="descriptionInput.errMsg"
      @input="filedValidation($event, descriptionInput, false)"
      @blur="filedValidation($event, descriptionInput, true)"
    />
    <base-input
      :id="priceInput.id"
      v-model="priceInput.value"
      label="Product price"
      type="number"
      :is-valid="priceInput.isValid"
      :err-msg="priceInput.errMsg"
      @input="filedValidation($event, priceInput, false, priceValidator)"
      @blur="filedValidation($event, priceInput, true, priceValidator)"
    />
    <multiple-img-input
      :id="imgInputs.id"
      title="Upload product image"
      :img-inputs-prop="imgInputs.value"
      :is-valid="imgInputs.isValid"
      :err-msg="imgInputs.errMsg"
    />
    <base-checkbox
      :id="isPublishedInput.id"
      v-model="isPublishedInput.value"
      label="Publish"
      :value="isPublishedInput.value"
    />
    <div v-if="currentIsBooked">
      <p>
        <b>{{ currentBuyer.name }}</b> booked this product.
      </p>
      <p>
        {{ currentBuyer.name }} email:  <b>{{ currentBuyer.email }}</b>
      </p>
      <base-button @click="unBook">
        Cancel reservation
      </base-button>
    </div>
    <div v-else>
      <base-button v-if="isChanged" type="submit">
        Save
      </base-button>
      <base-button @click="deleteProduct">
        Delete
      </base-button>
    </div>
  </base-form>
</template>

<script>
import { validate as uuidValidate } from 'uuid';

import BaseForm from '~/components/ui/BaseForm';
import BaseInput from '~/components/ui/BaseInput';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import MultipleImgInput from '~/components/ui/MultipleImgInput.vue';

export default {
  components: {
    BaseForm,
    BaseInput,
    BaseCheckbox,
    MultipleImgInput,
  },

  props: {
    currentId: {
      type: String,
      required: true,
    },
    currentTitle: {
      type: String,
      required: true,
    },
    currentDescription: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    currentImgs: {
      type: Array,
      required: true,
    },
    currentIsPublished: {
      type: Boolean,
      required: true,
    },
    currentIsBooked: {
      type: Boolean,
      required: true,
    },
    currentBuyer: {
      type: Object,
      required: true,
    },
    saleId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      validationErrFromBE: {
        isValid: true,
        errMsg: [],
      },
      titleInput: {
        id: 'title--' + this.currentId,
        value: this.currentTitle,
        isTouched: false,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      descriptionInput: {
        id: 'description--' + this.currentId,
        value: this.currentDescription,
        isTouched: false,
        isValid: null,
        errMsg: 'This field shouldn\'t be empty.',
      },
      priceInput: {
        id: 'price--' + this.currentId,
        value: this.currentPrice,
        isTouched: false,
        isValid: null,
        errMsg: 'The price field shouldn\'t be less then 0.',
      },
      imgInputs: {
        id: 'image--' + this.currentId,
        value: this.currentImgs.map(imgObj => Object.assign({}, imgObj)),
        isValid: null,
        errMsg: 'Add at least one image. Maximum image ammount is 10.',
      },
      isPublishedInput: {
        id: 'publish--' + this.currentId,
        value: this.currentIsPublished,
      }
    };
  },

  computed: {
    isChanged() {
      const imgsIsChanged = () => {
        const lengthIsSame = this.imgInputs.value.length === this.currentImgs.length;
        if (!lengthIsSame) { return true; }

        const contentIsSame = this.imgInputs.value.every((imgObj, i) => {
          return imgObj.name === this.currentImgs[i].name && imgObj.alt === this.currentImgs[i].alt;
        });
        if (!contentIsSame) { return true; }

        return false;
      };

      if (
        this.titleInput.value !== this.currentTitle ||
        this.descriptionInput.value !== this.currentDescription ||
        +this.priceInput.value !== +this.currentPrice ||
        this.isPublishedInput.value !== this.currentIsPublished ||
        imgsIsChanged()
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    currentTitle(newValue) {
      this.titleInput.value = newValue;
    },
    currentDescription(newValue) {
      this.descriptionInput.value = newValue;
    },
    currentPrice(newValue) {
      this.priceInput.value = newValue;
    },
    currentImgs(newValue) {
      this.imgInputs.value = newValue.map(imgObj => Object.assign({}, imgObj));
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

    priceValidator(value) {
      if (!value) { return false; }
      value = Number(`${value}`.replace(/[^0-9.-]+/g, ''));
      return value >= 0;
    },

    async deleteProduct() {
      if (uuidValidate(this.currentId)) {
        this.$store.commit('product/removeProduct', this.currentId);
      } else {
        this.isLoading = true;
        await this.$store.dispatch('product/deleteUserProduct', this.currentId);
        this.isLoading = false;
      }
    },

    async saveProduct() {
      this.validationErrFromBE.errMsg = [];
      this.filedValidation(this.titleInput.value, this.titleInput, true);
      this.filedValidation(this.descriptionInput.value, this.descriptionInput, true);
      this.filedValidation(this.priceInput.value, this.priceInput, true, this.priceValidator);
      this.imgInputs.isValid = !!this.imgInputs.value.length && this.imgInputs.value.every(imgObj => !!imgObj.file || !!imgObj.path);

      if (
        !this.imgInputs.isValid ||
        !this.titleInput.isValid ||
        !this.descriptionInput.isValid ||
        !this.priceInput.isValid
      ) { return; }

      this.imgInputs.value.forEach((imgObj) => {
        delete imgObj.localpath;
      });

      const product = {
        id: this.currentId,
        title: this.titleInput.value,
        description: this.descriptionInput.value,
        price: this.priceInput.value,
        images: this.imgInputs.value,
        isPublished: this.isPublishedInput.value,
        isBooked: false,
        buyer: {
          name: '',
          email: ''
        },
      };
      this.isLoading = true;
      const response = await this.$store.dispatch('product/saveUserProduct', product);
      this.isLoading = false;

      if (response?.status === 422) {
        this.validationErrFromBE.isValid = false;
        response.data.forEach((err) => {
          this.validationErrFromBE.errMsg.push(err.msg);
        });
      }
    },

    async unBook() {
      const buyer = {
        saleId: this.saleId,
        productId: this.currentId,
        name: '',
        email: '',
      };

      this.isLoading = true;
      await this.$store.dispatch('product/clearBuyer', buyer);
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.err {
  font-size: 0.5rem;
  color: red;
  margin-top: 8px;
  margin-bottom: 0;
}
</style>
