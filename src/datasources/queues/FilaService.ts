import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

import FilaRepository, { MensagemResponse, SQSResonse } from '~domain/repositories/filaRepository';

dotenv.config();


export default class FilaService implements FilaRepository {
  private sqsClient: SQSClient;

  constructor() {
    const configuration: SQSClientConfig = {
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
      }
    }

    if (process.env.NODE_ENV === 'development') {
      configuration.endpoint = 'http://localhost:4566'
    }
    console.log(configuration)
    this.sqsClient = new SQSClient(configuration);
  }

  async enviaParaDLQ(fila: string, filaDLQ: string, response: SQSResonse): Promise<void> {
      const parametrosDelete = {
        QueueUrl: fila,
        ReceiptHandle: response.ReceiptHandle,
      };
    
      try {
        const deleteCommand = new DeleteMessageCommand(parametrosDelete);
        await this.sqsClient.send(deleteCommand);
    
        const sendMessageParams = {
          QueueUrl: filaDLQ,
          MessageBody: response.Body,
        };
    
        const sendToDLQCommand = new SendMessageCommand(sendMessageParams);
        await this.sqsClient.send(sendToDLQCommand);
    
        console.log('Mensagem movida para DLQ.');
      } catch (error) {
        console.error('Error em mover para DLQ:', error);
      }
  }

  async deletaMensagemProcessada(fila: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: fila,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
      console.log('Message removida da fila');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
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

  async recebeMensagem<T>(fila: string): Promise<MensagemResponse<T>[] | null> {
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
        return data?.Messages?.reduce((mensagens: MensagemResponse<T>[], mensagemReceived) => {
          try {
            const body = JSON.parse(mensagemReceived?.Body as string);
            mensagens.push({ receiptHandle: mensagemReceived.ReceiptHandle, body });
          } catch (error) {
            console.error(`Invalid JSON: ${mensagemReceived?.Body}`); // TODO - tratar mensagem invalida
          }
          return mensagens;
        }, []);
      }

      console.log('Nenhuma mensagem na fila.');

    } catch (error) {
      console.error(`Erro ao receber mensagens da fila ${fila}:`, error);
    }

    return null;
  }

}