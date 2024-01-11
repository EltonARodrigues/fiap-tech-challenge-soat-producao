import { AdicionaItemInput, RealizaPedidoInput, RemoveItemInput } from "~domain/entities/types/pedidoService.type";
import { PedidoDTO, PedidoInput, StatusDoPedido } from "~domain/entities/types/pedidoType";
import FilaRepository from "~domain/repositories/filaRepository";
import PedidoRepository from "~domain/repositories/pedidoRepository";
import ProdutoRepository from "~domain/repositories/produtoRepository";
import PedidoUseCase from "~domain/useCases/pedidoUseCase";

export class PedidoController {
  static async iniciaPedido(
    pedidoRepository: PedidoRepository,
    clienteId: string
  ): Promise<PedidoDTO | null> {
    const pedidoInput: PedidoInput = {
      clienteId,
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

  static async realizaPedido(
    filaRepository: FilaRepository,
    pedidoRepository: PedidoRepository,
    realizaPedidoInput: RealizaPedidoInput
  ): Promise<PedidoDTO | null> {
    return await PedidoUseCase.realizaPedido(
      filaRepository,
      pedidoRepository,
      realizaPedidoInput
    );
  }

  static async iniciaPreparo(
    pedidoRepository: PedidoRepository,
    id: string
  ): Promise<PedidoDTO | null> {
    return await PedidoUseCase.iniciaPreparo(
      pedidoRepository,
      id
    );
  }

  static async finalizaPreparo(
    pedidoRepository: PedidoRepository,
    id: string
  ): Promise<PedidoDTO> {
    return await PedidoUseCase.finalizaPreparo(
      pedidoRepository,
      id
    );
  }

  static async adicionaItem(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    adicionaItemInput: AdicionaItemInput
  ): Promise<PedidoDTO | null> {
    return await PedidoUseCase.adicionaItem(
      pedidoRepository,
      produtoRepository,
      adicionaItemInput
    );
  }

  static async removeItem(
    pedidoRepository: PedidoRepository,
    removeItemInput: RemoveItemInput
  ): Promise<PedidoDTO | null> {
    return await PedidoUseCase.removeItem(
      pedidoRepository,
      removeItemInput
    );
  }

  static async entregaPedido(
    pedidoRepository: PedidoRepository,
    id: string
  ): Promise<PedidoDTO | null> {
    return await PedidoUseCase.entregaPedido(
      pedidoRepository,
      id
    );
  }

  static async listaPedidos(
    pedidoRepository: PedidoRepository,
    status: Array<StatusDoPedido> | null,
    clienteId: string
  ): Promise<PedidoDTO[] | null> {
    return await PedidoUseCase.listaPedidos(
      pedidoRepository,
      status,
      clienteId
    );
  }

}
