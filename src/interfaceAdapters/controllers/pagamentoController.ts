
export class PagamentoController {
    static async atualizaPagamentoPedido(
      pedidoRepository: PedidoRepository,
      clienteId: string
    ): Promise<PedidoDTO | null> {
      const pedidoInput: PedidoInput = {
        clienteId,
        // faturaId: null,
        status: "Rascunho",
        valor: 0,
        retiradoEm: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null
      }
  
      const pedidoCriada = await PedidoUseCase.iniciaPedido(
        pedidoRepository,
        pedidoInput
      );
      return pedidoCriada;
    }
}