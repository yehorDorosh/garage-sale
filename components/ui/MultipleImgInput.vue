<template>
  <Fragment>
    <p v-if="title && imgInputs.length > 0">
      {{ title }}
    </p>
    <ul>
      <li v-for="(imgInput, i) in imgInputs" :key="`${i}-${id}`" class="item">
        <base-input
          :id="`${i}-${id}`"
          v-model="imgInputs[i]"
        />
        <base-button @click="removeInput(i)">
          Remove image
        </base-button>
      </li>
    </ul>
    <div>
      <base-button v-if="imgInputs.length < 10" @click="addInput">
        Add image
      </base-button>
    </div>
  </Fragment>
</template>

<script>
import BaseInput from '~/components/ui/BaseInput';

export default {
  components: {
    BaseInput
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    imgInputsProp: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      imgInputs: this.imgInputsProp,
    };
  },

  methods: {
    addInput() {
      this.imgInputs.push('');
    },

    removeInput(index) {
      this.imgInputs.splice(index, 1);
    }
  },
};
</script>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item .row {
    flex-grow: 1;
  }
</style>
