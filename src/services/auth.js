export default {
  code: localStorage.getItem('code'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  userInfo: {},

  authorized() {
    return !!this.accessToken;
  },

  saveCode(code) {
    localStorage.setItem('code', code);
    this.code = code;
  },

  removeCode() {
    localStorage.removeItem('code');
    this.code = '';
  },

  saveToken({ access_token, refresh_token }) {
    if (!access_token || !refresh_token) {
      return;
    }
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  },

  removeToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken = '';
    this.refreshToken = '';
  },

  updateUserInfo(userInfo) {
    this.userInfo = Object.assign({}, this.userInfo, userInfo);
    console.log('update user info:', this.userInfo);
  },

  signOut() {
    this.removeCode();
    this.removeToken();
    this.userInfo = {};
  }
};
