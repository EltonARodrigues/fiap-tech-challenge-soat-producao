import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { mock } from 'aws-sdk-mock';

// import AWSMock from 'aws-sdk-mock'
import FilaService from '../../../src/datasources/queues/FilaService';
import { ProdutoDTO } from '../../../src/domain/entities/types/produtoType';
import { SQSResonse } from '../../../src/domain/repositories/filaRepository';

jest.mock("aws-sdk");


interface MockType {
  id: string,
  test: number,
}

describe('FilaService', () => {
  const filaService = new FilaService();
  const sendQueue = "MOCK_SQS";

  jest.mock("@aws-sdk/client-sqs", () => ({
    SQSClient: jest.fn(() => ({
      send: jest.fn(),
    })),
    DeleteMessageCommand: jest.fn(),
    ReceiveMessageCommand: jest.fn(),
  }));

  beforeAll(() => {
    // AWSMock.mock('SQS', 'sendMessage', (params: any, callback: any) => {
    //   // Mocked implementation for sendMessage
    //   callback(null, { MessageId: 'mocked-message-id' });
    // });
    // filaService = new FilaService();
  });

  afterAll(() => {
    // AWSMock.restore('SQS');
  });

  it('Teste enviar para fila', async () => {
    const mockTest: MockType = {
      id: '1',
      test: 0
    }

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: mockTest,
    });
    SQSClient.prototype.send = mockSend;

    const result = await filaService.enviaParaFila<MockType>(mockTest, sendQueue);

    expect(result).toBeTruthy();
  });

  it('Teste enviar para fila DLQ', async () => {
    const mockTest: MockType = {
      id: '1',
      test: 0
    }

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: mockTest,
    });
    SQSClient.prototype.send = mockSend;

    const mockSQSResonse: SQSResonse = {
      ReceiptHandle: 'test',
      Body: 'mock'
    }

    const result = await filaService.enviaParaDLQ(sendQueue, `${sendQueue}_dlq`, mockSQSResonse);

    expect(result).toBeTruthy();
  });

  it('Teste deletar mensagem processada', async () => {
    const mockReceiptHandle = "test"

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: null,
    });
    SQSClient.prototype.send = mockSend;

    const result = await filaService.deletaMensagemProcessada(sendQueue, mockReceiptHandle);

    expect(result).toBeTruthy();
  });

  it('Teste receber mensagem', async () => {
    const mockReceiptHandle = "test"
    const mockTest: MockType = {
      id: '1',
      test: 0
    }

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [{ Body: JSON.stringify(mockTest), ReceiptHandle: mockReceiptHandle }],
    });
    SQSClient.prototype.send = mockSend;

    const result = await filaService.recebeMensagem(sendQueue);

    expect(result).toMatchObject([{ body: mockTest, receiptHandle: mockReceiptHandle }]);
  });

  it('Teste receber sem ter mensagem', async () => {
    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [],
    });
    SQSClient.prototype.send = mockSend;

    const result = await filaService.recebeMensagem(sendQueue);

    expect(result).toBeNull();
  });

  it('Teste receber mensagem com formato invalido', async () => {
    const mockReceiptHandle = "test"
    const mockTest = "invalid json"

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [{ Body: mockTest, ReceiptHandle: mockReceiptHandle }],
    });
    SQSClient.prototype.send = mockSend;

    const result = await filaService.recebeMensagem(sendQueue);

    expect(result?.length).toBe(0);
  });

});
