import {
  PagamentoStatusUpdateBody,
  statusDePagamento,
} from "../../src/domain/entities/types/PagamentoType";
import { statusDoPedido } from "../../src/domain/entities/types/pedidoType";
import FilaRepository from "../../src/domain/repositories/filaRepository";
import PedidoRepository from "../../src/domain/repositories/pedidoRepository";
import PagamentoUseCase from "../../src/domain/useCases/pagamentoUseCase";

describe("PagamentoUseCase", () => {
  let pedidoRepositoryMock: PedidoRepository;
  let filaRepository: FilaRepository;

  const createdAt = new Date();

  beforeEach(() => {
    pedidoRepositoryMock = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: statusDoPedido.AGUARDANDO_PAGAMENTO,
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };
    filaRepository = {
      enviaParaFila: jest.fn().mockResolvedValue(null),
      recebeMensagem: jest.fn().mockResolvedValue(null),
      deletaMensagemProcessada: jest.fn().mockResolvedValue(null),
      enviaParaDLQ: jest.fn().mockResolvedValue(null),
    };
  });

  it("Testa atualizar pagamento aprovado no Pedido", async () => {
    const pagamentoUpdate: PagamentoStatusUpdateBody = {
      pedidoId: "1",
      statusPagamento: statusDePagamento.PAGAMENTO_APROVADO,
    };

    const novoPedido = await PagamentoUseCase.atualizaPagamentoPedido(
      filaRepository,
      pedidoRepositoryMock,
      pagamentoUpdate
    );
    expect(novoPedido.status).toBe(statusDoPedido.AGUARDANDO_PREPARO);
  });

  it("Testa atualizar pagamento reprovado no Pedido", async () => {
    const pagamentoUpdate: PagamentoStatusUpdateBody = {
      pedidoId: "1",
      statusPagamento: statusDePagamento.PAGAMENTO_NEGADO,
    };

    const novoPedido = await PagamentoUseCase.atualizaPagamentoPedido(
      filaRepository,
      pedidoRepositoryMock,
      pagamentoUpdate
    );
    expect(novoPedido.status).toBe(statusDoPedido.FALHA);
  });

  it("Testa atualizar pagamento de um pedido que nao existe", async () => {
    pedidoRepositoryMock.retornaPedido = jest.fn().mockResolvedValue(null);

    const pagamentoUpdate: PagamentoStatusUpdateBody = {
      pedidoId: "1",
      statusPagamento: statusDePagamento.PAGAMENTO_APROVADO,
    };

    try {
      await PagamentoUseCase.atualizaPagamentoPedido(
        filaRepository,
        pedidoRepositoryMock,
        pagamentoUpdate
      );
    } catch (e: any) {
      expect(e.message).toBe(
        `Pedido ${pagamentoUpdate.pedidoId} nao encontrado`
      );
    }
  });
});
