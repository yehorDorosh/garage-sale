<template>
  <div class="outer">
    <base-button
      :class="{ hidden: limit === -1 || limit === 'hide' }"
      class="btn prev-btn"
      mode="arrow left"
      @click="prev"
      @touchend="prev"
    />
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
      <div
        v-for="(image, i) in sliders"
        :key="image.filename"
        :ref="i"
        class="carusel__item"
        :style="{transform: `translateX(${translate[i]}px)`}"
        @click="openSlide(i, $event)"
        @touchstart="startClickTimer"
        @touchend="openSlide(i, $event)"
      >
        <img
          class="carusel__card"
          :src="image.preview"
          :alt="image.alt"
        >
      </div>
    </div>
    <base-button
      :class="{ hidden: limit === 1 || limit === 'hide' }"
      class="btn next-btn"
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
      y0: null,
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
    setTimeout(() => {
      for (const key in this.$refs) {
        const elem = this.$refs[key][0];
        if (elem && elem.classList.contains('carusel__item')) {
          elem.classList.add('animation');
        }
      }
    }, 0);
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
        return touch[0] ? { x: touch[0].clientX, y: touch[0].clientY, isMobile: true } : { x: 0, y: 0, isMobile: true };
      } else {
        return { x: e.clientX, y: e.clientY, isMobile: false };
      }
    },
    touchStart(e) {
      e.preventDefault();
      this.startClickTimer();
      this.mouseDown = true;
      const { x, y } = this.getTouches(e);
      this.x0 = x;
      this.y0 = y;
      this.translateBuffer = [...this.translate];
    },
    touchMove(e) {
      const { x, y, isMobile } = this.getTouches(e);
      if (this.mouseDown) {
        this.x1 = x;
        this.move(this.x0, this.x1);
      }
      if (isMobile) {
        const shiftY = (y - this.y0) * -1;
        window.scrollBy(0, shiftY);
        this.y0 -= shiftY;
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
      if (clickTime < 150) { this.$emit('open', i); }
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
.outer {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.carusel {
  position: relative;
  overflow: hidden;
  height: var(--img-height);
  flex-grow: 1;
}

.carusel__item {
  position: absolute;
  padding: 8px;
  box-sizing: border-box;
  height: var(--img-height);
  width: var(--computed-width);
  cursor: pointer;
}

.animation {
  transition: transform 0.3s ease-out;
}

.carusel__card {
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  object-fit: cover;
  box-shadow: 0 0 8px 1px lightgray;
  width: 100%;
}

.btn {
  width: 32px;
}

.btn:hover {
  border-radius: 8px;
  box-shadow: 0 0 8px 1px lightgray;
}

.hidden {
  visibility: hidden;
}
</style>
