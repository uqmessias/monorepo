export interface CalcularFinanciamentoParcela {
  numero: number;
  valorAPagarJuros: number;
  valorAPagarAmortizacao: number;
  /** Todo o valor que puder ser pago do {@link calcularFinanciamento(valorDisponivelPorMesParaAmortizacao)} depois de pagar o {@link valorAPagarTotal} */
  valorAPagarAmortizacaoExtra: number;
  /** Valor do {@link valorAPagarAmortizacao} + {@link valorAPagarJuros} */
  valorAPagarTotal: number;
  /** Valor que sobrar do {@link valorAPagarAmortizacaoExtra} + {@link valorAPagarTotal} */
  valorAPagarTotalComAmortizacao: number;
  valorDevedorTotalDepoisDestaParcela: number;
}

export interface CalcularFinanciamentoResult {
  valorTotalImovel: number;
  valorTotalImovelEntrada: number;
  valorTotalImovelFinanciadoCalculado: number;
  valorTotalImovelFinanciadoCalculadoDepoisDasAmortizacoes: number;
  valorTotalImovelEconomizadoComAmortizacoes: number;
  mesesParaPagar: number;
  mesesParaPagarDepoisDasAmortizacoes: number;
  percentualCustoEfetivoTotalAnual: number;
  // Depois de pagar todas as amortizações, qual é o CET final?
  percentualCustoEfetivoTotal: number;
  percentualCustoEfetivoTotalComAmortizacoes: number;
  // Depois de pagar todas as amortizações, qual é o CET final ao ano?
  percentualCustoEfetivoTotalAnualCalculado: number;
  percentualCustoEfetivoTotalAnualCalculadoComAmortizacoes: number;
  percentualCustoEfetivoTotalMensal: number;
  valorDisponivelPorMesParaAmortizacao: number;
  parcelas: CalcularFinanciamentoParcela[];
}

export function calculatingFinancingParcel(
  numero: number,
  mesesParaPagar: number,
  valorDisponivelPorMesParaAmortizacao: number,
  valorDevedorTotalDepoisDestaParcela: number,
  percentualCustoEfetivoTotalMensal: number
): CalcularFinanciamentoParcela;

export function calculatingFinancing(
  valorTotalImovel: number,
  valorTotalImovelEntrada: number,
  mesesParaPagar: number,
  percentualCustoEfetivoTotalAnual: number,
  valorDisponivelPorMesParaAmortizacao: number
): CalcularFinanciamentoResult;
