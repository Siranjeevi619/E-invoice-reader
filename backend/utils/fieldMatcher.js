const normalize = (key) => key.toLowerCase().replace(/[\s_]/g, "");
const isMatch = (sourceKey, targetKey) => {
  sourceKey = normalize(sourceKey);
  targetKey = normalize(targetKey);
  return sourceKey === targetKey || targetKey.includes(sourceKey);
};
module.exports = { normalize, isMatch };
