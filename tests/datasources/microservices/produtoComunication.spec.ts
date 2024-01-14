import ProdutoMicroserviceComunication from '../../../src/datasources/microservices/produtoComunication';
import { ProdutoDTO } from '../../../src/domain/entities/types/produtoType';


describe('ProdutoMicroserviceComunication', () => {
  const produtoRepository = new ProdutoMicroserviceComunication();

  it('Teste buscar um produto', async () => {
    const produtoId = "1001d90d-df78-4c02-8826-10a85e7117cd"
    const mockProduto = {
      "id": produtoId,
      "nome": "test",
      "categoriaId": "3117a0bd-e0c4-421d-a035-67f9b95cc407",
      "preco": 1,
      "imagens": [
        {
          "id": "2883ada3-a1cc-4481-964e-503df981676a",
          "produtoId": produtoId,
          "url": "string",
          "createdAt": "2024-01-07T14:45:54.573Z",
          "deletedAt": null,
          "updatedAt": "2024-01-07T14:45:54.596Z"
        }
      ],
      "descricao": "terwtet",
      "createdAt": "2024-01-07T14:45:54.573Z",
      "deletedAt": null,
      "updatedAt": "2024-01-07T14:45:54.587Z"
    };

    global.fetch = jest.fn().mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 200,
        json: () => mockProduto,
      }
    });

    const produtoEncontrado = await produtoRepository.retornaProduto(produtoId) as ProdutoDTO;
    expect(mockProduto.id).toBe(produtoEncontrado?.id);
  });

  it('Teste buscar um produto inexistente ', async () => {
    const produtoId = "1001d90d-df78-4c02-8826-10a85e7117cd"

    global.fetch = jest.fn().mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 404,
        json: () => null,
      }
    });

    const produtoEncontrado = await produtoRepository.retornaProduto(produtoId) as ProdutoDTO;
    expect(produtoEncontrado).toBeNull()
  });

  it('Teste buscar um produto com erro inesperado ', async () => {
    const produtoId = "1001d90d-df78-4c02-8826-10a85e7117cd"

    global.fetch = jest.fn().mockImplementationOnce(async () => {
      return {
        ok: false,
        status: 500,
        json: () => null,
      }
    });

    try {
      await produtoRepository.retornaProduto(produtoId) as ProdutoDTO;
    } catch (e: any) {
      expect(e.message).toBe("Nao foi possivel encontrar o produto!");
    }
  });
});
