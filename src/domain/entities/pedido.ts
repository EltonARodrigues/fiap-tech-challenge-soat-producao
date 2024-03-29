import throwError from "handlerError/handlerError";
import { v4 as uuidv4 } from "uuid";

import { StatusDePagamento, statusDePagamento } from "./types/PagamentoType";
import {
  PedidoDTO,
  PedidoInput,
  StatusDoPedido,
  statusDoPedido,
} from "./types/pedidoType";
import ItemPedido from "./itemPedido";

export default class Pedido {
  public id: string;
  public clienteId: string;
  public status: StatusDoPedido;
  public valor: number;
  public itens: ItemPedido[];
  public retiradoEm: Date | null;
  public createdAt: Date;
  public deletedAt: Date | null;
  public updatedAt: Date | null;

  constructor(pedidoInput: PedidoInput, itens: ItemPedido[] | null = []) {
    this.id = pedidoInput.id ?? uuidv4();
    this.clienteId = pedidoInput.clienteId;
    this.status = pedidoInput.status ?? this.criaRascunho();
    this.itens = itens ?? [];
    this.retiradoEm = pedidoInput.retiradoEm ?? null;
    this.createdAt = pedidoInput.createdAt ?? new Date();
    this.deletedAt = pedidoInput.deletedAt ?? null;
    this.updatedAt = pedidoInput.updatedAt ?? null;

    this.valor = 0;
    this.calculaTotal();
  }

  criaRascunho() {
    this.status = statusDoPedido.RASCUNHO;
    this.updatedAt = new Date();
  }

  entregaRascunho() {
    if (!(this.status === statusDoPedido.RASCUNHO || this.status === statusDoPedido.FALHA)) {
      throwError(
        "BAD_REQUEST",
        `Não é possível alterar o status para ${statusDoPedido.AGUARDANDO_PAGAMENTO}. Status atual do pedido é ${this.status}`
      );
    }

    this.updatedAt = new Date();
    this.validaValor();
    this.status = statusDoPedido.AGUARDANDO_PAGAMENTO;
  }

  atualizaPagamento(statusPagamento: StatusDePagamento) {
    if (this.status !== statusDePagamento.AGUARDANDO_PAGAMENTO && this.status !== statusDoPedido.CANCELADO_PROCESSAMENTO) {
      throwError(
        "BAD_REQUEST",
        `Só é permitido alterar o status do pedido quando o status é ${statusDoPedido.AGUARDANDO_PAGAMENTO}. Status Atual: ${this.status}`
      );
    }

    this.updatedAt = new Date();
    console.log(statusPagamento)
    if (statusPagamento === statusDePagamento.PAGAMENTO_CONCLUIDO) {
      this.status = statusDoPedido.AGUARDANDO_PREPARO;
    }

    if (statusPagamento === statusDePagamento.FALHA) {
      this.status = statusDoPedido.FALHA;
    }

    if (statusPagamento === statusDePagamento.PAGAMENTO_ESTORNADO) {
      this.status = statusDoPedido.CANCELADO;
    }
  }

  emPreparo() {
    if (this.status !== statusDoPedido.AGUARDANDO_PREPARO) {
      throwError(
        "BAD_REQUEST",
        `Não é possível alterar o status para ${statusDoPedido.EM_PREPARO}. Status atual do pedido é ${this.status}`
      );
    }
    this.updatedAt = new Date();
    this.status = statusDoPedido.EM_PREPARO;
  }

  pronto() {
    if (this.status !== statusDoPedido.EM_PREPARO) {
      throwError(
        "BAD_REQUEST",
        `Não é possível alterar o status para ${statusDoPedido.PRONTO}. Status atual do pedido é ${this.status}`
      );
    }
    this.updatedAt = new Date();
    this.status = statusDoPedido.PRONTO;
  }

  cancela() {
    if (this.status !== statusDoPedido.RASCUNHO && this.status !== statusDoPedido.FALHA && this.status !== statusDoPedido.AGUARDANDO_PAGAMENTO) {
      throwError(
        "BAD_REQUEST",
        `Não é possível alterar o status para ${statusDoPedido.CANCELADO_PROCESSAMENTO}. Status atual do pedido é ${this.status}`
      );
    }
    this.updatedAt = new Date();
    this.status = statusDoPedido.CANCELADO_PROCESSAMENTO;
  }


  entregue() {
    if (this.status !== statusDoPedido.PRONTO) {
      throwError(
        "BAD_REQUEST",
        `Não é possível alterar o status para ${statusDoPedido.ENTREGUE}. Status atual do pedido é ${this.status}`
      );
    }
    this.updatedAt = new Date();
    this.retiradoEm = new Date();
    this.status = statusDoPedido.ENTREGUE;
  }

  validaValor() {
    if (this.valor <= 0) {
      throwError(
        "BAD_REQUEST",
        "Não é possível realizar um pedido sem nenhum valor"
      );
    }
  }

  adicionarItem(item: ItemPedido) {
    if (this.status !== statusDoPedido.RASCUNHO) {
      throwError(
        "BAD_REQUEST",
        "Não é possível adicionar itens a um pedido que não está em rascunho"
      );
    }

    this.itens.push(item);
    this.calculaTotal();
    this.updatedAt = new Date();
  }

  removeItem(itemId: string) {
    if (this.status !== statusDoPedido.RASCUNHO) {
      throwError(
        "BAD_REQUEST",
        "Não é possível remover itens a um pedido que não está em rascunho"
      );
    }

    const findItem = this.itens?.find((item) => item.id === itemId);

    if (!findItem) {
      throwError("BAD_REQUEST", `Item ${itemId} do pedido nao entrado`);
    }

    this.itens = this.itens?.filter((item) => item.id !== itemId);
    this.calculaTotal();
    this.updatedAt = new Date();
  }

  calculaTotal() {
    this.valor =
      this.itens?.reduce(
        (total: number, item: ItemPedido) => total + item.calculaTotal(),
        0
      ) ?? 0;
  }

  toObject(): PedidoDTO {
    return {
      id: this.id,
      clienteId: this.clienteId,
      status: this.status,
      valor: this.valor,
      itens: this.itens,
      retiradoEm: this.retiradoEm,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      updatedAt: this.updatedAt,
    };
  }
}
