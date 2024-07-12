import { createApp } from 'vue';
import router from './router/index.js';

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log(error);
  return false;
};

const app = createApp({});

app.config.errorHandler = function (err, vm, info) {
  console.log(err);
};

app.use(router);
app.mount('#app');