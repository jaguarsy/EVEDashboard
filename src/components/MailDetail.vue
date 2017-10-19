<template>
  <full-screen-dialog @close="handleClose" v-if="mailId">
    <div slot="body" v-if="mail.subject">
      <div class="row">
        <div class="col-xs-6">
          <h6 class="title">SUBJECT</h6>
          <p>{{mail.subject}}</p>
        </div>
        <div class="col-xs-6">
          <h6 class="title">FROM</h6>
          <p>
            {{mailFrom}}
            <small>{{new Date(mail.timestamp).toLocaleString()}}</small>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <h6 class="title">BODY</h6>
          <p v-html="mail.body"></p>
        </div>
      </div>
    </div>

    <div slot="body" v-if="!mail.subject">
      loading...
    </div>
  </full-screen-dialog>
</template>

<script type="text/babel">
  import mailApi from '../services/mail';
  import fullScreenDialog from './common/FullScreenDialog.vue';

  export default {
    name: 'mail-detail',
    components: {
      fullScreenDialog,
    },
    props: {
      mailId: {
        type: Number,
        default: 0,
      },
      mailFrom: {
        type: String,
        default: null,
      },
    },
    watch: {
      mailId() {
        if (this.mailId) {
          mailApi
            .getMailDetail(this.mailId)
            .then((result) => {
              this.mail = result;
            });
        } else {
          this.mail = {};
        }
      }
    },
    data() {
      return {
        mail: {},
      };
    },
    methods: {
      handleClose() {
        this.$emit('close');
      },
    },
  };
</script>
