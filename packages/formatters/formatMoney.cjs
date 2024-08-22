/**
 * @param {number} num
 * @returns {string}
 */
module.exports = function formatMoney(num) {
  return `R$ ${num
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`;
};
