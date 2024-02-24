import { ItemDoPedidoInput } from "../../src/domain/entities/types/itensPedidoType";
import {
  RealizaPedidoInput,
  RemoveItemInput,
} from "../../src/domain/entities/types/pedidoService.type";
import { PedidoInput } from "../../src/domain/entities/types/pedidoType";
import FilaRepository from "../../src/domain/repositories/filaRepository";
import MetodoPagamentoRepository from "../../src/domain/repositories/MetodoPagamentoRepository";
import PedidoRepository from "../../src/domain/repositories/pedidoRepository";
import ProdutoRepository from "../../src/domain/repositories/produtoRepository";
import PedidoUseCase from "../../src/domain/useCases/pedidoUseCase";

describe("PedidoUseCase", () => {
  let filaRepository: FilaRepository;
  const createdAt = new Date();
  let metodoPagamentoRepositoryMock: MetodoPagamentoRepository;
  const produtoRepositoryMock: ProdutoRepository = {
    retornaProduto: jest.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    metodoPagamentoRepositoryMock = {
      retornaMetodoPagamentoValido: jest.fn().mockResolvedValue(true),
    };
    produtoRepositoryMock.retornaProduto = jest.fn().mockResolvedValue({
      id: "1",
      nome: "mock_1",
      preco: 10,
      descricao: null,
      createdAt: createdAt,
      deletedAt: null,
      updatedAt: null,
    });
    filaRepository = {
      enviaParaFila: jest.fn().mockResolvedValue(null),
      recebeMensagem: jest.fn().mockResolvedValue(null),
      deletaMensagemProcessada: jest.fn().mockResolvedValue(null),
      enviaParaDLQ: jest.fn().mockResolvedValue(null),
    };
  });

  it("Testa iniciar Pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const pedidoInput: PedidoInput = {
      clienteId: "", // OBRIGATORIO, CORRIGIR PROJETO
      status: "Rascunho",
      valor: 0,
      retiradoEm: null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    const novoPedido = await PedidoUseCase.iniciaPedido(
      pedidoRepositoryMock,
      pedidoInput
    );
    expect(novoPedido.status).toBe("Rascunho");
    expect(novoPedido.itens).toHaveLength(0);
  });

  it("Testa buscar um Pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
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
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const pedido = await PedidoUseCase.buscaPedido(pedidoRepositoryMock, "1");
    expect(pedido).toBeTruthy();
  });

  it("Testa buscar um Pedido que nao existe", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const pedido = await PedidoUseCase.buscaPedido(pedidoRepositoryMock, "1");
    expect(pedido).toBeNull();
  });

  it("Testa adicionar itens ao Pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 3.2,
        itens: [
          {
            id: "1",
            produtoId: "1",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 1.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
          {
            id: "2",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),

      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "3",
      quantidade: 1,
    };
    const itemPedido2: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "4",
      quantidade: 1,
    };

    await PedidoUseCase.adicionaItem(
      pedidoRepositoryMock,
      produtoRepositoryMock,
      itemPedido1
    );
    const pedidiComItem = await PedidoUseCase.adicionaItem(
      pedidoRepositoryMock,
      produtoRepositoryMock,
      itemPedido2
    );
    expect(pedidiComItem?.status).toBe("Rascunho");
    expect(pedidiComItem?.itens).toHaveLength(2);
  });

  it("Testa adicionar item com quantidade zerada ao Pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
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
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "2",
      quantidade: 0,
    };

    try {
      await PedidoUseCase.adicionaItem(
        pedidoRepositoryMock,
        produtoRepositoryMock,
        itemPedido1
      );
    } catch (e: any) {
      expect(e.message).toBe(
        "Quantidade do item selecionado nao pode ser menor que 0"
      );
    }
  });

  it("Testa adicionar item a um pedido inexistente", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "2",
      quantidade: 1,
    };

    try {
      await PedidoUseCase.adicionaItem(
        pedidoRepositoryMock,
        produtoRepositoryMock,
        itemPedido1
      );
    } catch (e: any) {
      expect(e.message).toBe("Pedido nao encontrado");
    }
  });

  it("Testa adicionar item a um pedido com produto inexistente", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 3.2,
        itens: [
          {
            id: "1",
            produtoId: "1",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 1.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
          {
            id: "2",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),

      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "2",
      quantidade: 1,
    };

    produtoRepositoryMock.retornaProduto = jest.fn().mockResolvedValue(null);

    try {
      await PedidoUseCase.adicionaItem(
        pedidoRepositoryMock,
        produtoRepositoryMock,
        itemPedido1
      );
    } catch (e: any) {
      expect(e.message).toBe("Produto nao encontrado");
    }
  });

  it("Testa remover item de um pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 3.2,
        itens: [
          {
            id: "2",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),

      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        valor: 3.2,
        itens: [
          {
            id: "1",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
          {
            id: "2",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const itemPedido1: RemoveItemInput = {
      pedidoId: "1",
      itemId: "1",
      clienteId: "",
    };

    // produtoRepositoryMock.retornaProduto = jest.fn().mockResolvedValue(null);

    const pedido = await PedidoUseCase.removeItem(
      pedidoRepositoryMock,
      itemPedido1
    );
    expect(pedido?.itens).toHaveLength(1);
  });

  it("Testa remover item de um pedido que nao existe", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),

      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const itemPedido1: RemoveItemInput = {
      pedidoId: "1",
      itemId: "1",
      clienteId: "",
    };

    produtoRepositoryMock.retornaProduto = jest.fn().mockResolvedValue(null);

    try {
      await PedidoUseCase.removeItem(pedidoRepositoryMock, itemPedido1);
    } catch (e: any) {
      expect(e.message).toBe("Pedido nao encontrado");
    }
  });

  it("Testa realizar pedido sem itens", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
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
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const realizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: "1",
      metodoDePagamentoId: "",
    };

    try {
      await PedidoUseCase.realizaPedido(
        metodoPagamentoRepositoryMock,
        filaRepository,
        pedidoRepositoryMock,
        realizaPedidoInput
      );
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é possível realizar um pedido sem nenhum valor"
      );
    }
  });

  it("Testa realizar pedido que nao tem um metodo de pagamento valido", async () => {
    metodoPagamentoRepositoryMock.retornaMetodoPagamentoValido = jest
      .fn()
      .mockResolvedValue(false);

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const prealizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: "1",
      metodoDePagamentoId: "",
    };

    try {
      await PedidoUseCase.realizaPedido(
        metodoPagamentoRepositoryMock,
        filaRepository,
        pedidoRepositoryMock,
        prealizaPedidoInput
      );
    } catch (e: any) {
      expect(e.message).toBe("Metodo de pagamento nao encontrado!");
    }
  });

  it("Testa realizar pedido que nao existe", async () => {
    // metodoPagamentoRepositoryMock.retornaMetodoPagamentoValido = jest.fn().mockResolvedValue(true)

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const prealizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: "1",
      metodoDePagamentoId: "",
    };

    try {
      await PedidoUseCase.realizaPedido(
        metodoPagamentoRepositoryMock,
        filaRepository,
        pedidoRepositoryMock,
        prealizaPedidoInput
      );
    } catch (e: any) {
      expect(e.message).toBe("Pedido nao encontrado");
    }
  });

  it("Testa mudar staus para -> Aguardando Preparo", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Aguardando pagamento",
        valor: 3.2,
        itens: [
          {
            id: "1",
            produtoId: "1",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 1.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
          {
            id: "2",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 1,
            valorUnitario: 2.1,
            valorTotal: 10,
            observacao: "test",
            createdAt,
            updatedAt: null,
            deletedAt: null,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),

      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Rascunho",
        itens: [
          {
            id: "4",
            produtoId: "2",
            pedidoId: "1",
            quantidade: 2,
            valorUnitario: 5,
            valorTotal: 10,
          },
        ],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const realizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: "1",
      metodoDePagamentoId: "",
    };

    const realizaPedido = await PedidoUseCase.realizaPedido(
      metodoPagamentoRepositoryMock,
      filaRepository,
      pedidoRepositoryMock,
      realizaPedidoInput
    );
    expect(realizaPedido?.status).toBe("Aguardando pagamento");
  });

  it("Testa mudar status via id para -> Iniciar Preparo", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Em Preparo",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Aguardando preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock,
      "1"
    );
    expect(realizaPedido?.status).toBe("Em Preparo");
  });

  it("Testa mudar status do proximo pedido da fila para -> Iniciar Preparo", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Em Preparo",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Aguardando preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock
    );
    expect(realizaPedido?.status).toBe("Em Preparo");
  });

  it("Testa mudar status do proximo pedido que nao existe da fila para -> Iniciar Preparo", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock
    );
    expect(realizaPedido).toBeNull();
  });

  it("Testa mudar status do pedido para  -> Iniciar Preparo", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Em Preparo",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Aguardando preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock
    );
    expect(realizaPedido?.status).toBe("Em Preparo");
  });

  it("Testa mudar status do pedido -> Finalizado", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Pronto",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Em preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const realizaPedido = await PedidoUseCase.finalizaPreparo(
      pedidoRepositoryMock,
      "1"
    );
    expect(realizaPedido?.status).toBe("Pronto");
  });

  it("Testa mudar status de um pedido que nao existe -> Finalizado", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    try {
      await PedidoUseCase.finalizaPreparo(pedidoRepositoryMock, "1");
    } catch (e: any) {
      expect(e.message).toBe("Pedido nao encontrado");
    }
  });

  it("Testa mudar status de um pedido -> Entregue", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Entregue",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Pronto",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    };

    const pedido = await PedidoUseCase.entregaPedido(pedidoRepositoryMock, "1");
    expect(pedido?.status).toBe("Entregue");
  });

  it("Testa mudar status de um pedido que nao existe -> Entregue", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        status: "Pronto",
        valor: 3.2,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    try {
      await PedidoUseCase.entregaPedido(pedidoRepositoryMock, "1");
    } catch (e: any) {
      expect(e.message).toBe("Pedido nao encontrado");
    }
  });

  it("Testa buscar proximo pedido da fila quando nao tem nenhum pedido", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue(null),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const proximoPedido = await PedidoUseCase.retornaProximoPedidoFila(
      pedidoRepositoryMock
    );
    expect(proximoPedido).toBeNull();
  });

  it("Testa Listar pedidos", async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue(null),
      listaPedidos: jest.fn().mockResolvedValue([
        {
          id: "1",
          clienteId: "",
          status: "Pronto",
          valor: 3.2,
          itens: [],
          retiradoEm: null,
          createdAt: Date,
          deletedAt: null,
          updatedAt: null,
        },
        {
          id: "2",
          clienteId: "",
          status: "Pronto",
          valor: 3.2,
          itens: [],
          retiradoEm: null,
          createdAt: Date,
          deletedAt: null,
          updatedAt: null,
        },
        {
          id: "3",
          clienteId: "",
          status: "Pronto",
          valor: 3.2,
          itens: [],
          retiradoEm: null,
          createdAt: Date,
          deletedAt: null,
          updatedAt: null,
        },
      ]),
      retornaProximoPedidoFila: jest.fn().mockResolvedValue(null),
      removeItem: jest.fn().mockResolvedValue(null),
      atualizaStatusDoPedido: jest.fn().mockResolvedValue(null),
      adicionaItem: jest.fn().mockResolvedValue(null),
      retornaPedido: jest.fn().mockResolvedValue(null),
    };

    const pedidos = await PedidoUseCase.listaPedidos(pedidoRepositoryMock);
    expect(pedidos).toHaveLength(3);
  });
});
