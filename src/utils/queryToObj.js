export default (url) => {
  let query;
  if (url.indexOf('?') > -1) {
    query = url.split('?')[1];
  } else {
    query = url;
  }
  const params = query.split('&');
  const result = {};
  params.forEach((item) => {
    const tmp = item.split('=');
    result[tmp[0]] = tmp[1];
  });
  return result;
};
