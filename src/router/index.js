import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Radar from '../components/RadarComponent.vue';
import Synop from '../components/SynopComponent.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/radar',
    name: 'Radar',
    component: Radar,
  },
  {
    path: '/synop',
    name: 'Synop',
    component: Synop,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
