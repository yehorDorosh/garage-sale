<template>
  <Fragment>
    <p v-if="title && imgInputs.length > 0">
      {{ title }}
    </p>
    <p v-if="isValid === false" class="err mb-8">
      {{ errMsg }}
    </p>
    <ul>
      <li
        v-for="(imgInput, i) in imgInputs"
        :key="`${i}-${id}`"
        class="item"
        draggable="true"
        @dragstart="startDrag($event, imgInput)"
        @dragend="stopDrag($event)"
        @dragover.prevent="enterDrag($event)"
        @dragenter.prevent="enterDrag($event)"
        @dragleave.prevent="leaveDrag($event)"
        @drop="onDrop($event, imgInput)"
      >
        <img v-if="imgInput.preview || imgInput.localpath" :src="imgInput.preview || imgInput.localpath" draggable="false">
        <div class="row">
          <label :for="`${i}-${id}`" class="btn">
            {{ selectBtnTxt(i) }}
          </label>
          <span v-show="imgInput.error" class="err">
            {{ imgInput.error }}
          </span>
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
    isValid: {
      type: Boolean,
      default: null,
    },
    errMsg: {
      type: String,
      default: 'Some error was occured'
    }
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
        error: '',
      });
    },

    removeInput(index) {
      this.imgInputs.splice(index, 1);
    },

    inputHandler(e, i) {
      const inputField = e.target;
      let imgFile = inputField.files[0];
      const imgFormat = imgFile.type?.split('/')[1];

      if (imgFile.size > process.env.maxUploadImgSize) {
        this.imgInputs[i].error = `The file is too large. Maximum file size ${(process.env.maxUploadImgSize / 1e6).toFixed(2)}MB. File size: ${(imgFile.size / 1e6).toFixed(2)}MB`;
        return;
      } else if (!process.env.supportedImageFormats.includes(imgFormat)) {
        this.imgInputs[i].error = `Invalid image format ${imgFormat}. Supported image formats: ${process.env.supportedImageFormats.join(', ')}`;
        return;
      } else {
        this.imgInputs[i].error = '';
      }

      // Rename uploaded fiel if name clashes
      const nameMatches = this.imgInputs.filter(img => img.name === imgFile.name);
      if (nameMatches.length > 0) {
        const nameAndExt = imgFile.name.split('.');
        const regex = new RegExp(`^${nameAndExt[0]}-\\d{1,}\\.[\\d\\w][^_]{1,}$`, 'i');
        const filesWithIndex = this.imgInputs.filter(img => regex.test(img.name));
        let newIndex = 1;
        if (filesWithIndex.length) {
          const indexesList = filesWithIndex.map((img) => {
            const name = img.name.split('.')[0];
            return +name.split('-').at(-1);
          });
          newIndex = Math.max(...indexesList);
          ++newIndex;
        }
        const newImageName = `${nameAndExt[0]}-${newIndex}.${nameAndExt[1]}`;
        this.renameFile(inputField, imgFile, newImageName);
        imgFile = inputField.files[0];
      }

      // Save image data
      this.imgInputs[i].file = imgFile;
      this.imgInputs[i].name = imgFile?.name;

      // Preview image
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imgFile);
      fileReader.addEventListener('load', (FREvent) => {
        this.imgInputs[i].localpath = FREvent.target.result;
        this.selectBtnTxt(i);
      });
    },

    altHandler(e, i) {
      this.imgInputs[i].alt = e;
    },

    alt(i) {
      return this.imgInputs[i]?.alt || '';
    },

    selectBtnTxt(i) {
      return this.imgInputs[i].name || 'Select Image';
    },

    renameFile(input, prevFile, newName) {
      const newFile = new File([prevFile], newName, { type: prevFile.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(newFile);
      input.files = dataTransfer.files;
    },
    startDrag(e, item) {
      e.currentTarget.classList.add('drag');
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('itemID', item.name);
    },
    stopDrag(e) {
      e.currentTarget.classList.remove('drag');
    },
    enterDrag(e) {
      e.currentTarget.classList.add('over');
    },
    leaveDrag(e) {
      e.currentTarget.classList.remove('over');
    },
    onDrop(e, targetItem) {
      e.currentTarget.classList.remove('over');
      const itemID = e.dataTransfer.getData('itemID');
      const draggableItem = this.imgInputs.find(item => item.name === itemID);
      const draggableItemIndex = this.imgInputs.findIndex(item => item.name === itemID);
      const targetItemIndex = this.imgInputs.findIndex(item => item.name === targetItem.name);
      this.imgInputs.splice(draggableItemIndex, 1);
      this.imgInputs.splice(targetItemIndex, 0, draggableItem);
    },
  },
};
</script>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    padding: 8px 4px;
    margin-block: 4px;
  }

  .item:hover {
    box-shadow: 0 0 2px 1px lightgray;
  }

  .drag {
    opacity: 0.5;
  }

  .over {
    opacity: 0.5;
    border-top: 1px dashed lightgray;
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

  .err {
    font-size: 0.5rem;
    color: red;
    margin-top: 8px;
    margin-bottom: 0;
  }

  .mb-8 {
    margin-bottom: 8px;
  }
</style>
