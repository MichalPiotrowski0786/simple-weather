import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Radar from '../components/Radar.vue';
import Synop from '../components/Synop.vue';
import User from '../components/User.vue';
import SynopMap from '../components/SynopMap.vue';

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
    path: '/synopmap',
    name: 'SynopMap',
    component: SynopMap,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
