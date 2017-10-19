<template>
  <div class="page-container">
    <div class="login-panel" v-if="!auth.authorized()">
      <h4 class="title">NO ACCOUNT</h4>
      <div class="well">
        <button class="btn btn-primary" type="button" @click="handleLogin">Sign In</button>
      </div>
    </div>
    <div class="info-panel" v-if="auth.authorized() && auth.userInfo.name">
      <h3 class="title">ACCOUNT</h3>
      <div class="well avator">
        <img :src="auth.userInfo.px128x128" style="max-width:128px;max-height:128px;" class="avator-img">
        <div class="avator-content">
          <div class="row">
            <div class="col-xs-6">
              <h6 class="title">USERNAME</h6>
              <p>{{auth.userInfo.name}}</p>
            </div>
            <div class="col-xs-6">
              <h6 class="title">BIRTHDAY</h6>
              <p>{{new Date(auth.userInfo.birthday).toLocaleString()}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-6">
              <h6 class="title">FATIGUE REMAIN</h6>
              <p>{{fatigueRemain}}</p>
            </div>
            <div class="col-xs-6">
              <h6 class="title">LOCATION</h6>
              <p>
                {{auth.userInfo.currentStructureName || auth.userInfo.currentStationName}}
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-6">
              <h6 class="title">BALANCE</h6>
              <p>{{balanceStr}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="well">
        <button class="btn btn-danger pull-right" @click="handleSignOut">
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  const http = window.require('http');
  const electron = window.require('electron');
  //  const ipcRenderer = electron.ipcRenderer;
  const shell = electron.shell;
  import toQuery from '../utils/toQuery';
  import queryToObj from '../utils/queryToObj';
  import numberFormat from '../utils/numberFormat';
  import remainTimeFormat from '../utils/remainTimeFormat';
  import config from '../config';
  import auth from '../services/auth';
  import user from '../services/user';

  const BASE_URL = 'https://login.eveonline.com/oauth/authorize';

  const createHttpServer = (port = 10407) => {
    console.log('create http server at', port);

    const server = http.createServer((req, res) => {
      const result = queryToObj(req.url);
      if (!result.code) {
        return;
      }
      auth.saveCode(result.code);

      user
        .getToken()
        .then(user.init)
        .then(() => {
          console.log('登录成功');
        });

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('登录成功！', 'utf-8');
      server.close();
    }).listen(port, 'localhost');
  };

  export default {
    name: 'userInfo',
    data() {
      return {
        auth,
        params: {
          response_type: 'code',
          redirect_uri: config.callback,
          client_id: config.clientId,
          scope: config.scopes.join(' '),
          state: 'evedashboard',
        },
      };
    },
    computed: {
      fatigueRemain() {
        return remainTimeFormat(
          this.auth.userInfo.jumpFatigueExpireDate - new Date());
      },
      balanceStr() {
        return numberFormat(this.auth.userInfo.balance);
      },
    },
    methods: {
      handleLogin() {
        shell.openExternal(`${BASE_URL}?${toQuery(this.params)}`);
        createHttpServer();
      },
      handleSignOut() {
        auth.signOut();
      }
    },
  };
</script>

<style>
  .avator {
    display: flex;
  }

  .avator .avator-img {
    border-radius: 100%;
    background: transparent;
  }

  .avator .avator-content {
    padding-left: 20px;
    flex: 5;
  }
</style>
