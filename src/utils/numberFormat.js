export default val => {
  if (val) {
    return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  return null;
}
