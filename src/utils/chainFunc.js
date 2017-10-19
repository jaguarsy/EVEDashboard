export default (promiseFunc) => {
  return (data) => {
    return promiseFunc(data)
      .then(() => data);
  };
};
