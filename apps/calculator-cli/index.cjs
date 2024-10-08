const { formatNumber, formatMoney } = require('@monorepo/formatters');
const { calculatingFinancing } = require('@monorepo/financing-calculator');

const { askMoneyFormat, askSimpleNumberFormat, askPercentageFormat, ask } = require('./io.cjs');

const resumoMapaDeChaves = {
  mesesParaPagar: 'Tempo proposto de pagamento',
  mesesParaPagarDepoisDasAmortizacoes: 'Tempo de pagamento amortizado',
  valorTotalImovelFinanciado: 'Valor financiado',
  valorTotalImovelFinanciadoCalculado: 'Valor pago no tempo proposto',
  valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes: 'Valor pago amortizado',
  valorDisponivelPorMesParaAmortizacao: 'Valor disponível para amortização',
  valorTotalImovelEconomizadoComAmortizacoes: 'Economia por amortizar',
  percentualCustoEfetivoTotal: 'CET',
  percentualCustoEfetivoTotalAnualCalculado: 'CET calculado',
  percentualCustoEfetivoTotalAnual: 'CET / ano',
  percentualCustoEfetivoTotalMensal: 'CET / mês',
  percentualCustoEfetivoTotalComAmortizacoes: 'CET amortização',
  percentualCustoEfetivoTotalAnualCalculadoComAmortizacoes: 'CET / ano calculado amortização',

  // Dados da parcela
  numero: 'Parcela',
  valorAPagarJuros: 'Valor pago em juros',
  valorAPagarAmortizacao: 'Valor da amortização',
  valorAPagarAmortizacaoExtra: 'Valor extra da amortização',
  valorAPagarTotal: 'Valor total da parcela',
  valorAPagarTotalComAmortizacao: 'Valor pago no mês',
  valorDevedorTotalDepoisDestaParcela: 'Valor total devedor',
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
    resumoMapaDeChaves,
  ).reduce(
    (financiamento, propriedade) => {
      if (
        propriedade === undefined ||
        resumoMapaDeChaves[propriedade] === undefined ||
        financiamentoCalculadoFormatado[propriedade] === undefined
      ) {
        return financiamento;
      }

      return {
        ...financiamento,
        [resumoMapaDeChaves[propriedade]]:
          /** @type {keyof typeof financiamentoCalculadoFormatado} */
          financiamentoCalculadoFormatado[propriedade],
      };
    },
    /** @type {Record<ResumoMapaDeChaves[ResumoMapaDeChavesChaves], number>} */
    {},
  );
}

async function cli() {
  const valorTotalImovel = await askMoneyFormat('Qual é o valor total do imóvel?');
  const valorTotalImovelEntrada = await askMoneyFormat('Qual é o valor de entrada?');
  const mesesParaPagar = await askSimpleNumberFormat('Em quantos meses pretende financiar?');
  const percentualCustoEfetivoTotalAnual = await askPercentageFormat('Qual é o CET anual?');
  const valorDaPrimeiraParcela = calculatingFinancing(
    valorTotalImovel,
    valorTotalImovelEntrada,
    mesesParaPagar,
    percentualCustoEfetivoTotalAnual,
    0,
  ).parcelas[0].valorAPagarTotal;
  const valorDisponivelPorMesParaAmortizacao = await askMoneyFormat(
    'Qual é o valor disponível para pagar as amortizações por mês?',
    `(o valor da primeira parcela é: ${formatMoney(valorDaPrimeiraParcela)})`,
  );

  const financiamentoCalculado = calculatingFinancing(
    valorTotalImovel,
    valorTotalImovelEntrada,
    mesesParaPagar,
    percentualCustoEfetivoTotalAnual,
    valorDisponivelPorMesParaAmortizacao,
  );

  // eslint-disable-next-line
  const parcelasResumidas = financiamentoCalculado.parcelas
    .slice(0, 1)
    .concat(
      financiamentoCalculado.parcelas.slice(
        financiamentoCalculado.parcelas.length - 2,
        financiamentoCalculado.parcelas.length,
      ),
    )
    .map(resumirInformacoes);
  const totalParcela = financiamentoCalculado.parcelas.length;
  console.table(parcelasResumidas);
  // @ts-ignore
  delete financiamentoCalculado.parcelas;

  console.log(`\nINFORMAÇÕES BÁSICAS ${totalParcela}`);
  console.table(resumirInformacoes(financiamentoCalculado));

  const result = await ask('Pressione "r" ou "R" para reiniciar');

  if (result === 'r' || result === 'R') {
    await cli();
  }

  process.exit(0);
}
cli();
