const actions = {
  testa(context, payload) {
    context.commit('testm', payload);
  }
};

export default actions;

// this.$store.dispatch('test2/testa', 'new value action');

/**
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('namespace', {
      act1: 'action1',
      act2: 'action2'
    })
  }
}
*/
