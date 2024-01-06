// import { ItensDoPedido } from "./itemPedido";
import throwError from "handlerError/handlerError";
import { v4 as uuidv4 } from "uuid";

import { PedidoDTO, PedidoInput, StatusDoPedido, statusDoPedido } from "./types/pedidoType";
import { StatusDePagamento, statusDePagamento } from "./fatura";
import ItemPedido from "./itemPedido";

export default class Pedido {
  public id: string;
  public clienteId: string;
  // public faturaId: string | null;
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
    // this.faturaId = pedidoInput.faturaId ?? null;
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
    if (this.status !== statusDoPedido.RASCUNHO) {
      throwError("BAD_REQUEST", `Não é possível alterar o status para ${statusDoPedido.AGUARDANDO_PAGAMENTO}. Status atual do pedido é ${this.status}`);
    }

    this.updatedAt = new Date();
    this.validaValor();
    this.status = statusDoPedido.AGUARDANDO_PAGAMENTO;
  }

  // aguardaPagamento() {
  //   if (this.status !== statusDoPedido.AGUARDANDO_PAGAMENTO) {
  //     throwError("BAD_REQUEST", `Não é possível alterar o status para ${statusDoPedido.AGUARDANDO_PAGAMENTO}. Status atual do pedido é ${this.status}`);
  //   }
  //   this.status = statusDoPedido.AGUARDANDO_PREPARO;
  // }

  atualizaPagamento(statusPagamento: StatusDePagamento) {

    if (statusPagamento !== statusDePagamento.AGUARDANDO_PAGAMENTO) {
      this.updatedAt = new Date();
      this.status = statusPagamento === statusDePagamento.PAGAMENTO_APROVADO
        ? statusDoPedido.AGUARDANDO_PREPARO
        : statusDoPedido.FALHA;
    }
  }

  emPreparo() {
    if (this.status !== statusDoPedido.AGUARDANDO_PREPARO) {
      throwError("BAD_REQUEST", `Não é possível alterar o status para ${statusDoPedido.AGUARDANDO_PREPARO}. Status atual do pedido é ${this.status}`);
    }
    this.updatedAt = new Date();
    this.status = statusDoPedido.EM_PREPARO;
  }

  pronto() {
    if (this.status !== statusDoPedido.EM_PREPARO) {
      throwError("BAD_REQUEST", `Não é possível alterar o status para ${statusDoPedido.EM_PREPARO}. Status atual do pedido é ${this.status}`);
    }
    this.updatedAt = new Date();
    this.status = statusDoPedido.PRONTO;
  }

  entregue() {
    if (this.status !== statusDoPedido.PRONTO) {
      throwError("BAD_REQUEST", `Não é possível alterar o status para ${statusDoPedido.PRONTO}. Status atual do pedido é ${this.status}`);
    }
    this.updatedAt = new Date();
    this.retiradoEm = new Date();
    this.status = statusDoPedido.ENTREGUE;
  }

  registrarFatura(faturaId: string) {
    // this.faturaId = faturaId;
  }

  validaValor() {
    if (this.valor <= 0) {
      throwError("BAD_REQUEST", `Não é possível realizar um pedido sem nenhum valor`);
    }
  }

  adicionarItem(item: ItemPedido) {
    if (this.status !== statusDoPedido.RASCUNHO) {
      throwError("BAD_REQUEST", `Não é possível adicionar itens a um pedido que não está em rascunho`);
    }

    this.itens.push(item);
    this.calculaTotal();
    this.updatedAt = new Date();
  }

  removeItem(itemId: string) {
    if (this.status !== statusDoPedido.RASCUNHO) {
      throwError("BAD_REQUEST", `Não é possível remover itens a um pedido que não está em rascunho`);
    }

    const findItem = this.itens?.find(item => item.id === itemId);

    if (!findItem) {
      throwError("BAD_REQUEST", `Item ${itemId} do pedido nao entrado`);
    }

    this.itens = this.itens?.filter(item => item.id !== itemId);
    this.calculaTotal();
    this.updatedAt = new Date();
  }

  calculaTotal() {
    this.valor = this.itens?.reduce((total: number, item: ItemPedido,) => total + item.calculaTotal(), 0) ?? 0;
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
