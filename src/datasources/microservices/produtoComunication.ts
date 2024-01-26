import dotenv from "dotenv";
import throwError from "handlerError/handlerError";

import { ProdutoDTO } from "~domain/entities/types/produtoType";
import ProdutoRepository from "~domain/repositories/produtoRepository";

dotenv.config();

const PRODUTO_MS_URL = process.env.PRODUTO_MS_URL as string;

export default class ProdutoMicroserviceComunication implements ProdutoRepository {
  async retornaProduto(idProduto: string): Promise<ProdutoDTO | null> {
    try {
      const response = await fetch(`${PRODUTO_MS_URL}/produto/${idProduto}`);

      if (response.status === 200) {
        console.log("Pedido encontrado!");

        return await response.json();
      }

      if (response.status === 404) {
        console.log("Pedido nao encontrado!");

        return null;
      }

    } catch (err: unknown) {
      console.log(err);
    }

    throwError("BAD_REQUEST", "Nao foi possivel encontrar o produto!");
  }

}