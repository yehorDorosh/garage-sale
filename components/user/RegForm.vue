<template>
  <base-form :submit-cb="submit" btn-txt="Create account" />
</template>

<script>
import BaseForm from '~/components/ui/BaseForm';

export default {
  components: {
    BaseForm,
  },
  methods: {
    submit(e) {
      console.log('registration', e);
    }
  }
};
</script>
