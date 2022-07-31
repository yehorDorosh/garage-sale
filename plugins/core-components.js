import Vue from 'vue';

import BaseButton from '@/components/ui/BaseButton';
import BaseDialog from '@/components/ui/BaseDialog';
import Fragment from '@/components/utils/Fragment';
import BaseCard from '@/components/ui/BaseCard';

Vue.component('BaseButton', BaseButton);
Vue.component('BaseDialog', BaseDialog);
Vue.component('BaseCard', BaseCard);
// eslint-disable-next-line vue/multi-word-component-names
Vue.component('Fragment', Fragment);
