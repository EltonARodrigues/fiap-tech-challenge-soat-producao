import express from "express";

import ProdutoService from "~core/applications/services/produtoService";
import DBProdutosRepository from "~driven/infra/repository/produtoDatabaseRepository";

import ProdutoController from "../controllers/produtoController";

const produtoRouter = express.Router();

const dbProdutosRepository = new DBProdutosRepository();
const produtoService = new ProdutoService(dbProdutosRepository);
const produtoController = new ProdutoController(produtoService);

produtoRouter.post("/", produtoController.criaProduto.bind(produtoController));
produtoRouter.get("/", produtoController.listaProdutos.bind(produtoController));
produtoRouter.get(
  "/:id",
  produtoController.retornaProduto.bind(produtoController)
);
produtoRouter.delete(
  "/:id",
  produtoController.deletaProduto.bind(produtoController)
);
produtoRouter.put(
  "/:id",
  produtoController.editaProduto.bind(produtoController)
);
produtoRouter.delete(
  "/:idProduto/imagem/:idImagem",
  produtoController.removeImagem.bind(produtoController)
);
produtoRouter.post(
  "/:id/imagens",
  produtoController.adicionaImagens.bind(produtoController)
);

export default produtoRouter;
