/**
 * @param {number} num
 * @returns {string}
 */
module.exports = function formatPercentage(num) {
  return `${(num * 100).toFixed(4).replace(".", ",")}%`;
};
