<template>
  <full-screen-dialog @close="handleClose" v-if="currentType">
    <div slot="header">
      <div class="btn-group">
        <button class="btn btn-xs btn-default"
                :disabled="currentIndex===0"
                @click="prev">
          <i class="fa fa-angle-double-left"></i>
        </button>
        <button class="btn btn-xs btn-default"
                :disabled="currentIndex>=typeHistory.length-1"
                @click="next">
          <i class="fa fa-angle-double-right"></i>
        </button>
      </div>
    </div>
    <div @click="handleClick" slot="body">
      <div class="row">
        <div class="col-xs-12">
          <h6 class="title">NAME</h6>
          <p>{{currentType.name.en}} - {{currentType.name.zh}}</p>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-3" v-if="currentType.volume">
          <h6 class="title">VOLUME</h6>
          <p>{{numberFormat(currentType.volume)}}m<sup>3</sup></p>
        </div>
        <div class="col-xs-3" v-if="currentType.capacity">
          <h6 class="title">CAPACITY</h6>
          <p>{{numberFormat(currentType.capacity)}}m<sup>3</sup></p>
        </div>
        <div class="col-xs-6" v-if="currentType.marketGroupID">
          <h6 class="title">JITA PRICE</h6>
          <p>
            <a href="javascript:void(0)"
               @click="handleFetchPrice"
               v-if="!price">
              {{isLoadingPrice ? '获取中...' : '获取吉他售价'}}
            </a>
            <span v-if="price">
            {{numberFormat(price.price)}}isk&nbsp;-&nbsp;{{price.issuedDate}}
          </span>
            <a href="javascript:void(0)"
               @click="handleFetchPrice"
               v-if="price">
              [刷新]
            </a>
          </p>
        </div>
      </div>

      <div class="row" v-if="currentType.description">
        <div class="col-xs-12">
          <h6 class="title">DESCRIPTION</h6>
          <p v-html="currentType.description.en"></p>
          <p>
            <small v-html="currentType.description.zh"></small>
          </p>
        </div>
      </div>

      <div class="row" v-if="roleBonuses.length||traitTypes.length">
        <div class="col-xs-12">
          <h6 class="title">TRAITS</h6>
          <div v-if="roleBonuses.length">
            <p><strong>Role Bonus:</strong></p>
            <ol>
              <li v-for="p in roleBonuses">
                <span v-if="p.bonus">{{p.bonus}}%</span>
                <span v-html="p.bonusText.en"></span>
              </li>
            </ol>
          </div>
          <!--<div v-if="miscBonuses.length">-->
          <!--<p><strong>Misc Bonus:</strong></p>-->
          <!--<ol>-->
          <!--<li v-for="p in miscBonuses">-->
          <!--<span v-if="p.bonus">{{p.bonus}}%</span>-->
          <!--<span v-html="p.bonusText.en"></span>-->
          <!--</li>-->
          <!--</ol>-->
          <!--</div>-->
          <div v-for="item in traitTypes">
            <p><strong>{{getTypeName(item.id)}}&nbsp;(per kill level):</strong></p>
            <ol>
              <li v-for="p in item.list">
                <span v-if="p.bonus">{{p.bonus}}%</span>
                <span v-html="p.bonusText.en"></span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </full-screen-dialog>
</template>

<script type="text/babel">
  import fullScreenDialog from './common/FullScreenDialog.vue';
  import numberFormat from '../utils/numberFormat';
  import marketApi from '../services/market';
  import types from '../store/types';

  const showInfoRe = /showinfo:(\d+)/;

  export default {
    components: {
      fullScreenDialog,
    },
    props: {
      value: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        currentType: null,
        typeHistory: [],
        currentIndex: 0,

        isLoadingPrice: false,
        price: null,
      };
    },
    watch: {
      value() {
        if (this.value) {
          this.currentType = this.value;
          this.typeHistory.push(this.currentType);
          this.currentIndex = 0;
        } else {
          this.currentType = null;
          this.typeHistory = [];
          this.currentIndex = 0;
        }
      },
    },
    computed: {
      traitTypes() {
        if (this.currentType
          && this.currentType.traits
          && this.currentType.traits.types) {
          return Object
            .keys(this.currentType.traits.types)
            .map(id => ({
              list: this.currentType.traits.types[id],
              id,
            }));
        }
        return [];
      },
      roleBonuses() {
        if (this.currentType
          && this.currentType.traits
          && this.currentType.traits.roleBonuses) {
          return this.currentType.traits.roleBonuses;
        }
        return [];
      },
      miscBonuses() {
        if (this.currentType
          && this.currentType.traits
          && this.currentType.traits.miscBonuses) {
          return this.currentType.traits.miscBonuses;
        }
        return [];
      },
    },
    methods: {
      numberFormat,
      getTypeName(id) {
        return types.getType(id).name.en;
      },
      handleClose() {
        this.$emit('close');
      },
      handleFetchPrice() {
        this.isLoadingPrice = true;
        marketApi.getPriceInJita(this.currentType.typeId)
          .then(price => {
            this.price = price;
          })
          .catch(err => {
            console.log(err);
          })
          .then(() => {
            this.isLoadingPrice = false;
          });
      },
      handleClick(evt) {
        const href = evt.target.href;
        if (href && showInfoRe.test(href)) {
          this.push(href.match(showInfoRe)[1]);
        }
      },
      next() {
        if (this.currentIndex < this.typeHistory.length - 1) {
          this.currentIndex++;
        }
        this.currentType = this.typeHistory[this.currentIndex];
      },
      prev() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        }
        this.currentType = this.typeHistory[this.currentIndex];
      },
      push(id) {
        const item = types.getType(id);
        if (this.currentIndex === this.typeHistory.length - 1) {
          this.typeHistory.push(item);
        } else {
          this.typeHistory = this.typeHistory
            .slice(0, this.currentIndex + 1)
            .concat(item);
        }
        this.currentType = item;
        this.currentIndex++;
      },
    },
  };
</script>
