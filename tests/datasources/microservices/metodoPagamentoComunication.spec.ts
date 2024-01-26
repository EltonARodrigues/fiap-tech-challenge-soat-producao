import MetodoPagamentoMicroserviceComunication from "../../../src/datasources/microservices/pagamentoComunication";
describe("ProdutoMicroserviceComunication", () => {
  const metodoPagamentoRepository =
    new MetodoPagamentoMicroserviceComunication();

  it("Testa metodo de pagamento valido", async () => {
    const metodoId = "ea3d6981-099d-49a5-9f45-9ed88affc9b5";
    const mockProduto = {
      message: [
        {
          id: "ea3d6981-099d-49a5-9f45-9ed88affc9b5",
          nome: "QRCode",
        },
        {
          id: "ea3d6981-099d-49a5-9f45-9ed88affc9b5",
          nome: "QRCode",
        },
      ],
    };

    global.fetch = jest.fn().mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 200,
        json: () => mockProduto,
      };
    });

    const temMetodoPagamento =
      await metodoPagamentoRepository.retornaMetodoPagamentoValido(metodoId);
    expect(temMetodoPagamento).toBeTruthy();
  });

  it("Testa metodo de pagamento invalido", async () => {
    const metodoId = "1";
    const mockProduto = {
      message: [
        {
          id: "ea3d6981-099d-49a5-9f45-9ed88affc9b5",
          nome: "QRCode",
        },
        {
          id: "ea3d6981-099d-49a5-9f45-9ed88affc9b5",
          nome: "QRCode",
        },
      ],
    };

    global.fetch = jest.fn().mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 200,
        json: () => mockProduto,
      };
    });

    const temMetodoPagamento =
      await metodoPagamentoRepository.retornaMetodoPagamentoValido(metodoId);
    expect(temMetodoPagamento).toBeFalsy();
  });
});
