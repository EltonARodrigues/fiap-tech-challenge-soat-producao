import supertest from "supertest";
import express from "express";

import { pedidoRouter } from "../../src/presenters/api/routers";
import { Server } from "../../src/presenters/api/config/server.config";
import { PedidoController } from "../../src/interfaceAdapters/controllers/pedidoController";
import { PedidoDTO } from "../../src/domain/entities/types/pedidoType";
import throwError from "../../src/handlerError/handlerError";

describe('pedidoRouter()', () => {
  const createdAt = new Date();
  let pedidoMock: PedidoDTO;
  let itemMock: any;
  const createServer = () => {
    const app = express()
    const server = new Server({ appConfig: app });
    server.addRouter("/api/pedido", pedidoRouter);

    return server.config();
  }

  beforeEach(() => {
    pedidoMock = {
      id: "2313853d-6a29-494c-9e85-5e2d7ff433c4",
      clienteId: "111",
      valor: 0,
      status: "Rascunho",
      itens: [],
      retiradoEm: null,
      createdAt,
      updatedAt: null,
      deletedAt: null,
    }

    itemMock = {
      id: "9ddf5a39-59bc-49e9-b52d-9044ed484624",
      produtoId: "1001d90d-df78-4c02-8826-10a85e7117cd",
      quantidade: 1,
      valorUnitario: 1,
      valorTotal: 1,
      observacao: "string",
      createdAt: "2024-01-25T18:01:38.102Z"
    }

  })


  it('Deve criar um novo pedido com o status Rascunho', async () => {

    PedidoController.iniciaPedido = jest.fn().mockResolvedValue(pedidoMock);

    await supertest(await createServer())
      .get("/api/pedido/iniciar-pedido")
      .expect(201)
      .then((response) => {
        // Check the response type and length
        expect(response?.body?.message?.status).toBe(pedidoMock?.status);
        expect(response?.body?.message?.id).toBe(pedidoMock?.id);
      })
  });

  it('Deve  finalizar o pedido em Rascunho com itens ', async () => {
    const responseExpected = {
      "status": "success",
      "message": {
        "id": pedidoMock.id,
        "clienteId": pedidoMock.clienteId,
        "status": "Aguardando pagamento",
        "itens": [
          {
            "id": "9ddf5a39-59bc-49e9-b52d-9044ed484624",
            "produtoId": "1001d90d-df78-4c02-8826-10a85e7117cd",
            "quantidade": 1,
            "valorUnitario": 1,
            "valorTotal": 1,
            "observacao": "string",
            "createdAt": "2024-01-25T18:01:58.719Z"
          }
        ],
        "retiradoEm": null,
        createdAt,
        "deletedAt": null,
        "updatedAt": "2024-01-25T18:01:58.714Z",
        "valor": 1
      }
    }


    PedidoController.realizaPedido = jest.fn().mockResolvedValue(responseExpected);

    await supertest(await createServer())
      .patch(`/api/pedido/realizar-pedido/${pedidoMock?.id}`)
      .send({
        metodoDePagamentoId: "ed558dd4-aee0-41bb-8ad6-efdae429216f"
      })
      .expect(201)
      .then((response) => {
        expect(response?.body?.status).toStrictEqual(responseExpected.status);
      })
  });

  it('Deve impedir de finalizar o pedido em Rascunho sem itens ', async () => {
    const responseExpected = {
      "error": {
        "message": "Não é possível realizar um pedido sem nenhum valor"
      }
    }

    PedidoController.realizaPedido = jest.fn().mockImplementation(() => {
      return throwError("BAD_REQUEST", 'Não é possível realizar um pedido sem nenhum valor')
    });
    await supertest(await createServer())
      .patch(`/api/pedido/realizar-pedido/${pedidoMock?.id}`)
      .send({
        metodoDePagamentoId: "ed558dd4-aee0-41bb-8ad6-efdae429216f"
      })
      .expect(400)
      .then((response) => {
        // Check the response type and length
        expect(response?.body).toStrictEqual(responseExpected);
      })
  });

  it('Deve adicionar um item ao rascunho', async () => {
    const responseExpected = {
      "id": "72ddc742-77a0-494e-97d6-d5896c9b7591",
      "clienteId": "111",
      "status": "Rascunho",
      "itens": [
        itemMock
      ],
      "retiradoEm": null,
      "createdAt": "2024-01-25T18:01:30.433Z",
      "deletedAt": null,
      "updatedAt": "2024-01-25T18:01:38.085Z",
      "valor": 1
    }

    PedidoController.adicionaItem = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .post(`/api/pedido/${pedidoMock.id}/adicionar-item`)
      .send({
        "produtoId": "1001d90d-df78-4c02-8826-10a85e7117cd",
        "quantidade": 1,
        "observacao": "string"
      })
      .expect(201)
      .then((response) => {
        // Check the response type and length
        expect(response?.body?.message?.itens?.length).toBe(1)
      })
  });

  it('Deve remover um item do rascunho', async () => {
    const responseExpected = {
      "id": "72ddc742-77a0-494e-97d6-d5896c9b7591",
      "clienteId": "111",
      "status": "Rascunho",
      "itens": [],
      "retiradoEm": null,
      "createdAt": "2024-01-25T18:01:30.433Z",
      "deletedAt": null,
      "updatedAt": "2024-01-25T18:01:38.085Z",
      "valor": 1
    }

    PedidoController.removeItem = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .delete(`/api/pedido/${pedidoMock.id}/remover-item/${itemMock.id}`)
      .expect(201)
      .then((response) => {
        // Check the response type and length
        expect(response?.body?.message?.itens?.length).toBe(0)
      })
  });

  it('Deve iniciar preparo do pedido', async () => {
    const responseExpected = {
      ...pedidoMock,
      status: 'Em preparo'
    }

    PedidoController.iniciaPreparo = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .patch(`/api/pedido/iniciar-preparo?pedidoId=${pedidoMock.id}`)
      .expect(201)
      .then((response) => {
        expect(response?.body?.message?.status).toBe(responseExpected.status)
      })
  });

  it('Deve finalizar preparo do pedido', async () => {
    const responseExpected = {
      ...pedidoMock,
      status: 'Pronto'
    }

    PedidoController.finalizaPreparo = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .patch(`/api/pedido/finalizar-preparo/${pedidoMock.id}`)
      .expect(201)
      .then((response) => {
        expect(response?.body?.message?.status).toBe(responseExpected.status)
      })
  });

  it('Deve entregar pedido', async () => {
    const responseExpected = {
      ...pedidoMock,
      status: 'Entregue'
    }

    PedidoController.entregaPedido = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .patch(`/api/pedido/entregar-pedido/${pedidoMock.id}`)
      .expect(201)
      .then((response) => {
        expect(response?.body?.message?.status).toBe(responseExpected.status)
      })
  });

  it('Deve listar pedidos', async () => {
    const responseExpected = [pedidoMock]
    
    PedidoController.listaPedidos = jest.fn().mockResolvedValue(responseExpected);
    await supertest(await createServer())
      .get(`/api/pedido`)
      .expect(200)
      .then((response) => {
        expect(response?.body?.message.length).toBe(1);
      })
  });

});
