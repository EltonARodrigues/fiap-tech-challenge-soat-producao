import { v4 as uuidv4 } from "uuid";

import ItemPedido from "../../../src/domain/entities/itemPedido";

describe("itemPedido", () => {
  it("Teste adicionar item", async () => {
    const item = new ItemPedido({
      produtoId: uuidv4(),
      quantidade: 2,
      valorUnitario: 1,
      observacao: "test",
    });

    expect(item).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });

  it("Teste validar valor unitario do item", async () => {
    const item = new ItemPedido({
      produtoId: uuidv4(),
      quantidade: 1,
      valorUnitario: 1,
      observacao: "test",
    });

    const valor = item.validarValor(item.quantidade);

    expect(valor).toBe(item.quantidade);
  });

  it("Teste mudanca da quantidade", async () => {
    const item = new ItemPedido({
      produtoId: uuidv4(),
      quantidade: 1,
      valorUnitario: 1.1,
      observacao: "test",
    });

    item.mudaQuantidade(2);

    expect(item.valorTotal).toBe(2.2);
  });

  it("Teste validar valor unitario invalido do item", async () => {
    try {
      new ItemPedido({
        produtoId: uuidv4(),
        quantidade: 1,
        valorUnitario: 0,
        observacao: "test",
      });
    } catch (e: any) {
      expect(e.message).toBe(
        "Não é criar um item de valor unitario menor igual a 0"
      );
    }
  });

  it("Teste adicionar item com qualidade invalida", async () => {
    try {
      new ItemPedido({
        produtoId: uuidv4(),
        quantidade: 0,
        valorUnitario: 1,
        observacao: "test",
      });
    } catch (e: any) {
      expect(e.message).toBe(
        "Quantidade do item selecionado nao pode ser menor que 0"
      );
    }
  });

  it("Teste mudar observacao", async () => {
    const item = new ItemPedido({
      produtoId: uuidv4(),
      quantidade: 1,
      valorUnitario: 1,
      observacao: "test",
    });

    expect(item.observacao).toBe("test");

    item.mudaObservacao("nova obs");

    expect(item.observacao).toBe("nova obs");
  });

  it("Teste converter classe para DTO", async () => {
    const produtoId = uuidv4();
    const item = new ItemPedido({
      produtoId: produtoId,
      quantidade: 1,
      valorUnitario: 1,
      observacao: "test",
    });

    const dto = item.toObject();

    expect(dto).toStrictEqual({
      id: item.id,
      produtoId: produtoId,
      quantidade: 1,
      valorUnitario: 1,
      valorTotal: 1,
      observacao: "test",
    });
  });
});
