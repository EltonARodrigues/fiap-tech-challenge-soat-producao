export const statusDePagamento = {
  AGUARDANDO_PAGAMENTO:  "Aguardando pagamento",
  FALHA:  "Falha no processo de pagamento",
  PAGAMENTO_CONCLUIDO:  "Pagamento concluído",
  PAGAMENTO_ESTORNADO:  "Pagamento estornado"
} as const;

export type StatusDePagamento =
  (typeof statusDePagamento)[keyof typeof statusDePagamento];

export interface PagamentoStatusUpdateBody {
  pedidoId: string;
  statusPagamento: StatusDePagamento;
}
