export interface PagamentoDTO {
    id: string;
    pedidoId: string;
    isPago: boolean;
    valorPagamento: number;
    tipoDePagamento: string;
    pagamentoId: string;
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date | null;
  }

  