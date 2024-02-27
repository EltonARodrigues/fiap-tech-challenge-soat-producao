import mongoose from "mongoose";

import PedidoModel from "../../../src/datasources/databaseNoSql/models/pedidoModel";
import PedidoDataBaseRepository from "../../../src/datasources/databaseNoSql/repository/pedidoDatabaseRepository";
import {
  AdicionaItemInput,
  RemoveItemInput,
} from "../../../src/domain/entities/types/pedidoService.type";
import {
  PedidoDTO,
  statusDoPedido,
} from "../../../src/domain/entities/types/pedidoType";

describe("PedidoRepository", () => {
  const pedidoRepository = new PedidoDataBaseRepository();
  let createdAt: Date;

  beforeAll(() => {
    createdAt = new Date();
  });

  it("Teste deve criar um pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: "Rascunho",
      valor: 0,
      retiradoEm: null,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.create = jest.fn().mockResolvedValue({
      id: "1",
      _id: new mongoose.mongo.ObjectId(),
      clienteId: "2",
      status: "Rascunho",
      valor: 0,
      retiradoEm: null,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    });

    const pedidoCriado = await pedidoRepository.criaPedido(pedido);
    expect(pedidoCriado).toMatchObject(pedido);
  });

  it("Teste deve atualizar status do pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: "Rascunho",
      valor: 0,
      retiradoEm: null,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOneAndUpdate = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({
        id: "1",
        _id: new mongoose.mongo.ObjectId(),
        clienteId: "2",
        status: statusDoPedido.AGUARDANDO_PAGAMENTO,
        valor: 0,
        retiradoEm: null,
        createdAt,
        deletedAt: null,
        updatedAt: null,
      }),
    }));

    const pedidoAtualizado = await pedidoRepository.atualizaStatusDoPedido(
      pedido.id,
      statusDoPedido.AGUARDANDO_PAGAMENTO
    );
    expect(pedidoAtualizado.status).toBe(statusDoPedido.AGUARDANDO_PAGAMENTO);
  });

  it("Teste deve atualizar pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.ENTREGUE,
      valor: 0,
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOneAndUpdate = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(pedido),
    }));

    const pedidoAtualizado = await pedidoRepository.atualizaPedido(pedido);
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste deve buscar pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.ENTREGUE,
      valor: 0,
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOne = jest.fn().mockResolvedValueOnce(pedido);

    const pedidoAtualizado = await pedidoRepository.retornaPedido(
      pedido.id,
      null
    );
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste deve buscar pedido com clienteId", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.ENTREGUE,
      valor: 0,
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOne = jest.fn().mockResolvedValueOnce(pedido);

    const pedidoAtualizado = await pedidoRepository.retornaPedido(
      pedido.id,
      "2"
    );
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste retornar proximo pedido fila", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.AGUARDANDO_PREPARO,
      valor: 0,
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(pedido),
    }));

    const pedidoAtualizado = await pedidoRepository.retornaProximoPedidoFila();
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste remover item no pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      itens: [],
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOneAndUpdate = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({
        id: "1",
        _id: new mongoose.mongo.ObjectId(),
        clienteId: "2",
        status: statusDoPedido.RASCUNHO,
        valor: 0,
        itens: [],
        retiradoEm: createdAt,
        createdAt,
        deletedAt: null,
        updatedAt: null,
      }),
    }));

    const removeItemInput: RemoveItemInput = {
      pedidoId: "1",
      itemId: "1",
      clienteId: "2",
    };

    const pedidoAtualizado = await pedidoRepository.removeItem(removeItemInput);
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste adicionar item no pedido", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      itens: [
        {
          produtoId: "2",
          quantidade: 2,
          valorUnitario: 1.1,
          valorTotal: 2.2,
        },
      ],
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.findOneAndUpdate = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({
        id: "1",
        _id: new mongoose.mongo.ObjectId(),
        clienteId: "2",
        status: statusDoPedido.RASCUNHO,
        valor: 0,
        itens: [
          {
            produtoId: "2",
            quantidade: 2,
            valorUnitario: 1.1,
            valorTotal: 2.2,
          },
        ],
        retiradoEm: createdAt,
        createdAt,
        deletedAt: null,
        updatedAt: null,
      }),
    }));

    const adicionaItem: AdicionaItemInput = {
      pedidoId: "1",
      produtoId: "2",
      quantidade: 2,
      valorUnitario: 1.1,
      valorTotal: 2.2,
    };

    const pedidoAtualizado = await pedidoRepository.adicionaItem(adicionaItem);
    expect(pedidoAtualizado).toMatchObject(pedido);
  });

  it("Teste listar pedidos", async () => {
    const pedido: PedidoDTO = {
      id: "1",
      clienteId: "2",
      status: statusDoPedido.RASCUNHO,
      valor: 0,
      itens: [
        {
          produtoId: "2",
          quantidade: 2,
          valorUnitario: 1.1,
          valorTotal: 2.2,
        },
      ],
      retiradoEm: createdAt,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    PedidoModel.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce([pedido, pedido]),
      })),
    }));

    const pedidoAtualizado = await pedidoRepository.listaPedidos(
      [statusDoPedido.RASCUNHO],
      "2"
    );
    expect(pedidoAtualizado?.length).toBe(2);
  });
});
