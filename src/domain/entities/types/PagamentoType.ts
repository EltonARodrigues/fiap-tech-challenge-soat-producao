export const statusDePagamento = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  ERRO_AO_PROCESSAR_PAGAMENTO: "Erro ao processar pagamento",
  PAGAMENTO_APROVADO: "Pagamento aprovado",
  PAGAMENTO_NEGADO: "Pagamento negado",
} as const;

export type StatusDePagamento =
  (typeof statusDePagamento)[keyof typeof statusDePagamento];

export interface PagamentoStatusUpdateBody {
  pedidoId: string;
  statusPagamento: StatusDePagamento;
}
