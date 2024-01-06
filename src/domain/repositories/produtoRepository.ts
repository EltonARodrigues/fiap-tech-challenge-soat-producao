import { ProdutoDTO } from "~domain/entities/types/produtoType";

export default interface ProdutoRepository {
  retornaProduto(idProduto: string): Promise<ProdutoDTO | null>;
}
