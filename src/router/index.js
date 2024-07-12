import { createRouter, createWebHashHistory } from 'vue-router'

import Start from "../components/start.vue";

const router = createRouter({
  routes: [{
      path: '/',
      component: Start
    }
  ],
  history: createWebHashHistory()
});

export default router;
