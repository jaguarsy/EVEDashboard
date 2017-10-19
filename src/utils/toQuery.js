export default obj =>
  Object
    .keys(obj)
    .map(p => `${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    .join('&');
