const formatMoney = require('./formatMoney.cjs');
const formatMonths = require('./formatMonths.cjs');
const formatPercentage = require('./formatPercentage.cjs');

/**
 * @type {import(".").FormatNumber<any>}
 */
module.exports = function formatNumber(objetoComNumero) {
  const dinheiroFormatado = Object.keys(objetoComNumero).reduce(
    (formatado, propriedade) => {
      /** @type {number} */
      const numero =
        /** @type {keyof typeof objetoComNumero} */
        objetoComNumero[propriedade];

      if (Number.isNaN(numero) || numero === undefined || propriedade === undefined) {
        return formatado;
      }

      if (propriedade.startsWith('valor')) {
        /** @type {NumeroFormatado<T>} */
        return {
          ...formatado,
          [propriedade]: formatMoney(numero),
        };
      }

      if (propriedade.startsWith('percentual')) {
        /** @type {NumeroFormatado<T>} */
        return {
          ...formatado,
          [propriedade]: formatPercentage(numero),
        };
      }

      if (propriedade.startsWith('meses')) {
        /** @type {NumeroFormatado<T>} */
        return {
          ...formatado,
          [propriedade]: formatMonths(numero),
        };
      }

      return formatado;
    },
    /** @type {NumeroFormatado<T>} */
    objetoComNumero,
  );

  return dinheiroFormatado;
};
