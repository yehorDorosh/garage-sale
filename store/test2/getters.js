const getters = {
  getTvalue(state) {
    return state.tvalue;
  },
  getNvalue(_, getters) {
    return getters.getTvalue + ' reused';
  }
};

export default getters;

// this.$store.getters.getterName
// this.$store.getters['test2/getTvalue']

/**
import { mapGetters } from 'vuex';

 export default {
  computed: {
    ...mapGetters('namespace', ['somegetter'])
  },
};
*/
