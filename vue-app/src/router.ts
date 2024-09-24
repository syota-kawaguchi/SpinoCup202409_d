// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import GameComponent from './components/Game.vue';
import SharedScoreComponent from './components/SharedScore.vue';

const routes = [
  { path: '/vue', component: GameComponent },
  { path: '/vue/score/:id', component: SharedScoreComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;