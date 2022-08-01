<template>
  <div
    ref="container"
    class="carusel"
    @touchstart="touchStart"
    @mousedown="touchStart"
    @touchmove="touchMove"
    @mousemove="touchMove"
    @touchend="touchEnd"
    @mouseup="touchEnd"
    @mouseleave="touchEnd"
  >
    <!-- eslint-disable -->
    <style>
      :root {
        --img-width: {{ imageWidth }}px;
        --img-height: {{ imageHeight }}px;
        --computed-width: {{ 100 / imageAmount }}%;
      }
    </style>
    <!-- eslint-enable -->
    <img
      v-for="(image, i) in sliders"
      :key="image.filename"
      :ref="i"
      class="carusel__item"
      :src="image.preview"
      :alt="image.alt"
      :style="{transform: `translateX(${translate[i]}px)`}"
      @click="openSlide(i, $event)"
      @touchstart="startClickTimer"
      @touchend="openSlide(i, $event)"
    >
    <base-button
      v-show="limit !== -1 && limit !== 'hide'"
      class="prev-btn"
      mode="arrow left"
      @click="prev"
      @touchend="prev"
    />
    <base-button
      v-show="limit !== 1 && limit !== 'hide'"
      class="next-btn"
      mode="arrow right"
      @click="next"
      @touchend="next"
    />
  </div>
</template>

<script>
export default {
  props: {
    sliders: {
      type: Array,
      required: true,
    },
  },

  emits: ['open'],

  data() {
    return {
      imageWidth: 200,
      imageHeight: 200,
      imageAmount: 4,
      speed: 1.5,
      x0: null,
      x1: null,
      mouseDown: false,
      mouseDownT: null,
      mouseUpT: null,
      translate: [],
      translateBuffer: [],
    };
  },

  computed: {
    limit() {
      const caruselShift = (this.imageAmount - 1) * this.imageWidth;
      if (this.sliders.length <= this.imageAmount) {
        return 'hide';
      } else if (this.translate.at(-1) <= caruselShift) {
        return 1;
      } else if (this.translate[0] >= 0) {
        return -1;
      } else {
        return 0;
      }
    }
  },

  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('resize', this.resize);
      this.breakPoint();
    }
  },

  mounted() {
    this.resize();
    this.sliders.forEach((elem, i) => {
      this.translate.push(i * this.imageWidth);
    });
  },

  destroyed() {
    window.removeEventListener('resize', this.resize);
  },

  methods: {
    startClickTimer() {
      this.mouseDownT = new Date();
    },
    getTouches(e) {
      if (e.touches) {
        const touch = e.touches;
        return touch[0] ? touch[0].clientX : 0;
      } else {
        return e.clientX;
      }
    },
    touchStart(e) {
      e.preventDefault();
      this.startClickTimer();
      this.mouseDown = true;
      this.x0 = this.getTouches(e);
      this.translateBuffer = [...this.translate];
    },
    touchMove(e) {
      if (this.mouseDown) {
        this.x1 = this.getTouches(e);
        this.move(this.x0, this.x1);
      }
    },
    touchEnd(e) {
      this.mouseDown = false;
      if (this.sliders.length <= this.imageAmount) { return; }
      this.sliderScrollLimit();
      this.translate = this.translate.map((imgPos) => {
        return Math.round(imgPos / this.imageWidth) * this.imageWidth;
      });
    },
    move(x0, x) {
      if (this.sliders.length <= this.imageAmount) { return; }
      const shiftY = (x - x0) * this.speed;
      this.translate = this.translateBuffer.map((imgPos) => {
        return imgPos + shiftY;
      });
    },
    resize() {
      this.imageWidth = this.$refs.container.clientWidth / this.imageAmount;
      this.imageHeight = this.imageWidth;
      this.translate = this.translate.map((_, i) => i * this.imageWidth);
      this.breakPoint();
    },
    openSlide(i, e) {
      this.mouseUpT = new Date();
      const clickTime = this.mouseUpT - this.mouseDownT;
      if (clickTime < 200) { this.$emit('open', i); }
    },
    prev() {
      this.translate = this.translate.map(imgPos => imgPos + this.imageWidth);
      this.sliderScrollLimit();
    },
    next() {
      this.translate = this.translate.map(imgPos => imgPos - this.imageWidth);
      this.sliderScrollLimit();
    },
    sliderScrollLimit() {
      const caruselShift = (this.imageAmount - 1) * this.imageWidth;
      if (this.translate[0] > 0) {
        this.translate = this.translate.map((_, i) => i * this.imageWidth);
      } else if (this.translate.at(-1) < caruselShift) {
        this.translate = this.translate.map((_, i, arr) => {
          const l = arr.length;
          const indexFromEnd = l - i - 1;
          return caruselShift - (indexFromEnd * this.imageWidth);
        });
      }
    },
    breakPoint() {
      if (window.innerWidth < 512) {
        this.imageAmount = 1;
      } else if (window.innerWidth >= 512 && window.innerWidth < 768) {
        this.imageAmount = 2;
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        this.imageAmount = 3;
      } else if (window.innerWidth >= 1024) {
        this.imageAmount = 4;
      }
    }
  },
};
</script>

<style scoped>
.carusel {
  position: relative;
  overflow: hidden;
  height: var(--img-height);
}

.carusel__item {
  position: absolute;
  padding: 8px;
  box-sizing: border-box;
  height: var(--img-height);
  width: var(--computed-width);
  object-fit: cover;
  transition: transform 0.3s ease-out;
  cursor: pointer;
}

.prev-btn {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-color: var(--accent) !important;
}

.next-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-color: var(--accent) !important;
}
</style>
