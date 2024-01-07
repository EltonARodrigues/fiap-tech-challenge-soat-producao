export default class PagamentoUseCase {
    static async atualizaPagamentoPedido(
      pagamento: any,
    ) {
  
      const pedido = await pedidoRepository.retornaPedido(pedidoId, clienteId);
  
      if (pedido) {
        const itensAtuais = pedido?.itens?.map((item) => new ItemPedido(item));
        return new Pedido(pedido, itensAtuais);
      }
  
      return null;
    }
}
  