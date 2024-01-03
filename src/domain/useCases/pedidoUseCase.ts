/* eslint-disable @typescript-eslint/no-non-null-assertion */
import throwError from "handlerError/handlerError";

import ItemPedido from "~domain/entities/itemPedido";
import Pedido from "~domain/entities/pedido";
import Produto from "~domain/entities/produto";
import { ItemDoPedidoDTO, ItemDoPedidoInput } from "~domain/entities/types/itensPedidoType";
import {
  PedidoDTO,
  PedidoInput,
} from "~domain/entities/types/pedidoType";
import FaturaRepository from "~domain/repositories/faturaRepository";
import PedidoRepository from "~domain/repositories/pedidoRepository";
import ProdutoRepository from "~domain/repositories/produtoRepository";

import {
  RealizaPedidoInput,
  RemoveItemInput,
} from "../entities/types/pedidoService.type";


export default class PedidoUseCase {
  static async buscaPedido(
    pedidoRepository: PedidoRepository,
    pedidoId: string,
    clienteId?: string | null
  ) {

    const pedido = await pedidoRepository.retornaPedido(pedidoId, clienteId);

    if (pedido) {
      const itensAtuais = pedido?.itens?.map((item) => new ItemPedido(item));
      return new Pedido(pedido, itensAtuais);
    }

    return null;
  }

  static async iniciaPedido(
    pedidoRepository: PedidoRepository,
    pedidoInput: PedidoInput
  ): Promise<PedidoDTO> {
    const pedido = new Pedido(pedidoInput);
    return pedidoRepository.criaPedido(pedido.toObject());
  }

  static async realizaPedido(
    faturaRepository: FaturaRepository,
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    realizaPedidoInput: RealizaPedidoInput
  ): Promise<PedidoDTO | null> {
    const pedido = await PedidoUseCase.buscaPedido(
      pedidoRepository,
      realizaPedidoInput.pedidoId,
      realizaPedidoInput.clienteId
    );

    if (!pedido) {
      throwError("NOT_FOUND", "Pedido nao encontrado");
    }

    pedido.entregaRascunho();

    const itensAtuais = pedido?.itens?.map((item) => new ItemPedido(item));
    return new Pedido(pedido, itensAtuais);
  }

  static async retornaProximoPedidoFila(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository
  ) {
    const proximoPedido = await pedidoRepository.retornaProximoPedidoFila();
    if (proximoPedido) {
      const itensAtuais = proximoPedido?.itens?.map((item) => new ItemPedido(item));
      return new Pedido(proximoPedido, itensAtuais);
    }

    return null;
  }

  static async iniciaPreparo(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    pedidoId?: string
  ): Promise<PedidoDTO | null> {
    const pedido = pedidoId
      ? await PedidoUseCase.buscaPedido(
        pedidoRepository,
        pedidoId
      )
      : await PedidoUseCase.retornaProximoPedidoFila(
        pedidoRepository,
        produtoRepository
      );

    if (pedido) {
      pedido.emPreparo();
      const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido.toObject())
      const itensAtuais = pedidoAtualizado?.itens?.map((item) => new ItemPedido(item));
    
      return new Pedido(pedidoAtualizado, itensAtuais);
    }

    return null;
  }

  static async finalizaPreparo(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    pedidoId: string
  ): Promise<PedidoDTO> {
    const pedido = await PedidoUseCase.buscaPedido(
      pedidoRepository,
      pedidoId
    );

    if (!pedido) {
      throwError("NOT_FOUND", "Pedido nao encontrado");
    }

    pedido.pronto();

    const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido.toObject())
    const itensAtuais = pedidoAtualizado?.itens?.map((item) => new ItemPedido(item));
  
    return new Pedido(pedidoAtualizado, itensAtuais);
  }

  static async entregaPedido(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    pedidoId: string
  ): Promise<PedidoDTO> {
    const pedido = await PedidoUseCase.buscaPedido(
      pedidoRepository,
      pedidoId
    );

    if (!pedido) {
      throwError("NOT_FOUND", "Pedido nao encontrado");
    }

    pedido.entregue();

    const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido.toObject())
    const itensAtuais = pedidoAtualizado?.itens?.map((item) => new ItemPedido(item));
  
    return new Pedido(pedidoAtualizado, itensAtuais);
  }

  static async adicionaItem(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    itemDoPedidoInput: ItemDoPedidoInput
  ): Promise<PedidoDTO | null> {
    const pedido = await PedidoUseCase.buscaPedido(
      pedidoRepository,
      itemDoPedidoInput.pedidoId,
      itemDoPedidoInput.clienteId
    );

    if (!pedido) {
      throwError("NOT_FOUND", "Pedido nao encontrado");
    }

    const produtoEncontrado = await produtoRepository.retornaProduto(
      itemDoPedidoInput.produtoId
    );

    if (!produtoEncontrado) {
      throwError("NOT_FOUND", "Produto nao encontrado");
    }

    const produto = new Produto(produtoEncontrado);
    itemDoPedidoInput.valorUnitario = produto.retornaPreco();
    itemDoPedidoInput.produtoId = produto.id;

    const novoItem = new ItemPedido(itemDoPedidoInput as ItemDoPedidoDTO);

    pedido.adicionarItem(novoItem);

    const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido.toObject())
    const itensAtuais = pedidoAtualizado?.itens?.map((item) => new ItemPedido(item));
  
    return new Pedido(pedidoAtualizado, itensAtuais);
  }

  static async removeItem(
    pedidoRepository: PedidoRepository,
    produtoRepository: ProdutoRepository,
    removeItemInput: RemoveItemInput
  ): Promise<PedidoDTO | null> {
    const pedido = await PedidoUseCase.buscaPedido(
      pedidoRepository,
      removeItemInput.pedidoId,
      removeItemInput.clienteId
    );

    if (!pedido) {
      throwError("NOT_FOUND", "Pedido nao encontrado");
    }

    pedido.removeItem(removeItemInput.itemId);

    const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido.toObject())
    const itensAtuais = pedidoAtualizado?.itens?.map((item) => new ItemPedido(item));
  
    return new Pedido(pedidoAtualizado, itensAtuais);
  }

  static async listaPedidos(
    pedidoRepository: PedidoRepository,
    status?: Array<string>,
    clienteId?: string
  ): Promise<Array<PedidoDTO> | null> {
    return pedidoRepository.listaPedidos(status, clienteId);
  }
}
