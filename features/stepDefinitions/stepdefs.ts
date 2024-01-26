
// eslint-disable-next-line unused-imports/no-unused-imports
import { Given, Then, When } from '@cucumber/cucumber'
import assert from 'assert';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

import connectDB from '../../src/datasources/databaseNoSql/config/init';
import PedidoDataBaseRepository from '../../src/datasources/databaseNoSql/repository/pedidoDatabaseRepository';
import { statusDePagamento } from '../../src/domain/entities/types/PagamentoType';
import { PedidoDTO, statusDoPedido } from '../../src/domain/entities/types/pedidoType';
import PagamentoUseCase from '../../src/domain/useCases/pagamentoUseCase';

dotenv.config();
const url_endpoint = "http://localhost:3000/api"

let response: any;
let pedidoId: string;
let pedido: PedidoDTO;
let itemRemoverId: string;

////////////////////////
Given('que o sistema de pedidos está ok', function () {
  return true;
});


When('eu envio uma solicitação para criar o pedido', async function () {
  response = await fetch(`${url_endpoint}/pedido/iniciar-pedido`);
});

Then('deve retornar um novo pedido com status Rascunho', async function () {
  const respBody = await response.json();
  pedidoId = respBody.message.id;
  pedido = respBody.message;
  assert.equal(respBody.message.status, statusDoPedido.RASCUNHO);

});

Then('o status da resposta deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////
Given('que exite um pedido criado', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.RASCUNHO);
});


When('enviar dois item e adicionar ao pedido', async function () {
  response = await fetch(`${url_endpoint}/pedido/${pedidoId}/adicionar-item`, {
    method: "POST",
    body: JSON.stringify({
      produtoId: '3117a0bd-e0c4-421d-a035-67f9b95cc407',
      quantidade: 1,
      observacao: "test"
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  });

  response = await fetch(`${url_endpoint}/pedido/${pedidoId}/adicionar-item`, {
    method: "POST",
    body: JSON.stringify({
      produtoId: '3117a0bd-e0c4-421d-a035-67f9b95cc407',
      quantidade: 1,
      observacao: "test"
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  });
});

Then('deve retornar um pedido atualizado com os items adicionados', async function () {
  const respBody = await response.json();
  itemRemoverId = respBody?.message?.itens[0]?.id;
  pedido = respBody.message;
  assert.equal(respBody?.message?.itens?.length, 2);

});


Then('o status da resposta ao adicionar um item deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////
Given('que exite um pedido criado com itens adicinados', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.RASCUNHO);
});

When('passar o id do item que deseja remover', async function () {
  response = await fetch(`${url_endpoint}/pedido/${pedidoId}/remover-item/${itemRemoverId}`, {
    method: "DELETE",
  });

});

Then('deve retornar um pedido atualizado o item escolhido removido', async function () {
  const respBody = await response.json();
  pedido = respBody.message;
  assert.equal(respBody?.message?.itens?.length, 1);
  assert.notEqual(respBody?.message?.itens[0]?.id, itemRemoverId);

});


Then('o status da resposta ao remover um item deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////

Given('que exite um pedido criado e itens adicinados deve finalizar a customizacao', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.RASCUNHO);
});

When('passar o id do pedido que esta em Rascunho', async function () {
  response = await fetch(`${url_endpoint}/pedido/realizar-pedido/${pedidoId}`, {
    method: "PATCH",
    body: JSON.stringify({
      metodoDePagamentoId: 'ea3d6981-099d-49a5-9f45-9ed88affc9b5'
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  });

});

Then('deve retornar um pedido atualizado com o status Aguardando pagamento', async function () {
  const respBody = await response.json();
  pedido = respBody.message;
  assert.equal(respBody?.message?.status, statusDoPedido.AGUARDANDO_PAGAMENTO);

});

Then('o status da resposta para aguardando pagamento deve retornar {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////

Given('que exite um pedido na fila de preparo', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.AGUARDANDO_PAGAMENTO)

  await connectDB(process.env.DB_HOST ?? "localhost", process.env.DB_PORT ?? "27017", process.env.DB_NAME ?? "fiap-soat-project_db");

  const pedidoRepository = new PedidoDataBaseRepository();
  await PagamentoUseCase.atualizaPagamentoPedido(pedidoRepository, {
    pedidoId,
    statusPagamento: statusDePagamento.PAGAMENTO_APROVADO
  })

  mongoose.connection.close()

});

When('passar o id do pedido que esta em Aguardando preparo', async function () {
  response = await fetch(`${url_endpoint}/pedido/iniciar-preparo/?pedidoId=${pedidoId}`, {
    method: "PATCH"
  });
});

Then('deve retornar um pedido atualizado com o status Em preparo', async function () {
  const respBody = await response.json();
  pedido = respBody.message;
  assert.equal(respBody?.message?.status, statusDoPedido.EM_PREPARO);

});

Then('o status da resposta para Em preparo deve retornar {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////

Given('que exite um pedido terminou o preparo', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.EM_PREPARO)
});

When('passar o id do pedido que esta em Em preparo', async function () {
  response = await fetch(`${url_endpoint}/pedido/finalizar-preparo/${pedidoId}`, {
    method: "PATCH"
  });
});

Then('deve retornar um pedido atualizado com o status Pronto', async function () {
  const respBody = await response.json();
  pedido = respBody.message;
  assert.equal(respBody?.message?.status, statusDoPedido.PRONTO);

});

Then('o status da resposta para Pronto deve retornar {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////

Given('que exite um pedido esta finalizado', async function () {
  assert(pedidoId != null);
  assert.equal(pedido.status, statusDoPedido.PRONTO)
});

When('passar o id do pedido que esta Pronto', async function () {
  response = await fetch(`${url_endpoint}/pedido/entregar-pedido/${pedidoId}`, {
    method: "PATCH"
  });
});

Then('deve retornar um pedido atualizado com o status Entregue', async function () {
  const respBody = await response.json();
  pedido = respBody.message;
  assert.equal(respBody?.message?.status, statusDoPedido.ENTREGUE);

});

Then('o status da resposta para Entregue deve retornar {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////

Given('que exite pedidos criados', async function () {
  assert(pedidoId != null);
});

When('passar o filtro dos pedidos', async function () {
  response = await fetch(`${url_endpoint}/pedido/?status=Entregue`, {
    method: "GET"
  });
});

Then('deve retornar a lista de pedidos que bate com o status', async function () {
  const respBody = await response.json();
  respBody?.message?.map((pedido: PedidoDTO) => {
    assert.equal(pedido?.status, statusDoPedido.ENTREGUE);
    
  })

});

Then('o status da resposta da lista deve retornar {int}', function (status) {
  assert.equal(response.status, status);
});
