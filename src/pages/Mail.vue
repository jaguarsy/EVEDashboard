<template>
  <div class="page-container flex-box">
    <table class="table">
      <thead>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>From</th>
        <th>Title</th>
        <th>Time</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in mails">
        <td>{{index + 1}}</td>
        <td>{{item.labelNames.join(',')}}</td>
        <td>{{item.fromName}}</td>
        <td><a href="javascript:void(0)"
               @click="showMailDetail(item)">{{item.subject}}</a></td>
        <td style="white-space: nowrap;">{{item.time}}</td>
      </tr>
      </tbody>
    </table>

    <mail-detail :mail-id="openMailId" :mail-from="openMailFrom" @close="handleMailDetailClose"></mail-detail>
  </div>
</template>

<script type="text/babel">
  import auth from '../services/auth';
  import mail from '../store/mail';
  import mailApi from '../services/mail';
  import mailDetail from '../components/MailDetail.vue';

  export default {
    name: 'mail',
    components: {
      mailDetail,
    },
    data() {
      return {
        mail,
        user: auth.userInfo,
        mails: [],
        mailLabels: {},
        activeIdx: 0,
        openMailId: null,
        openMailFrom: null,
      };
    },
    mounted() {
      mailApi
        .getMailLabels()
        .then((result) => {
          if (result && result.labels) {
            result.labels.forEach(p => {
              this.mailLabels[p.label_id] = p.name;
            });
          }
          return this.loadMails();
        });
    },
    methods: {
      loadMails() {
        return mailApi
          .getMails()
          .then((list) => {
            list.forEach(p => {
              p.labelNames = p.labels.map(t => this.mailLabels[t]);
              p.recipients.forEach(p => {
                if (p.recipient_type === 'mailing_list') {
                  const target = mail.mailList.find(t =>
                  t.mailing_list_id === t.recipient_id);
                  if (target) {
                    p.labelNames.push(target.name);
                  }
                }
              });
            });
            this.mails = this.mails.concat(list);
          });
      },

      showMailDetail(item) {
        console.log(item);
        this.openMailId = item.mail_id;
        this.openMailFrom = item.fromName;
      },

      handleMailDetailClose() {
        this.openMailId = null;
      },
    },
  };
</script>

<style>
  button.list-group-item {
    background: #292b30;
    line-height: 18px;
    padding: 8px;
    margin-bottom: 0;
    border-radius: 4px;
    border: none;
    color: #f1f0f2;
  }

  button.list-group-item:hover {
    background: #232529;
    color: #f1f0f2;
  }

  button.list-group-item:focus,
  button.list-group-item.active,
  button.list-group-item.active,
  button.list-group-item.active:hover,
  button.list-group-item.active:focus {
    background: #eee;
    border: none;
    color: #292b30;
    outline: none;
  }

  .list-group-item.list-group-title {
    background: #292b30;
    color: #999;
    padding: 8px;
    border: none;
  }

  .pagination {
    margin: 0;
  }

  .pagination > li > a,
  .pagination > li > span {
    color: #f1f0f2;
    background-color: transparent;
    border: none;
    border-radius: 4px;
  }
</style>
