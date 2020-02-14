// in purset sense isObject rejects arrays as differnt type.
const isObject = el => {
  return el instanceof Object && !Array.isArray(el);
};
const hasKeys = el => {
  return isObject(el) && Object.keys(el).length >= 1;
};

module.exports = { isObject, hasKeys };
