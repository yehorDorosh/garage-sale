<template>
  <div v-show="pages > 1" class="pagginator">
    <ul class="page-list">
      <li class="page-num" :class="{ active: 1 === currentPage, hidden: currentPage < 3 }">
        <a :href="`${path}?page=1`" @click="openPage(1, $event)">
          First
        </a>
      </li>
      <base-button
        class="btn prev-btn"
        :class="{ hidden: currentPage <= 1 }"
        mode="arrow left"
        @click="openPage(currentPage - 1)"
      />
      <li :class="{ hidden: currentPage <= 3 }" class="page-num">
        ...
      </li>
      <li
        v-for="page in pages"
        v-show="page <= currentPage + 2 && page >= currentPage - 2"
        :key="page"
        class="page-num"
        :class="{
          active: page === currentPage,
        }"
      >
        <a :href="`${path}?page=${page}`" @click="openPage(page, $event)">
          {{ page }}
        </a>
      </li>
      <li :class="{ hidden: (pages - currentPage) <= 2 }" class="page-num">
        ...
      </li>
      <base-button
        class="btn next-btn"
        :class="{ hidden: currentPage >= pages }"
        mode="arrow right"
        @click="openPage(currentPage + 1)"
      />
      <li class="page-num" :class="{ active: pages === currentPage, hidden: currentPage > (pages - 2) }">
        <a :href="`${path}?page=${pages}`" @click="openPage(pages, $event)">
          Last
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    totalAmount: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      default: '',
    },
    restApi: {
      type: Boolean,
      default: false
    }
  },

  emits: ['getData'],

  data() {
    return {
      currentPage: 1,
    };
  },

  computed: {
    pages() {
      return Math.ceil(this.totalAmount / this.perPage) || 0;
    }
  },

  methods: {
    openPage(page, e) {
      this.$router.push({ path: this.$route.path, query: { page } });
      if (this.restApi) {
        if (e) { e.preventDefault(); }
        this.currentPage = page;
        this.$emit('getData', +page);
      }
    }
  },
};
</script>

<style scoped>
.pagginator {
  display: flex;
  justify-content: center;
  margin-block: 16px;
}

.page-list {
  display: flex;
  align-items: center;
}

.page-num {
  display: block;
  padding: 4px 8px;
}

.page-num a {
  text-decoration: none;
  color: inherit;
  transition: color 300ms;
}

.page-num a:hover {
  color: var(--accent);
}

.active {
  color: var(--accent);
  border: 1px solid var(--accent);
}

.btn {
  border-color: var(--accent) !important;
  height: 8px;
  padding: 3px !important;
  margin-inline: 8px;
}

.hidden {
  visibility: hidden;
}
</style>
