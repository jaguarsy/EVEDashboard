import auth from './auth';
import mailApi from './mail';
import walletApi from './wallet';
import universeApi from './universe';
import mailStore from '../store/mail';
import request from '../utils/request';
import chainFunc from '../utils/chainFunc';
import storage from '../utils/storage';

const OAUTH_URL = 'https://login.eveonline.com/oauth/token';
const OAUTH_VERIFY_URL = 'https://login.eveonline.com/oauth/verify';

const userApi = {
  // 根据access_token初始化所有用户相关数据
  init() {
    return userApi
      .verifyToken()
      .then(chainFunc(userApi.getCharacterInfo))
      .then(chainFunc(userApi.getPortrait))
      .then(chainFunc(userApi.getCharacterFatigue))
      .then(chainFunc(userApi.getCharacterLocation))
      .then(chainFunc(walletApi.getWalletBalance))
      .then(chainFunc(mailApi.getMailList));
  },

  getToken() {
    return request
      .postForm(OAUTH_URL, {
        grant_type: 'authorization_code',
        code: auth.code,
      })
      .then(result => {
        if (result.access_token && result.refresh_token) {
          auth.saveToken(result);
        }
        return result;
      });
  },

  verifyToken() {
    return request
      .get(OAUTH_VERIFY_URL)
      .then(result => {
        if (result.CharacterID) {
          auth.updateUserInfo(result);
        } else {
          auth.signOut();
        }
        return result;
      })
      .catch(() => {
        auth.signOut();
      });
  },

  refreshToken() {
    return request
      .postForm(OAUTH_URL, {
        grant_type: 'refresh_token',
        refresh_token: auth.refreshToken,
      })
      .then(result => {
        if (result.access_token && result.refresh_token) {
          auth.saveToken(result);
        }
        return result;
      });
  },

  // 获取角色详细信息
  getCharacterInfo({ CharacterID }) {
    return request
      .getFromESI(`/characters/${CharacterID}/`)
      .then(result => {
        if (result.name) {
          auth.updateUserInfo(result);
        }
        return result;
      });
  },

  // 获取头像
  getPortrait({ CharacterID }) {
    return request
      .getFromESI(`/characters/${CharacterID}/portrait/`)
      .then(result => {
        if (result.px64x64) {
          auth.updateUserInfo(result);
        }
        return result;
      });
  },

  // 获取邮件列表
  getMailList({ CharacterID }) {
    return request
      .getFromESI(`/characters/${CharacterID}/mail/lists/`)
      .then(result => {
        mailStore.mailList = result || [];
        return result;
      });
  },

  // 根据ID获取昵称
  getCharactersNames(ids) {
    const allCharacterNames = storage.getItem('characters') || {};

    const filteredIds = ids.filter(p => !allCharacterNames[p]);

    const result = {};

    if (!filteredIds.length) {
      ids.forEach(p => {
        result[p] = allCharacterNames[p];
      });
      return Promise.resolve(result);
    }

    return request
      .getFromESI(`/characters/names/`, {
        character_ids: filteredIds,
      })
      .then(list => {
        list.forEach(p => {
          allCharacterNames[p.character_id] = p.character_name;
        });
        storage.setItem('characters', allCharacterNames);

        ids.forEach(p => {
          result[p] = allCharacterNames[p];
        });
        return result;
      });
  },

  // 获取角色跳跃疲劳
  getCharacterFatigue({ CharacterID }) {
    return request
      .getFromESI(`/characters/${CharacterID}/fatigue/`)
      .then(result => {
        if (result.jump_fatigue_expire_date) {
          auth.updateUserInfo({
            jumpFatigueExpireDate: new Date(result.jump_fatigue_expire_date),
            lastJumpDate: new Date(result.last_jump_date),
            lastUpdateDate: new Date(result.last_update_date),
          });
        }
        return result;
      });
  },

  // 获取角色位置
  getCharacterLocation({ CharacterID }) {
    return request
      .getFromESI(`/characters/${CharacterID}/location/`)
      .then(result => {
        const tasks = [];

        if (result.solar_system_id) {
          tasks.push(universeApi.getSystemInfo(result.solar_system_id));
        }

        if (result.structure_id) {
          tasks.push(universeApi.getStructureInfo(result.structure_id));
        } else if (result.station_id) {
          tasks.push(universeApi.getStationInfo(result.station_id));
        }

        return Promise
          .all(tasks)
          .then(data => {
            const locationInfo = {};
            if (result.solar_system_id) {
              locationInfo.currentSystemId = result.solar_system_id;
              locationInfo.currentSystemName = data[0].name;
            }
            if (result.structure_id) {
              locationInfo.currentStructureId = result.structure_id;
              locationInfo.currentStructureName = data[1].name;
            } else if (result.station_id) {
              locationInfo.currentStationId = result.station_id;
              locationInfo.currentStationName = data[1].name;
            }
            return locationInfo;
          });
      })
      .then(result => {
        if (result.currentSystemId) {
          auth.updateUserInfo(result);
        }
        return result;
      });
  },
};

export default userApi;
