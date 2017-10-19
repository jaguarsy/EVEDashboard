export default {
  setItem(key, value) {
    if (typeof value === 'string') {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
  getItem(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (ex) {
      return null;
    }
  },
};
