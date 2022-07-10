<template>
  <base-form :is-loading="isLoading" :no-submit-btn="true" @form-submit="saveProduct">
    <base-input
      :id="titleElemId"
      v-model="titleInput"
      label="Product name"
    />
    <base-input
      :id="descriptionElemId"
      v-model="descriptionInput"
      label="Product description"
    />
    <base-input
      :id="priceElemId"
      v-model="priceInput"
      label="Product price"
      type="number"
    />
    <multiple-img-input
      :id="imgElemId"
      title="Upload product image"
      :img-inputs-prop="imgInputs"
    />
    <base-checkbox
      :id="publishElemId"
      v-model="isPublishedInput"
      label="Publish"
      :value="isPublishedInput"
    />
    <div>
      <base-button type="submit">
        Save
      </base-button>
      <base-button @click="deleteProduct">
        Delete
      </base-button>
    </div>
  </base-form>
</template>

<script>
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

  emit: ['delete'],

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
      titleInput: this.currentTitle,
      descriptionInput: this.currentDescription,
      priceInput: this.currentPrice,
      imgInputs: [...this.currentImgs],
      isPublishedInput: this.currentIsPublished,
    };
  },

  computed: {
    titleElemId() {
      return 'title--' + this.currentId;
    },
    descriptionElemId() {
      return 'description--' + this.currentId;
    },
    priceElemId() {
      return 'price--' + this.currentId;
    },
    imgElemId() {
      return 'image--' + this.currentId;
    },
    publishElemId() {
      return 'publish--' + this.currentId;
    },
  },

  methods: {
    deleteProduct() {
      this.$emit('delete', this.currentId);
    },

    async saveProduct() {
      const product = {
        tempId: this.currentId,
        title: this.titleInput,
        description: this.descriptionInput,
        price: this.priceInput,
        images: this.imgInputs,
        isPublished: this.isPublishedInput,
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
