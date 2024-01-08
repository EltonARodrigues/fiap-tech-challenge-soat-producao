import ProdutoRepository from "../../../src/domain/repositories/produtoRepository";

export default class ProdutoRepositoryMock {
    createdAt: Date
    deletedAt: null | Date
    updatedAt: null | Date
    
    constructor(createdAt: Date) {
        this.createdAt = createdAt
        this.deletedAt = null
        this.updatedAt = null
    }

    repository() {
        const produtoRepositoryMock: ProdutoRepository = {
            retornaProduto: jest.fn().mockResolvedValue({
              id: "1",
              nome: "mock_1",
              preco: 10,
              descricao: null,
              createdAt: this.createdAt,
              deletedAt: this.deletedAt,
              updatedAt: this.updatedAt
            }),
          };

          return produtoRepositoryMock;
    }
}
