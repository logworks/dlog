const isObject = el => {
  return el instanceof Object && !Array.isArray(el);
};
const hasKeys = el => {
  return Object.keys(el).length >= 1;
};

module.exports = { isObject, hasKeys };
