export interface MensagemResponse<T> { 
  receiptHandle: string | undefined, 
  body: T
}

export interface SQSResonse { 
  ReceiptHandle: string; 
  Body: string 
}

export default interface FilaRepository {
  enviaParaFila<T>(mensagem: T, fila: string): Promise<boolean>;
  recebeMensagem<T>(fila: string): Promise<MensagemResponse<T>[] | null>;
  deletaMensagemProcessada(fila: string, receiptHandle: string): Promise<boolean>;
  enviaParaDLQ(fila: string, filaDLQ: string, response: SQSResonse): Promise<boolean>;
}
