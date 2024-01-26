import dotenv from "dotenv";
import throwError from "handlerError/handlerError";

import MetodoPagamentoRepository from "~domain/repositories/MetodoPagamentoRepository";

dotenv.config();

const PAGAMENTO_MS_URL = process.env.PAGAMENTO_MS_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

interface MetodoPagamento {
    id: string
}

export default class MetodoPagamentoMicroserviceComunication implements MetodoPagamentoRepository {
    async retornaMetodoPagamentoValido(metodoId: string): Promise<boolean> {
        try {
            const response = await fetch(`${PAGAMENTO_MS_URL}/api/metodo-pagamento`);
            if (response.status === 200) {
                console.log("Metodo de pagamento encontrado!");

                const metodosPagamento = await response.json();
                return metodosPagamento?.message?.some((metodo: MetodoPagamento) => metodo.id === metodoId);
            }

        } catch (err: unknown) {
            console.log(err);
        }

        throwError("BAD_REQUEST", "Nao foi possivel validar metodo de pagamento");
    }

}