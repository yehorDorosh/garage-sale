<template>
  <div class="outer">
    <!-- eslint-disable -->
    <style>
      :root {
        --img-width: {{ imageWidth }}px;
        --img-height: {{ imageHeight }}px;
        --computed-width: {{ 100 / imageAmount }}%;
      }
    </style>
    <!-- eslint-enable -->
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
      <slot />
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
    slideAmount: {
      type: Array,
      default: () => [1, 2, 3, 4],
    }
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
      sliders: [],
      translate: [],
      translateBuffer: [],
      y0: null,
      drag: false,
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

  watch: {
    translate(newValue) {
      this.sliders.forEach((elem, i) => {
        elem.style.transform = `translateX(${newValue[i]}px)`;
      });
    }
  },

  created() {
    if (process.client) {
      let timer;
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.resize();
        }, 50);
      });
      this.breakPoint();
    }
  },

  mounted() {
    this.sliders = [...this.$refs.container.children];
    this.sliders.forEach(elem => elem.classList.add('carusel__item'));
    this.resize();
    this.sliders.forEach((elem, i) => {
      this.translate.push(i * this.imageWidth);
      elem.addEventListener('click', (e) => {
        this.openSlide(e, i);
      });
      elem.addEventListener('touchend', (e) => {
        this.openSlide(e, i);
      });
    });
    setTimeout(() => {
      this.sliders.forEach(elem => elem.classList.add('animation'));
    }, 0);
  },

  destroyed() {
    window.removeEventListener('resize', this.resize);
  },

  methods: {
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
      this.mouseDown = true;
      const { x, y } = this.getTouches(e);
      this.x0 = x;
      this.y0 = y;
      this.translateBuffer = [...this.translate];
      this.drag = false;
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
      this.drag = true;
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
      this.breakPoint();
      this.imageWidth = this.$refs.container?.clientWidth / this.imageAmount;
      this.imageHeight = this.imageWidth;
      this.translate = this.translate.map((_, i) => i * this.imageWidth);
    },
    openSlide(e, i) {
      if (!this.drag) { this.$emit('open', e, i); }
      this.drag = false;
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
        this.imageAmount = this.slideAmount[0];
      } else if (window.innerWidth >= 512 && window.innerWidth < 768) {
        this.imageAmount = this.slideAmount[1];
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        this.imageAmount = this.slideAmount[2];
      } else if (window.innerWidth >= 1024) {
        this.imageAmount = this.slideAmount[3];
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
  object-fit: cover;
  cursor: pointer;
}

.animation {
  transition: transform 0.3s ease-out;
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
