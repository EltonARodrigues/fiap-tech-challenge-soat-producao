import FilaService from "~datasources/queues/FilaService";

const FILA_PAGAMENTO_URL = process.env.FILA_PAGAMENTO_URL as string;

const filaService = new FilaService();


const queueTimer = setInterval(() => {
    const pagamentos = filaService.recebeMensagem(FILA_PAGAMENTO_URL);

    
}, 5000)