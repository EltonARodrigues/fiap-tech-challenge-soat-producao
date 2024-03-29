import dotenv from "dotenv";

import connectDB from "~datasources/databaseNoSql/config/init";
import API from "~presenters/api";
import QueueMonitoring from "~presenters/queueHandler/pagamentoHandler";

dotenv.config();

async function init() {
  await connectDB();
  const api = new API();
  api.start();
}

QueueMonitoring();
init();
