import { ReceiveMessageCommand, SendMessageCommand,SQSClient } from '@aws-sdk/client-sqs';

import FilaRepository from '~domain/repositories/filaRepository';


export default class FilaService implements FilaRepository {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY  as string,
      }
    });
  }

  async enviaParaFila<T>(mensagem: T, fila: string): Promise<void> {
    const params = {
      QueueUrl: fila,
      MessageBody: JSON.stringify(mensagem)
    };
  
    const command = new SendMessageCommand(params);
  
    const data = await this.sqsClient.send(command);
    console.log('Mensagem enviada com sucesso:', data.MessageId);

  }

  async recebeMensagem<T>(fila: string): Promise<T | null>  {
    const params = {
      QueueUrl: fila,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20
    };
  
    const command = new ReceiveMessageCommand(params);
  
    try {
      const data = await this.sqsClient.send(command);
  
      if (data.Messages && data.Messages.length > 0) {
        console.log(`Mensagens recebidas: ${data.Messages.length}`);
        return data?.Messages?.map(mensagem => mensagem.Body) as T;
      }
      
      console.log('Nenhuma mensagem na fila.');
      
    } catch (error) {
      console.error('Erro ao receber mensagens:', error);
    }

    return null;
  }
  
}