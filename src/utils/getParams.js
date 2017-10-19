export default (obj) => {
  const params = new window.URLSearchParams();
  Object.keys(obj).forEach((key) => {
    params.append(key, obj[key]);
  });
  return params;
};
