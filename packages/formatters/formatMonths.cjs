/**
 * @param {number} num
 * @returns {string}
 */
module.exports = function formatMonths(num) {
  const meses = num % 12;
  const anos = num >= 12 ? (num - meses) / 12 : 0;

  /**
   * @type {string[]}
   */
  const frase = [];

  if (anos > 0) {
    frase.push(`${anos} ${anos === 1 ? "ano" : "anos"}`);
  }
  if (meses > 0) {
    frase.push(`${meses} ${meses === 1 ? "mês" : "meses"}`);
  }

  return frase.length ? frase.join(" e ") : "0 meses";
};