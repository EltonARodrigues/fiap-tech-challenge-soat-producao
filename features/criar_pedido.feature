Feature: Pedido

  Scenario: Criar um novo pedido como Rascunho
    Given que o sistema de pedidos está ok
    When eu envio uma solicitação para criar o pedido
    Then deve retornar um novo pedido com status Rascunho 
    And o status da resposta deve ser 201

  Scenario: Adicionar dois item ao pedido
    Given que exite um pedido criado
    When enviar dois item e adicionar ao pedido
    Then deve retornar um pedido atualizado com os items adicionados
    And o status da resposta ao adicionar um item deve ser 201

  Scenario: Remover um item do pedido
    Given que exite um pedido criado com itens adicinados
    When passar o id do item que deseja remover
    Then deve retornar um pedido atualizado o item escolhido removido
    And o status da resposta ao remover um item deve ser 201

  Scenario: Finalizar customizacao do pedido
    Given que exite um pedido criado e itens adicinados deve finalizar a customizacao
    When passar o id do pedido que esta em Rascunho
    Then deve retornar um pedido atualizado com o status Aguardando pagamento
    And o status da resposta para aguardando pagamento deve retornar 201

  Scenario: Inicia o preparo do pedido
    Given que exite um pedido na fila de preparo
    When passar o id do pedido que esta em Aguardando preparo
    Then deve retornar um pedido atualizado com o status Em preparo
    And o status da resposta para Em preparo deve retornar 201

  Scenario: Finalizar o preparo do pedido
    Given que exite um pedido terminou o preparo
    When passar o id do pedido que esta em Em preparo
    Then deve retornar um pedido atualizado com o status Pronto
    And o status da resposta para Pronto deve retornar 201

  Scenario: Entregar o pedido
    Given que exite um pedido esta finalizado
    When passar o id do pedido que esta Pronto
    Then deve retornar um pedido atualizado com o status Entregue
    And o status da resposta para Entregue deve retornar 201

  Scenario: Listar os pedidos
    Given que exite pedidos criados
    When passar o filtro dos pedidos
    Then deve retornar a lista de pedidos que bate com o status
    And o status da resposta da lista deve retornar 200
