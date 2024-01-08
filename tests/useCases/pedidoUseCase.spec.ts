import { ItemDoPedidoInput } from "../../src/domain/entities/types/itensPedidoType";
import { RealizaPedidoInput } from "../../src/domain/entities/types/pedidoService.type";
import { PedidoInput } from "../../src/domain/entities/types/pedidoType";
import FilaRepository from '../../src/domain/repositories/filaRepository';
import PedidoRepository from "../../src/domain/repositories/pedidoRepository";
import PedidoUseCase from "../../src/domain/useCases/pedidoUseCase";
import Pedido from "../../src/domain/entities/pedido";
import ProdutoRepositoryMock from "../mock/repositories/produtoRepositoryMock";


describe('PedidoUseCase', () => {
  let filaRepository: FilaRepository;
  const createdAt = new Date();
  const produtoRepositoryMock = new ProdutoRepositoryMock(createdAt).repository();

  beforeEach(() => {
    filaRepository = {
      enviaParaFila: jest.fn().mockResolvedValue(null),
      recebeMensagem: jest.fn().mockResolvedValue(null),
      deletaMensagemProcessada: jest.fn().mockResolvedValue(null),
      enviaParaDLQ: jest.fn().mockResolvedValue(null),
    }
  })

  it('Testa iniciar Pedido', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: null,
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
    }

    const pedidoInput: PedidoInput = {
      clienteId: "", // OBRIGATORIO, CORRIGIR PROJETO
      fatura: null,
      status: "Rascunho",
      valor: 0,
      retiradoEm: null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    }

    const novoPedido = await PedidoUseCase.iniciaPedido(pedidoRepositoryMock, pedidoInput)
    expect(novoPedido.status).toBe('Rascunho');
    expect(novoPedido.itens).toHaveLength(0)
  });

  it('Testa buscar um Pedido', async () => {

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
        fatura: null,
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }

    const pedido = await PedidoUseCase.buscaPedido(pedidoRepositoryMock, "1")
    expect(pedido).toBeTruthy();
  });

  it('Testa adicionar itens ao Pedido', async () => {
    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: null,
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
        fatura: null,
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "3",
      quantidade: 1
    }
    const itemPedido2: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "4",
      quantidade: 1
    }

    await PedidoUseCase.adicionaItem(pedidoRepositoryMock, produtoRepositoryMock, itemPedido1)
    const pedidiComItem = await PedidoUseCase.adicionaItem(pedidoRepositoryMock, produtoRepositoryMock, itemPedido2)
    expect(pedidiComItem?.status).toBe('Rascunho');
    expect(pedidiComItem?.itens).toHaveLength(2)
  });

  it('Testa adicionar item com quantidade zerada ao Pedido', async () => {
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
        fatura: null,
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }

    const itemPedido1: ItemDoPedidoInput = {
      pedidoId: "1",
      produtoId: "2",
      quantidade: 0
    }

    expect(async () => {
      await PedidoUseCase.adicionaItem(pedidoRepositoryMock, produtoRepositoryMock, itemPedido1)
    }).rejects.toThrow()
  });

  it('Testa realizar pedido sem itens', async () => {

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
        fatura: null,
        status: "Rascunho",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }

    const prealizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: '1',
      metodoDePagamentoId: ""
    }

    expect(async () => {
      await PedidoUseCase.realizaPedido(
        filaRepository,
        pedidoRepositoryMock,
        prealizaPedidoInput)
    }).rejects.toThrow()
  });

  it('Testa mudar staus para -> Aguardando Preparo', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: "1",
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
        fatura: null,
        status: "Rascunho",
        itens: [{
          id: "4",
          produtoId: "2",
          pedidoId: "1",
          quantidade: 2,
          valorUnitario: 5,
          valorTotal: 10,
        }],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }

    const realizaPedidoInput: RealizaPedidoInput = {
      pedidoId: "1",
      clienteId: '1',
      metodoDePagamentoId: ""
    }

    // const mockBuscaPedido = jest.fn().mockReturnValue(new Pedido({
    //   id: "1",
    //   clienteId: "",
    //   fatura: null,
    //   status: "Rascunho",
    //   valor: 1,
    //   retiradoEm: null,
    //   createdAt: new Date(),
    //   deletedAt: null,
    //   updatedAt: null,
    // }))

    // PedidoUseCase.buscaPedido = mockBuscaPedido;


    const realizaPedido = await PedidoUseCase.realizaPedido(
      filaRepository,
      pedidoRepositoryMock,
      realizaPedidoInput)
    expect(realizaPedido?.status).toBe("Aguardando pagamento")
    expect(realizaPedido?.fatura).toBe("1")

  });

  it('Testa mudar status via id para -> Iniciar Preparo', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: "1",
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
        fatura: null,
        status: "Aguardando preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }


    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock,
      "1")
    expect(realizaPedido?.status).toBe("Em Preparo")

  });

  it('Testa mudar status do proximo pedido da fila para -> Iniciar Preparo', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: "1",
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
        fatura: null,
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
    }


    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock,
    )
    expect(realizaPedido?.status).toBe("Em Preparo")

  });
  it('Testa mudar status do pedido para  -> Iniciar Preparo', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: "1",
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
        fatura: null,
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
    }


    const realizaPedido = await PedidoUseCase.iniciaPreparo(
      pedidoRepositoryMock,
    )
    expect(realizaPedido?.status).toBe("Em Preparo")

  });

  it('Testa mudar status do pedido -> Finalizado', async () => {

    const pedidoRepositoryMock: PedidoRepository = {
      criaPedido: jest.fn().mockResolvedValue(null),
      atualizaPedido: jest.fn().mockResolvedValue({
        id: "1",
        clienteId: "",
        fatura: "1",
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
        fatura: null,
        status: "Em preparo",
        valor: 0,
        itens: [],
        retiradoEm: null,
        createdAt: Date,
        deletedAt: null,
        updatedAt: null,
      }),
    }


    const realizaPedido = await PedidoUseCase.finalizaPreparo(
      pedidoRepositoryMock,
      "1")
    expect(realizaPedido?.status).toBe("Pronto")

  });
});
