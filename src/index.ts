import dotenv from "dotenv";

import connectDB from "~datasources/databaseNoSql/config/init";
import API from "~presenters/api";
import QueueMonitoring from "~presenters/queueHandler/pagamentoHandler";


dotenv.config();

async function init() {
  await connectDB(process.env.DB_HOST ?? "localhost", process.env.DB_PORT ?? "27017", process.env.DB_NAME ?? "fiap-soat-project_db");
  const api = new API();
  api.start()
}

QueueMonitoring()
init();
