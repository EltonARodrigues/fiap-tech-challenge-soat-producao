
import { ImagemProdutoDTO, ProdutoDTO } from "~domain/entities/types/produtoType";
import ProdutoRepository from "~domain/repositories/produtoRepository";

// import CategoriaModel from "../models/categoriaModel";
// import ImagensProdutoModel from "../models/produtoImagensModel";
// import ProdutoModel from "../models/produtoModel";

class ProdutosDataBaseRepository implements ProdutoRepository {
  adicionaImagens(imagens: ImagemProdutoDTO[]): Promise<ImagemProdutoDTO[]> {
    throw new Error("Method not implemented.");
  }
  removeImagem(idProduto: string, idImagem: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  criaProduto(produto: ProdutoDTO): Promise<ProdutoDTO> {
    throw new Error("Method not implemented.");
  }
  deletaProduto(idProduto: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  editaProduto(idProduto: string, produto: ProdutoDTO): Promise<ProdutoDTO | null> {
    throw new Error("Method not implemented.");
  }
  listaProdutos(filtro: object): Promise<ProdutoDTO[]> {
    throw new Error("Method not implemented.");
  }
  retornaProduto(idProduto: string): Promise<ProdutoDTO | null> {
    throw new Error("Method not implemented.");
  }

}

export default ProdutosDataBaseRepository;
