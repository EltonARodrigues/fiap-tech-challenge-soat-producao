export default interface EmailRepository {
  enviaNotificacao(to: string, pedidoId: string, pedidoEmProducao: boolean): Promise<boolean>;
}
