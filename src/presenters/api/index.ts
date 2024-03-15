import express, { Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { Server } from "./config/server.config";
import { pedidoRouter } from "./routers/index";
import specs from "./swaggerConfig";

export default class API {
  private app: Express;
  private server: Server;

  constructor() {
    this.app = express();

    this.app.use(helmet());

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    this.server = new Server({ appConfig: this.app });

    const healthRouter = express.Router({});
    healthRouter.get("/", async (_req, res) => {
      return res.status(200).json({
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
      });
    });

    this.server.addRouter("/", healthRouter);

    this.server.addRouter("/api/pedido", pedidoRouter);
  }

  appServer() {
    return this.server.getApp();
  }

  start() {
    this.server.init();
  }
}
