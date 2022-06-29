import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App)
  .use(PrimeVue, {
    ripple: true,
  })
  .mount('#app');
