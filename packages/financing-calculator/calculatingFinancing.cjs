const { formatMonths } = require("@monorepo/formatters");
const calculateFinancingParcel = require("./calculateFinancingParcel.cjs");

/**
 *
 * @param {number} valorTotalImovel total amount for the house/apartment
 * @param {number} valorTotalImovelEntrada initial amount to invest as first parcel on financing
 * @param {number} mesesParaPagar total months to pay
 * @param {number} percentualCustoEfetivoTotalAnual total annual effective cost
 * @param {number} valorDisponivelPorMesParaAmortizacao available funds to pay for amortization
 * @returns {import(".").CalcularFinanciamentoResult}
 */
module.exports = function calculatingFinancing(
  valorTotalImovel,
  valorTotalImovelEntrada,
  mesesParaPagar,
  percentualCustoEfetivoTotalAnual,
  valorDisponivelPorMesParaAmortizacao
) {
  /** @type {import(".").CalcularFinanciamentoParcela[]} */
  const parcelasCalculadasComAmortizacao = [];
  /** @type {import(".").CalcularFinanciamentoParcela[]} */
  const parcelasCalculadasOriginalmente = [];
  const percentualCustoEfetivoTotalMensal =
    (1 + percentualCustoEfetivoTotalAnual) ** (1 / 12) - 1;
  const valorTotalImovelFinanciado = valorTotalImovel - valorTotalImovelEntrada;

  let financiamentoCalculado = {
    valorTotalImovel,
    valorTotalImovelEntrada,
    valorTotalImovelFinanciado,
    mesesParaPagar,
    percentualCustoEfetivoTotalAnual,
    valorDisponivelPorMesParaAmortizacao,
    percentualCustoEfetivoTotalMensal,
    parcelas: parcelasCalculadasComAmortizacao,
  };

  let valorDevedorTotalDepoisDestaParcelaOriginal = valorTotalImovelFinanciado;
  let valorDevedorTotalDepoisDestaParcelaComAmortizacao =
    valorTotalImovelFinanciado;

  for (let numero = 1; numero <= mesesParaPagar; numero++) {
    const parcelaOriginal = calculateFinancingParcel(
      numero,
      mesesParaPagar,
      0,
      valorDevedorTotalDepoisDestaParcelaOriginal,
      percentualCustoEfetivoTotalMensal
    );
    valorDevedorTotalDepoisDestaParcelaOriginal =
      parcelaOriginal.valorDevedorTotalDepoisDestaParcela;

    parcelasCalculadasOriginalmente.push(parcelaOriginal);

    if (valorDevedorTotalDepoisDestaParcelaComAmortizacao > 0) {
      const parcelaComAmortizacao = calculateFinancingParcel(
        numero,
        mesesParaPagar,
        valorDisponivelPorMesParaAmortizacao,
        valorDevedorTotalDepoisDestaParcelaComAmortizacao,
        percentualCustoEfetivoTotalMensal
      );

      valorDevedorTotalDepoisDestaParcelaComAmortizacao =
        parcelaComAmortizacao.valorDevedorTotalDepoisDestaParcela;
      parcelasCalculadasComAmortizacao.push(parcelaComAmortizacao);
    }
  }

  const valorTotalImovelFinanciadoCalculado =
    parcelasCalculadasOriginalmente.reduce(
      (soma, { valorAPagarTotal }) => soma + valorAPagarTotal,
      0
    );
  const valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes =
    parcelasCalculadasComAmortizacao.reduce(
      (soma, { valorAPagarTotalComAmortizacao }) =>
        soma + valorAPagarTotalComAmortizacao,
      0
    );
  const mesesParaPagarDepoisDasAmortizacoes =
    parcelasCalculadasComAmortizacao.length;

  const percentualCustoEfetivoTotalComAmortizacoes =
    (valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes -
      valorTotalImovelFinanciado) /
    valorTotalImovelFinanciado;
  const percentualCustoEfetivoTotalAnualCalculadoComAmortizacoes =
    (1 + percentualCustoEfetivoTotalComAmortizacoes) **
      (1 / (parcelasCalculadasComAmortizacao.length / 12)) -
    1;

  const percentualCustoEfetivoTotal =
    (valorTotalImovelFinanciadoCalculado - valorTotalImovelFinanciado) /
    valorTotalImovelFinanciado;

  const percentualCustoEfetivoTotalAnualCalculado =
    (1 + percentualCustoEfetivoTotal) **
      (1 / (parcelasCalculadasOriginalmente.length / 12)) -
    1;

  const valorTotalImovelEconomizadoComAmortizacoes =
    valorTotalImovelFinanciadoCalculado -
    valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes;

  if (
    parcelasCalculadasComAmortizacao.length !==
    parcelasCalculadasOriginalmente.length
  ) {
    console.warn(
      `Estava planejado pagar em ${formatMonths(
        parcelasCalculadasOriginalmente.length
      )}, mas foi pago em ${formatMonths(
        parcelasCalculadasComAmortizacao.length
      )}`
    );
  }

  if (parcelasCalculadasOriginalmente.length !== mesesParaPagar) {
    throw new Error(
      `A quantidade de parcelas fornecidas ("${mesesParaPagar}") é diferente das calculadas originalmente ("${parcelasCalculadasOriginalmente}")`
    );
  }

  return {
    ...financiamentoCalculado,
    valorTotalImovelFinanciadoCalculado,
    valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes,
    valorTotalImovelEconomizadoComAmortizacoes,
    mesesParaPagarDepoisDasAmortizacoes,
    // Depois de pagar todas as amortizações, qual é o CET final?
    percentualCustoEfetivoTotal,
    percentualCustoEfetivoTotalComAmortizacoes,
    percentualCustoEfetivoTotalAnualCalculado,
    percentualCustoEfetivoTotalAnualCalculadoComAmortizacoes,
  };
};
