import dotenv from "dotenv";
import throwError from "handlerError/handlerError";

import ItemPedido from "~domain/entities/itemPedido";
import Pedido from "~domain/entities/pedido";
import { PagamentoStatusUpdateBody } from "~domain/entities/types/PagamentoType";
import { PedidoDTO, statusDoPedido } from "~domain/entities/types/pedidoType";
import FilaRepository from "~domain/repositories/filaRepository";
import PedidoRepository from "~domain/repositories/pedidoRepository";

dotenv.config();

const FILA_NOTIFICACAO = process.env.FILA_NOTIFICACAO as string;
interface NotificationBody {
  sub: string;
  pedidoId: string;
  pedidoEmProducao: boolean;
}

export default class PagamentoUseCase {
  static async atualizaPagamentoPedido(
    filaRepository: FilaRepository,
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
    console.log(pagamentoUpdate)
    pedido.atualizaPagamento(pagamentoUpdate.statusPagamento);
    console.log(pedido)
    await pedidoRepository.atualizaPedido(pedido);

    const pedidoEmProducao =
      pedido.status === statusDoPedido.AGUARDANDO_PREPARO;

    try {
      await filaRepository.enviaParaFila<NotificationBody>({
        sub: pedido.clienteId,
        pedidoId: pedido.id,
        pedidoEmProducao
      }, FILA_NOTIFICACAO);
    } catch(err) {
      console.log(`Error to send notification to queue ${FILA_NOTIFICACAO}}: ${err}`)
    }

    return pedido.toObject();
  }
}
