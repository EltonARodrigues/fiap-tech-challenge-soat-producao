import { ProdutoDTO } from "~domain/entities/types/produtoType";
interface ProdutoRepository {
    retornaProduto(idProduto: string): Promise<ProdutoDTO | null>;
}
  
export default class ProdutoContractRepository implements ProdutoRepository{
    async retornaProduto(idProduto: string): Promise<ProdutoDTO | null> {
        const produto: ProdutoDTO = {
            id: "0bdd2317-f1e7-4977-938d-3b533b3d89e8",
            nome: "test",
            categoriaId: "029e3f8c-4c36-43ab-a289-d5a50e0983b2",
            preco: 1.1,
            imagens: [
            {
                id: "36cfde9c-23e1-4eb0-a818-c3393b1bbb6e",
                produtoId: "0bdd2317-f1e7-4977-938d-3b533b3d89e8",
                url: "string",
                createdAt: new Date("2024-01-04T00:48:04.090Z"),
                deletedAt: null,
                updatedAt: new Date("2024-01-04T00:48:04.117Z")
            }
            ],
            descricao: "desc test",
            createdAt: new Date("2024-01-04T00:48:04.090Z"),
            deletedAt: null,
            updatedAt: new Date("2024-01-04T00:48:04.117Z")
        }

        return produto.id === idProduto ? produto : null
    }
    
}