import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { Server } from "./config/server.config";
import {
  pedidoRouter,
} from "./routers/index";
import specs from "./swaggerConfig";

export default class API {
  private app: Express;
  private server: Server;

  constructor() {
    this.app = express();
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  
    this.server = new Server({ appConfig: this.app });
  
    this.server.addRouter("/api/pedido", pedidoRouter);
  }

  appServer() {
    return this.server.getApp();
  }

  start() {
    this.server.init();
  }
}


