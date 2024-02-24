import PedidoDataBaseRepository from "~datasources/databaseNoSql/repository/pedidoDatabaseRepository";
import FilaService from "~datasources/queues/FilaService";
import { PagamentoStatusUpdateBody } from "~domain/entities/types/PagamentoType";
import { PagamentoController } from "~interfaceAdapters/controllers/pagamentoController";

const FILA_PAGAMENTO_URL = process.env.FILA_PAGAMENTO_URL as string;
const FILA_PAGAMENTO_DLQ_URL = process.env.FILA_PAGAMENTO_DLQ_URL as string;

const filaService = new FilaService();
const pedidoRepository = new PedidoDataBaseRepository();

async function queueCheck() {
  const pagamentos =
    await filaService.recebeMensagem<PagamentoStatusUpdateBody>(
      FILA_PAGAMENTO_URL
    );
  return pagamentos?.map(async (pagamento) => {
    try {
      await PagamentoController.atualizaPagamentoPedido(
        pedidoRepository,
        pagamento.body
      );
      await filaService.deletaMensagemProcessada(
        FILA_PAGAMENTO_URL,
        pagamento.receiptHandle as string
      );
    } catch (err) {
      console.log(err);
      filaService.enviaParaDLQ(FILA_PAGAMENTO_URL, FILA_PAGAMENTO_DLQ_URL, {
        Body: JSON.stringify(pagamento.body),
        ReceiptHandle: pagamento.receiptHandle as string,
      });
    }
    return null;
  });
}
export default async function QueueMonitoring() {
  console.log(`Buscando mensagens na fila ${FILA_PAGAMENTO_URL}`);
  await queueCheck();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await QueueMonitoring();
}
