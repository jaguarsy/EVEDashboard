import request from '../utils/request';
import auth from './auth';

const walletApi = {
  // 获取钱包余额
  getWalletBalance({ CharacterID } = auth.userInfo) {
    return request
      .getFromESI(`/characters/${CharacterID}/wallet/`)
      .then((result) => {
        auth.updateUserInfo({
          balance: result || 0,
        });
        return result;
      });
  },
};

export default walletApi;
