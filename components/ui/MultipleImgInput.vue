<template>
  <Fragment>
    <p v-if="title && imgInputs.length > 0">
      {{ title }}
    </p>
    <ul>
      <li v-for="(imgInput, i) in imgInputs" :key="`${i}-${id}`" class="item">
        <img v-if="imgInput.path || imgInput.localpath" :src="imgInput.path || imgInput.localpath">
        <div class="row">
          <label :for="`${i}-${id}`" class="btn">{{ selectBtnTxt(i) }}</label>
          <input :id="`${i}-${id}`" type="file" style="display: none;" @change="inputHandler($event, i)">
          <base-input
            :id="`${i}-alt-${id}`"
            :value="alt(i)"
            placeholder="ALT text. Describe image."
            @input="altHandler($event, i)"
          />
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
import BaseInput from '~/components/ui/BaseInput.vue';

export default {
  components: {
    BaseInput,
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

  watch: {
    imgInputsProp(newValue) {
      this.imgInputs = newValue;
    },
  },

  methods: {
    addInput() {
      this.imgInputs.push({
        alt: '',
        name: '',
        localpath: '',
        path: '',
      });
    },

    removeInput(index) {
      this.imgInputs.splice(index, 1);
    },

    inputHandler(e, i) {
      const nameMatches = this.imgInputs.filter(img => img.name === e.target.files[0].name);
      console.log(nameMatches);
      if (nameMatches.length > 0) {
        const nameAndExt = e.target.files[0].name.split('.');
        const newImageName = `${nameAndExt[0]}-copy.${nameAndExt[1]}`;
        console.log(e.target, e.target.files[0], newImageName);
        this.renameFile(e.target, e.target.files[0], newImageName);
      }

      this.imgInputs[i].file = e.target.files[0];
      this.imgInputs[i].name = e.target.files[0]?.name;

      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.addEventListener('load', (FREvent) => {
        this.imgInputs[i].localpath = FREvent.target.result;
        this.selectBtnTxt(i);
      });
    },

    altHandler(e, i) {
      this.imgInputs[i].alt = e;
    },

    alt(i) {
      if (!this.imgInputs[i]) { return ''; }
      return this.imgInputs[i].alt ? this.imgInputs[i].alt : '';
    },

    selectBtnTxt(i) {
      return this.imgInputs[i].name ? this.imgInputs[i].name : 'Select Image';
    },

    renameFile(input, prevFile, newName) {
      const newFile = new File(prevFile, newName);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(newFile);
      input.files = dataTransfer.files;
      console.log(input.files[0]);
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
    padding-inline: 16px;
  }

  .item img {
    width: 64px;
    height: auto;
  }

  .btn {
    font-size: 0.8rem;
    cursor: pointer;
    padding: 8px;
    border: 1px solid var(--accent);
    border-radius: 32px;
    color: white;
    background-color: var(--accent);
    margin-inline: 16px;
  }
</style>
