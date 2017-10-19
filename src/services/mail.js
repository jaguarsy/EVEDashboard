import moment from 'moment';
import auth from './auth';
import userApi from './user';
import mailStore from '../store/mail';
import storage from '../utils/storage';
import request from '../utils/request';

const mailApi = {
  // 获取邮件列表
  getMailList({
                CharacterID
              } = auth.userInfo) {
    return request
      .getFromESI(`/characters/${CharacterID}/mail/lists/`)
      .then(result => {
        mailStore.mailList = result || [];
        return result;
      });
  },

  // 获取邮件Header
  getMails(lastMailId, {
    CharacterID
  } = auth.userInfo) {
    return request
      .getFromESI(`/characters/${CharacterID}/mail/`, {
        last_mail_id: lastMailId,
      })
      .then(result => {
        if (!result || !result.length) {
          return [];
        }

        return userApi
          .getCharactersNames(result.map(p => p.from))
          .then(nameMap => {
            result.forEach(p => {
              p.fromName = nameMap[p.from];
              p.time = moment(p.timestamp).format('YYYY-MM-DD HH:mm:ss');
            });
            return result;
          });
      });
  },

  // 获取邮件Labels
  getMailLabels({ CharacterID } = auth.userInfo) {
    return request
      .getFromESI(`/characters/${CharacterID}/mail/labels/`);
  },

  // 获取邮件内容
  getMailDetail(mailId, {
    CharacterID
  } = auth.userInfo) {
    const mailDetails = storage.getItem('mail-detail') || {};
    if (mailDetails[mailId]) {
      return Promise.resolve(mailDetails[mailId]);
    }

    return request
      .getFromESI(`/characters/${CharacterID}/mail/${mailId}/`)
      .then((result) => {
        mailDetails[mailId] = result;
        storage.setItem('mail-detail', mailDetails);
        return result;
      });
  },
};

export default mailApi;
