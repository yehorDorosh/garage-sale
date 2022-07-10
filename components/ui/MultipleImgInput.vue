<template>
  <Fragment>
    <p v-if="title && imgInputs.length > 0">
      {{ title }}
    </p>
    <ul>
      <li v-for="(imgInput, i) in imgInputs" :key="`${i}-${id}`" class="item">
        <div class="row">
          <input :id="`${i}-${id}`" type="file" @change="inputHandler($event, i)">
        </div>
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
export default {

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
    },

    inputHandler(e, i) {
      this.imgInputs[i] = e.target.files[0];
    },
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
