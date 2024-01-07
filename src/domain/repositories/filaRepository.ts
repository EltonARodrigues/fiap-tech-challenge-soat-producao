export default interface FilaRepository {
  enviaParaFila<T>(mensagem: T, fila: string): Promise<void>;
  recebeMensagem<T>(fila: string): Promise<T | null>;
}
