import { AdicionaItemInput, RemoveItemInput } from "~domain/entities/types/pedidoService.type";
import { PedidoDTO, StatusDoPedido } from "~domain/entities/types/pedidoType";

export type CriaPedidoInput = {
  clienteId?: string | null;
  valor: number;
  status: StatusDoPedido;
};

export type AtualizaPedidoInput = {
  id: string;
  status?: StatusDoPedido;
  retiradoEm?: Date;
  faturaId?: string;
};

export type queryStatusPagamentoInput = {
  pedidoId: string;
  clienteId?: string;
};


export type RetornaItemInput = {
  id: string;
};

export default interface PedidoRepository {
  criaPedido(pedido: PedidoDTO): Promise<PedidoDTO>;
  atualizaPedido(pedido: PedidoDTO): Promise<PedidoDTO>;
  atualizaStatusDoPedido(id: string, statusDoPedido: StatusDoPedido): Promise<PedidoDTO>;
  adicionaItem(adicionarItemInput: AdicionaItemInput): Promise<PedidoDTO | null>;
  retornaPedido(id: string, clienteId?: string | null): Promise<PedidoDTO | null>;
  listaPedidos(status?: Array<StatusDoPedido> | null, clienteId?: string): Promise<Array<PedidoDTO> | null>;
  retornaProximoPedidoFila(): Promise<PedidoDTO | null>;
  removeItem(removeItemInput: RemoveItemInput): Promise<PedidoDTO | null>;
}
