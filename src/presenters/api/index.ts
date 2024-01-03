import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { Server } from "./config/server.config";
import {
  pedidoRouter,
} from "./routers/index";
import specs from "./swaggerConfig";

export default class API {
  private app: Express;

  constructor() {
    this.app = express();
  }

  start() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    const server = new Server({ appConfig: this.app });

    server.addRouter("/api/pedido", pedidoRouter);

    server.init();
  }
}


