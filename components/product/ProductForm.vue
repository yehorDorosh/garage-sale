<template>
  <base-form :is-loading="isLoading" :no-submit-btn="true">
    <base-input
      id="title"
      v-model="titleInput"
      label="Product name"
    />
    <base-input
      id="description"
      v-model="descriptionInput"
      label="Product description"
    />
    <base-input
      id="price"
      v-model="priceInput"
      label="Product price"
      type="number"
    />
    <base-input
      id="image"
      v-model="imgInput"
      label="Upload product image"
    />
    <base-checkbox
      id="publish"
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

export default {
  components: {
    BaseForm,
    BaseInput,
    BaseCheckbox,
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
    currentImg: {
      type: String,
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
      id: this.currentId,
      titleInput: this.currentTitle,
      descriptionInput: this.currentDescription,
      priceInput: this.currentPrice,
      imgInput: this.currentImg,
      isPublishedInput: this.currentIsPublished,
    };
  },

  methods: {
    deleteProduct() {
      this.$emit('delete', this.id);
    },
  },
};
</script>
