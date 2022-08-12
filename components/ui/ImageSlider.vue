<template>
  <Fragment>
    <div v-show="opened" class="backdrop" @click="close" />
    <base-button v-show="opened" class="btn prev-btn" mode="arrow left" @click="prev" />
    <base-button v-show="opened" class="btn next-btn" mode="arrow right" @click="next" />
    <image-carusel :sliders="images" @open="open" />
    <div v-show="opened" class="img-card">
      <close-cross @click="close" />
      <img
        :src="images[currentImgIndex].path"
        :alt="images[currentImgIndex].alt"
        @click="next"
      >
    </div>
  </Fragment>
</template>

<script>
import CloseCross from '~/components/ui/CloseCross';
import ImageCarusel from '~/components/ui/ImageCarusel';

export default {
  components: {
    CloseCross,
    ImageCarusel,
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
      currentImgIndex: 0,
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

.btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.prev-btn {
  left: 5vw;
}

.next-btn {
  right: 5vw;
}
</style>
