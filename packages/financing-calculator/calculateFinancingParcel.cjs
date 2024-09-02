/**
 *
 * @param {number} numero number of the parcel
 * @param {number} valorAPagarAmortizacao amount to pay for amortization on every parcel
 * @param {number} valorDisponivelPorMesParaAmortizacao available funds to pay for amortization
 * @param {number} valorDevedorTotalDepoisDestaParcela rest amount after depositing this parcel
 * @param {number} percentualCustoEfetivoTotalMensal total monthly efective cost
 * @returns {import(".").CalcularFinanciamentoParcela}
 */
module.exports = function calculateFinancingParcel(
  numero,
  valorAPagarAmortizacao,
  valorDisponivelPorMesParaAmortizacao,
  valorDevedorTotalDepoisDestaParcela,
  percentualCustoEfetivoTotalMensal,
) {
  const valorAPagarJuros = valorDevedorTotalDepoisDestaParcela * percentualCustoEfetivoTotalMensal;
  const valorAPagarTotal = valorAPagarAmortizacao + valorAPagarJuros;

  const valorAPagarAmortizacaoExtra =
    valorDevedorTotalDepoisDestaParcela > 0
      ? Math.max(
          0,
          Math.min(
            valorDevedorTotalDepoisDestaParcela,
            valorDisponivelPorMesParaAmortizacao - valorAPagarTotal,
          ),
        )
      : 0;

  const valorAPagarTotalComAmortizacao = valorAPagarTotal + valorAPagarAmortizacaoExtra;

  // Desconta o valor pago na parcela do mês
  if (valorDevedorTotalDepoisDestaParcela > 0) {
    valorDevedorTotalDepoisDestaParcela -= valorAPagarAmortizacao;
  }

  if (valorDevedorTotalDepoisDestaParcela > 0) {
    valorDevedorTotalDepoisDestaParcela -= valorAPagarAmortizacaoExtra;
  }

  return {
    numero,
    valorAPagarJuros,
    valorAPagarAmortizacao,
    valorAPagarAmortizacaoExtra,
    valorAPagarTotal,
    valorAPagarTotalComAmortizacao,
    valorDevedorTotalDepoisDestaParcela,
  };
};
