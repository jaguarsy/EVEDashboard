import Vue from 'vue';
import Router from 'vue-router';
import auth from '../services/auth';
import UserInfo from '@/pages/UserInfo.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Mail from '@/pages/Mail.vue';

Vue.use(Router);

const needAuth = (to, from, next) => {
  if (!auth.authorized()) {
    next('/user');
  }
  next();
};

export default new Router({
  routes: [
    { path: '/', component: Dashboard },
    { path: '/user', component: UserInfo },
    { path: '/mail', component: Mail, beforeEnter: needAuth },
  ],
});
