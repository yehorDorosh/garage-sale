<template>
  <base-form :is-loading="isLoading" :no-submit-btn="true" @form-submit="saveProduct">
    <base-input
      :id="titleInput.id"
      v-model="titleInput.value"
      label="Product name"
    />
    <base-input
      :id="descriptionInput.id"
      v-model="descriptionInput.value"
      :text-area="true"
      label="Product description"
    />
    <base-input
      :id="priceInput.id"
      v-model="priceInput.value"
      label="Product price"
      type="number"
    />
    <multiple-img-input
      :id="imgInputs.id"
      title="Upload product image"
      :img-inputs-prop="imgInputs.value"
    />
    <base-checkbox
      :id="isPublishedInput.id"
      v-model="isPublishedInput.value"
      label="Publish"
      :value="isPublishedInput.value"
    />
    <div>
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
  },

  data() {
    return {
      isLoading: false,
      titleInput: {
        id: 'title--' + this.currentId,
        value: this.currentTitle,
      },
      descriptionInput: {
        id: 'description--' + this.currentId,
        value: this.currentDescription,
      },
      priceInput: {
        id: 'price--' + this.currentId,
        value: this.currentPrice,
      },
      imgInputs: {
        id: 'image--' + this.currentId,
        value: this.currentImgs.map(imgObj => Object.assign({}, imgObj)),
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
    currentImgs(newValue) {
      this.imgInputs.value = newValue.map(imgObj => Object.assign({}, imgObj));
    }
  },

  methods: {
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
      const product = {
        tempId: this.currentId,
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
      await this.$store.dispatch('product/saveUserProduct', product);
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
form {
  border-radius: 16px;
  box-shadow: 0 0 5px 2px lightgray;
  padding: 16px;
  margin-bottom: 16px;
}
</style>
