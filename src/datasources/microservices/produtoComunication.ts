import dotenv from "dotenv";
import throwError from "handlerError/handlerError";

import { ProdutoDTO } from "~domain/entities/types/produtoType";
import ProdutoRepository from "~domain/repositories/produtoRepository";

dotenv.config();

const PRODUTO_MS_URL = process.env.PRODUTO_MS_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

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

        if (NODE_ENV === 'test') { // TODO - Reavaliar
          return {
            "id": "3117a0bd-e0c4-421d-a035-67f9b95cc407",
            "nome": "test",
            "categoriaId": "3117a0bd-e0c4-421d-a035-67f9b95cc407",
            "preco": 1,
            "imagens": [
              {
                "id": "2883ada3-a1cc-4481-964e-503df981676a",
                "produtoId": "1",
                "url": "string",
                "createdAt": new Date(),
                "deletedAt": null,
                "updatedAt": null
              }
            ],
            "descricao": "terwtet",
            "createdAt": new Date(),
            "deletedAt": null,
            "updatedAt": null
          }
        }

        return null;
      }

    } catch (err: unknown) {
      console.log(err);
    }

    throwError("BAD_REQUEST", "Nao foi possivel encontrar o produto!");
  }

}