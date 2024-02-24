import throwError from "handlerError/handlerError";

import ItemPedido from "~domain/entities/itemPedido";
import Pedido from "~domain/entities/pedido";
import { PagamentoStatusUpdateBody } from "~domain/entities/types/PagamentoType";
import { PedidoDTO } from "~domain/entities/types/pedidoType";
import PedidoRepository from "~domain/repositories/pedidoRepository";

export default class PagamentoUseCase {
  static async atualizaPagamentoPedido(
    pedidoRepository: PedidoRepository,
    pagamentoUpdate: PagamentoStatusUpdateBody
  ): Promise<PedidoDTO> {
    const pedidoRetornado = await pedidoRepository.retornaPedido(
      pagamentoUpdate.pedidoId
    );

    if (!pedidoRetornado) {
      throwError(
        "NOT_FOUND",
        `Pedido ${pagamentoUpdate.pedidoId} nao encontrado`
      );
    }

    const itensAtuais = pedidoRetornado?.itens?.map(
      (item) => new ItemPedido(item)
    );
    const pedido = new Pedido(pedidoRetornado, itensAtuais);

    pedido.atualizaPagamento(pagamentoUpdate.statusPagamento);

    await pedidoRepository.atualizaPedido(pedido);

    // chama servico de email

    return pedido.toObject();
  }
}
