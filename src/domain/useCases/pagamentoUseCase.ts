import throwError from "handlerError/handlerError";

import ItemPedido from "~domain/entities/itemPedido";
import Pedido from "~domain/entities/pedido";
import { FaturaDTO, statusDePagamento } from "~domain/entities/types/fatura";
import { PedidoDTO } from "~domain/entities/types/pedidoType";
import PedidoRepository from "~domain/repositories/pedidoRepository";

export default class PagamentoUseCase {

    static async atualizaPagamentoPedido(
        pedidoRepository: PedidoRepository,
        fatura: FaturaDTO,
    ): Promise<PedidoDTO> {

        const pedidoRetornado = await pedidoRepository.retornaPedido(fatura.pedidoId);

        if (!pedidoRetornado) {
            throwError("NOT_FOUND", `Pedido ${fatura.pedidoId} nao encontrado`);
        }

        const itensAtuais = pedidoRetornado?.itens?.map((item) => new ItemPedido(item));
        const pedido = new Pedido(pedidoRetornado, itensAtuais);

        pedido.atualizaPagamento(fatura.isPago ? statusDePagamento.PAGAMENTO_APROVADO : statusDePagamento.PAGAMENTO_NEGADO);

        pedido.atualizarFatura(fatura)
        await pedidoRepository.atualizaPedido(pedido);

        return pedido.toObject();
    }
}
