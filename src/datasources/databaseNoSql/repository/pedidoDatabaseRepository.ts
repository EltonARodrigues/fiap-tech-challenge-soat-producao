/* eslint-disable @typescript-eslint/no-non-null-assertion */
import throwError from "handlerError/handlerError";
import { v4 as uuidv4 } from "uuid";

import { ItemDoPedidoDTO } from "~domain/entities/types/itensPedidoType";
import { AdicionaItemInput, RemoveItemInput } from "~domain/entities/types/pedidoService.type";
import {
  PedidoDTO,
  StatusDoPedido,
  statusDoPedido,
} from "~domain/entities/types/pedidoType";
import PedidoRepository from "~domain/repositories/pedidoRepository";

import Pedido from "../models/pedidoModel";


class PedidoDataBaseRepository implements PedidoRepository {
  async criaPedido(pedido: PedidoDTO): Promise<PedidoDTO> {
    const pedidoCriado = await Pedido.create(pedido);
    return await Pedido.findById(pedidoCriado._id).select('-_id -__v').lean() as PedidoDTO;
  }

  async atualizaStatusDoPedido(
    id: string,
    statusDoPedido: StatusDoPedido
  ): Promise<PedidoDTO> {
    const pedido = await Pedido.findOneAndUpdate({ id }, { status: statusDoPedido }, { returnNewDocument: true }).select('-_id -__v');

    return pedido as PedidoDTO;

  }

  async atualizaPedido(pedido: PedidoDTO): Promise<PedidoDTO> {
    const pedidoAtualizado = await Pedido.findOneAndUpdate({ id: pedido.id },  pedido, { upsert: true, setDefaultsOnInsert: true, new: true }).select('-_id -__v');
    console.log(pedidoAtualizado)
    return pedidoAtualizado as PedidoDTO;

  }

  async retornaPedido(id: string, clienteId: string | null = null): Promise<PedidoDTO | null> {
    const filter: {
      id: string,
      clientId?: string
    } = {
      id
    }

    if (clienteId) {
      filter.clientId = clienteId
    }
    return (await Pedido.findOne(filter)) as PedidoDTO;
  }

  async retornaProximoPedidoFila(): Promise<PedidoDTO | null> {
    const proximoPedido = Pedido.findOne({}, {}, { sort: { 'createdAt': 1 } }).select('-_id -__v') as unknown as PedidoDTO;

    return proximoPedido;

  }

  async adicionaItem(
    adicionaItem: AdicionaItemInput
  ): Promise<PedidoDTO | null> {
    const novoItem: ItemDoPedidoDTO = {
      ...adicionaItem,
      id: uuidv4(),
    }
    const pedidoAtualizado = await Pedido.findOneAndUpdate({ id: adicionaItem.pedidoId },
      { $push: { itens: novoItem }, },
      { returnNewDocument: true }).select('-_id -__v');

    if (!pedidoAtualizado) throwError("NOT_FOUND", "Pedido não encontrado");

    return pedidoAtualizado as unknown as PedidoDTO;
  }

  async removeItem(
    removeItemInput: RemoveItemInput
  ): Promise<PedidoDTO | null> {
    const pedidoItemRemovido = await Pedido.findOneAndUpdate({ id: removeItemInput.pedidoId },
      { $pull: { itens: { id: removeItemInput.itemId } }, },
      { returnNewDocument: true }).select('-_id -__v');

    if (!pedidoItemRemovido) throwError("NOT_FOUND", "Pedido não encontrado");

    return pedidoItemRemovido as unknown as PedidoDTO;
  }

  async listaPedidos(
    status?: StatusDoPedido[],
    clienteId?: string
  ): Promise<Array<PedidoDTO> | null> {
    const filter: {
      status: { $in: any },
      clientId?: string
    } = {
      status: status ? { $in: status} : {
        $in: [
          statusDoPedido.AGUARDANDO_PREPARO,
        ]
      }

    }

    if (clienteId) {
      filter.clientId = clienteId;
    }
    console.log(filter)
    return await Pedido.find(filter).sort({ updateAt: 1 }).select('-_id -__v');
  }
}

export default PedidoDataBaseRepository;
