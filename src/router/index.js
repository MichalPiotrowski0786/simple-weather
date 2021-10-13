import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Radar from '../components/Radar.vue';
import Synop from '../components/Synop.vue';
import User from '../components/User.vue';
import Wxmap from '../components/Wxmap.vue';

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
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  {
    path: '/wxmap',
    name: 'Wxmap',
    component: Wxmap,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
