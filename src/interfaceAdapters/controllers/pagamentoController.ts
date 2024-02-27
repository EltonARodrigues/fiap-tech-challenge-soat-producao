import { PagamentoStatusUpdateBody } from "~domain/entities/types/PagamentoType";
import { PedidoDTO } from "~domain/entities/types/pedidoType";
import FilaRepository from "~domain/repositories/filaRepository";
import PedidoRepository from "~domain/repositories/pedidoRepository";
import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

export class PagamentoController {
  static async atualizaPagamentoPedido(
    filaRepository: FilaRepository,
    pedidoRepository: PedidoRepository,
    pagamentoUpdate: PagamentoStatusUpdateBody
  ): Promise<PedidoDTO> {
    return await PagamentoUseCase.atualizaPagamentoPedido(
      filaRepository,
      pedidoRepository,
      pagamentoUpdate
    );
  }
}
