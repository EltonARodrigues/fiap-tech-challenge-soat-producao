import { PagamentoStatusUpdateBody } from "~domain/entities/types/PagamentoType";
import { PedidoDTO } from "~domain/entities/types/pedidoType";
import PedidoRepository from "~domain/repositories/pedidoRepository";
import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

export class PagamentoController {
    static async atualizaPagamentoPedido(pedidoRepository: PedidoRepository,
        pagamentoUpdate: PagamentoStatusUpdateBody): Promise<PedidoDTO> {
        return await PagamentoUseCase.atualizaPagamentoPedido(
            pedidoRepository,
            pagamentoUpdate
        );
    }
}