export default interface MetodoPagamentoRepository {
  retornaMetodoPagamentoValido(metodoId: string): Promise<boolean>;
}
