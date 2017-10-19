<template>
  <div class="container">
    <div class="container-left-panel">
      <div class="close-panel">
        <a class="circle-btn circle-btn-danger" @click="handleClose"></a>
        <a class="circle-btn circle-btn-warning" @click="handleMinimize"></a>
        <a class="circle-btn circle-btn-success" @click="handleMaximize"></a>
      </div>

      <div class="user-panel">
        <router-link to="/user" class="user-photo">
          <img v-if="auth.userInfo.px64x64"
               :src="auth.userInfo.px64x64 || '//:0'">
          <span v-if="!auth.userInfo.px64x64">Not Logged</span>
        </router-link>
      </div>

      <div class="menu">
        <router-link to="/" class="menu-item">
          <i class="fa fa-dashboard"></i>
        </router-link>
        <router-link to="/mail" class="menu-item">
          <i class="fa fa-envelope"></i>
        </router-link>
      </div>
    </div>

    <div class="container-right-panel">
      <div class="top-panel"
           @dblclick="handleMaximize"
           v-shortkey="{up: ['arrowup'], down: ['arrowdown'], enter: ['enter'], esc: ['esc']}"
           @shortkey="handleKeyDown">
        <input type="search"
               class="form-control"
               placeholder="search"
               v-model="keyword"
               @input="handleSearchInput">
        <div class="search-result-list"
             refs="result-list"
             v-show="searchType.list.length">
          <a class="item"
             :class="{active: activeIdx===idx}"
             @click="handleChooseType(item.id, idx)"
             :key="item.id"
             v-for="(item, idx) in searchType.list">
            {{item.en}}
            <span v-if="item.zh">- {{item.zh}}</span>
          </a>
          <p class="title" v-if="searchType.count > searchType.list.length">
            <small>{{searchType.count - searchType.list.length}}&nbsp;more</small>
          </p>
        </div>
      </div>
      <router-view></router-view>
      <type-detail :value="chooseItem" @close="handleCloseItemDetail"></type-detail>
    </div>
  </div>
</template>

<script type="text/babel">
  import typeDetail from '@/components/TypeDetail.vue';
  import auth from './services/auth';
  import types from './store/types';

  import './assets/bootstrap.min.css';
  import './assets/font-awesome.min.css';
  import './assets/app.less';

  const win = window.require('electron').remote.getCurrentWindow();

  export default {
    name: 'app',
    data() {
      return {
        auth,
        keyword: null,
        searchType: {
          list: [],
          count: 0,
        },
        activeIdx: 0,
        chooseItem: null,
      };
    },
    components: {
      typeDetail,
    },
    methods: {
      handleMaximize() {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      },
      handleMinimize() {
        win.minimize();
      },
      handleClose() {
        win.close();
      },
      handleSearchInput() {
        if (this.keyword) {
          this.searchType = types.search(this.keyword);
        } else {
          this.searchType = { list: [], count: 0 };
        }
        this.activeIdx = 0;
      },
      handleChooseType(id, idx) {
        this.activeIdx = idx;
        this.chooseItem = types.getType(id);
      },
      handleCloseItemDetail() {
        this.chooseItem = null;
      },
      handleKeyDown(event) {
        const len = this.searchType.list.length;

        switch (event.srcKey) {
          case 'up':
            this.activeIdx--;
            break;
          case 'down':
            this.activeIdx++;
            break;
          case 'enter':
            this.chooseItem = types.getType(this.searchType.list[this.activeIdx].id);
            break;
          case 'esc':
            if (this.chooseItem) {
              this.chooseItem = null;
            } else {
              this.keyword = null;
            }
            break;
        }

        if (this.activeIdx < 0) {
          this.activeIdx = len - 1;
        } else if (this.activeIdx >= len) {
          this.activeIdx = 0;
        }
      },
    },
  };
</script>

<style>
  .search-result-list {
    position: absolute;
    width: 450px;
    max-height: 400px;
    overflow-y: auto;
    background: #292b30;
    border: solid 1px #212327;
    margin-top: 1px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.46);
    z-index: 1;
  }

  .search-result-list > .item {
    display: block;
    padding: 6px 12px;
    cursor: pointer;
    color: #e6e5e7;
    text-decoration: none;
    border-bottom: solid 1px #333;
    transition: background 0.1s ease-in-out;
  }

  .search-result-list > .item.active {
    color: inherit;
    background: #191b1f;
  }

  .search-result-list > .item:hover {
    color: inherit;
    background: #1f2125;
  }

  .search-result-list .title {
    display: block;
    margin: 0;
    padding: 6px 12px;
    color: #d7d6d8;
  }
</style>
