import { createRouter, createWebHashHistory } from 'vue-router';
import MetronomeView from '../views/MetronomeView.vue';
import CoursesView from '../views/CoursesView.vue';
import EarTrainingView from '../views/EarTrainingView.vue';
import SheetMusicView from '../views/SheetMusicView.vue';

const routes = [
  { path: '/', redirect: '/metronome' },
  { path: '/metronome', component: MetronomeView },
  { path: '/courses', component: CoursesView },
  { path: '/courses/ear-training', component: EarTrainingView },
  { path: '/sheet-music', component: SheetMusicView },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
