import Vue from 'vue';
import ShortKey from 'vue-shortkey';
import App from './App.vue';
import auth from './services/auth';
import user from './services/user';
import types from './store/types';
import router from './router';

Vue.use(ShortKey);

const startApp = () => {
  new Vue({
    router,
    el: '#app',
    render: h => h(App),
  });
};

types.load().then(() => {
  if (auth.accessToken && auth.refreshToken) {
    user
      .init()
      .then(() => {
        user.refreshToken();
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        startApp();
      });
  } else {
    auth.signOut();
    startApp();
  }
});
