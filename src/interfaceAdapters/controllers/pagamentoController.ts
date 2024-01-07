import { FaturaDTO } from "~domain/entities/types/fatura";
import { PedidoDTO } from "~domain/entities/types/pedidoType";
import PedidoRepository from "~domain/repositories/pedidoRepository";
import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

export class PagamentoController {
    static async atualizaPagamentoPedido(pedidoRepository: PedidoRepository,
        fatura: FaturaDTO): Promise<PedidoDTO> {
        return await PagamentoUseCase.atualizaPagamentoPedido(
            pedidoRepository,
            fatura
        );
    }
}