<template>
  <Fragment>
    <div v-show="opened" class="backdrop" @click="close" />
    <base-button v-show="opened" class="prev-btn" mode="arrow left" @click="prev" />
    <base-button v-show="opened" class="next-btn" mode="arrow right" @click="next" />
    <div class="list">
      <img
        v-for="(image, i) in images"
        :key="image.filename"
        class="list__preview"
        :src="image.preview"
        :alt="image.alt"
        @click="open(i)"
      >
    </div>
    <div v-show="opened" class="img-card">
      <close-cross @click="close" />
      <img
        :src="images[currentImgIndex]?.path"
        :alt="images[currentImgIndex]?.alt"
        @click="next"
      >
    </div>
  </Fragment>
</template>

<script>
import CloseCross from '~/components/ui/CloseCross';

export default {
  components: {
    CloseCross,
  },

  props: {
    images: {
      type: Array,
      required: true,
    }
  },

  data() {
    return {
      opened: false,
      currentImgIndex: null,
    };
  },

  methods: {
    open(i) {
      this.opened = true;
      this.currentImgIndex = i;
    },
    close() {
      this.opened = false;
    },
    next() {
      if (this.currentImgIndex + 1 > this.images.length - 1) {
        this.currentImgIndex = 0;
      } else {
        ++this.currentImgIndex;
      }
    },
    prev() {
      if (this.currentImgIndex - 1 < 0) {
        this.currentImgIndex = this.images.length - 1;
      } else {
        --this.currentImgIndex;
      }
    }
  },
};
</script>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-inline: -8px;
}

.list__preview {
  padding: 8px;
  box-sizing: border-box;
  width: 20%;
  object-fit: cover;
  cursor: pointer;
}

.img-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.img-card img {
  max-height: 90vh;
  max-width: 90vw;
  cursor: pointer;
}

.prev-btn {
  position: fixed;
  left: 5vw;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
}

.next-btn {
  position: fixed;
  right: 5vw;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
}
</style>
