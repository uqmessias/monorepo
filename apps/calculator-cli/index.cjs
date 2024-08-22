const { formatNumber } = require("@monorepo/formatters");
const { calculatingFinancing } = require("@monorepo/financing-calculator");

const resumoMapaDeChaves = {
  mesesParaPagar: "Tempo proposto de pagamento",
  mesesParaPagarDepoisDasAmortizacoes: "Tempo de pagamento amortizado",
  valorTotalImovelFinanciado: "Valor financiado",
  valorTotalImovelFinanciadoCalculado: "Valor pago no tempo proposto",
  valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes:
    "Valor pago amortizado",
  valorDisponivelPorMesParaAmortizacao: "Valor disponível para pagamento",
  valorTotalImovelEconomizadoComAmortizacoes: "Economia por amortizar",
  percentualCustoEfetivoTotal: "CET",
  percentualCustoEfetivoTotalAnualCalculado: "CET calculado",
  percentualCustoEfetivoTotalAnual: "CET / ano",
  percentualCustoEfetivoTotalMensal: "CET / mês",
  percentualCustoEfetivoTotalComAmortizacoes: "CET amortização",
  percentualCustoEfetivoTotalAnualCalculadoComAmortizacoes:
    "CET / ano calculado amortização",
};

/**
 * @typedef {typeof resumoMapaDeChaves} ResumoMapaDeChaves
 *
 * @typedef {keyof ResumoMapaDeChaves} ResumoMapaDeChavesChaves;
 */

/**
 *
 * @param {Record<string, number>} financiamentoCalculado
 * @returns {Record<ResumoMapaDeChaves[ResumoMapaDeChavesChaves], number>}
 */
function resumirInformacoes(financiamentoCalculado) {
  const financiamentoCalculadoFormatado = formatNumber(financiamentoCalculado);

  return Object.keys(
    /** @type {ResumoMapaDeChavesChaves[]} */
    resumoMapaDeChaves
  ).reduce(
    (financiamento, propriedade) => ({
      ...financiamento,
      [resumoMapaDeChaves[propriedade]]:
        /** @type {keyof typeof financiamentoCalculadoFormatado} */
        financiamentoCalculadoFormatado[propriedade],
    }),
    /** @type {Record<ResumoMapaDeChaves[ResumoMapaDeChavesChaves], number>} */
    {}
  );
}
const valorTotalImovel = 250_000;
const valorTotalImovelEntrada = 120_000;
const mesesParaPagar = 12 * 30;
const percentualCustoEfetivoTotalAnual = 11.66 / 100;
const valorDisponivelPorMesParaAmortizacao = 3_000;

const financiamentoCalculado = calculatingFinancing(
  valorTotalImovel,
  valorTotalImovelEntrada,
  mesesParaPagar,
  percentualCustoEfetivoTotalAnual,
  valorDisponivelPorMesParaAmortizacao
);

// eslint-disable-next-line
const parcelasResumidas = financiamentoCalculado.parcelas
  .slice(0, 1)
  .concat(
    financiamentoCalculado.parcelas.slice(
      financiamentoCalculado.parcelas.length - 2,
      financiamentoCalculado.parcelas.length
    )
  );
const totalParcela = financiamentoCalculado.parcelas.length;
// @ts-ignore
delete financiamentoCalculado.parcelas;

console.log(`\nINFORMAÇÕES BÁSICAS ${totalParcela}`);
console.table(resumirInformacoes(financiamentoCalculado));
