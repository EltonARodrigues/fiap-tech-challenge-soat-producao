export interface MensagemResponse<T> { 
  receiptHandle: string | undefined, 
  body: T
}

export interface SQSResonse { 
  ReceiptHandle: string; 
  Body: string 
}

export default interface FilaRepository {
  enviaParaFila<T>(mensagem: T, fila: string): Promise<void>;
  recebeMensagem<T>(fila: string): Promise<MensagemResponse<T>[] | null>;
  deletaMensagemProcessada(fila: string, receiptHandle: string): void;
  enviaParaDLQ(fila: string, filaDLQ: string, response: SQSResonse): void;
}
