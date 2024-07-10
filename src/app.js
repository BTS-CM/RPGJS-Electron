import { createApp } from 'vue';

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log(error);
  return false;
};

const app = createApp({});

app.config.errorHandler = function (err, vm, info) {
  console.log(err);
};

app.mount('#app');
