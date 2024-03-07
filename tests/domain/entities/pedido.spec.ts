import { v4 as uuidv4 } from "uuid";

import ItemPedido from "../../../src/domain/entities/itemPedido";
import Pedido from "../../../src/domain/entities/pedido";
import { statusDePagamento } from "../../../src/domain/entities/types/PagamentoType";
import { statusDoPedido } from "../../../src/domain/entities/types/pedidoType";

describe("Pedido", () => {
  const createdAt = new Date();
  const item = new ItemPedido({
    id: uuidv4(),
    produtoId: uuidv4(),
    quantidade: 2,
    valorUnitario: 1.1,
    observacao: "",
  });

  it("Teste adicionar item", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    expect(pedido.itens).toHaveLength(1);
  });

  it("Teste adicionar item com status diferente de Rascunho", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    try {
      pedido.adicionarItem(item);
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível adicionar itens a um pedido que não está em rascunho"
      );
    }
  });

  it("Teste remover item", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.removeItem(item.id);

    expect(pedido.itens).toHaveLength(0);
  });

  it("Teste remover item com status diferente de Rascunho", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    try {
      pedido.removeItem(item.id);
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível remover itens a um pedido que não está em rascunho"
      );
    }
  });

  it("Teste remover item que nao existe", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);
    const id = uuidv4();
    try {
      pedido.removeItem(id);
    } catch (e: any) {
      expect(e.message).toBe(`Item ${id} do pedido nao entrado`);
    }
  });

  it("Teste criar um Pedido -> RASCUNHO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    expect(pedido.status).toBe(statusDoPedido.RASCUNHO);
  });

  it("Teste finalizar criacao do pedido -> AGUARDANDO_PAGAMENTO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.entregaRascunho();
    expect(pedido.status).toBe(statusDoPedido.AGUARDANDO_PAGAMENTO);
  });

  it("Teste cancelar  pedido -> CANCELADO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.cancela();
    expect(pedido.status).toBe(statusDoPedido.CANCELADO_PROCESSAMENTO);
  });

  it("Teste finalizar criacao do pedido com status Errado -> AGUARDANDO_PAGAMENTO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;
    try {
      pedido.entregaRascunho();
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível alterar o status para Aguardando pagamento. Status atual do pedido é Aguardando pagamento"
      );
    }
  });

  it("Teste pagamento aprovado -> AGUARDANDO_PREPARO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    pedido.atualizaPagamento(statusDePagamento.PAGAMENTO_CONCLUIDO);
    expect(pedido.status).toBe(statusDoPedido.AGUARDANDO_PREPARO);
  });

  it("Teste pagamento reprovado -> FALHA", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    pedido.atualizaPagamento(statusDePagamento.FALHA);
    expect(pedido.status).toBe(statusDoPedido.FALHA);
  });

  it("Teste pagamento aprovado com status diferente -> EM_PREPARO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.RASCUNHO;

    try {
      pedido.atualizaPagamento(statusDePagamento.PAGAMENTO_CONCLUIDO);
    } catch (e: any) {
      expect(e.message).toBe(
        "Só é permitido alterar o status do pedido quando o status é Aguardando pagamento. Status Atual: Rascunho"
      );
    }
  });

  it("Teste iniciar preparo -> EM_PREPARO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PREPARO;

    pedido.emPreparo();
    expect(pedido.status).toBe(statusDoPedido.EM_PREPARO);
  });

  it("Teste iniciar preparo com status diferente -> EM_PREPARO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.RASCUNHO;

    try {
      pedido.emPreparo();
      pedido.entregaRascunho();
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível alterar o status para Em preparo. Status atual do pedido é Rascunho"
      );
    }
  });

  it("Teste finalizar preparo -> PRONTO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.EM_PREPARO;

    pedido.pronto();
    expect(pedido.status).toBe(statusDoPedido.PRONTO);
  });

  it("Teste finalizar preparo com status diferente -> PRONTO", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    try {
      pedido.pronto();
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível alterar o status para Pronto. Status atual do pedido é Aguardando pagamento"
      );
    }
  });

  it("Teste Entregar preparo -> ENTREGUE", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.PRONTO;

    pedido.entregue();
    expect(pedido.status).toBe(statusDoPedido.ENTREGUE);
  });

  it("Teste entregar com status diferente -> ENTREGUE", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    pedido.adicionarItem(item);

    pedido.status = statusDoPedido.AGUARDANDO_PAGAMENTO;

    try {
      pedido.entregue();
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível alterar o status para Entregue. Status atual do pedido é Aguardando pagamento"
      );
    }
  });

  it("Teste valor do pedido", async () => {
    const pedido = new Pedido({
      clienteId: uuidv4(),
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    try {
      pedido.validaValor();
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível realizar um pedido sem nenhum valor"
      );
    }
  });

  it("Teste converter classe para DTO", async () => {
    const id = uuidv4();
    const pedido = new Pedido({
      clienteId: id,
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });

    const dto = pedido.toObject();

    console.log(dto);
    console.log({
      id: pedido.id,
      clienteId: id,
      status: statusDoPedido.RASCUNHO,
      itens: [],
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });
    expect(dto).toStrictEqual({
      id: pedido.id,
      clienteId: id,
      status: statusDoPedido.RASCUNHO,
      itens: [],
      valor: 0,
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    });
  });
});
