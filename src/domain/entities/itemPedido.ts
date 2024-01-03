import { v4 as uuidv4 } from "uuid";

import { ItemDoPedidoDTO } from "./types/itensPedidoType";

export default class ItemPedido {
  public id: string;
  public produtoId: string;
  public quantidade: number;
  public valorUnitario: number;
  public valorTotal: number;
  public observacao: string | null;
  public createdAt: Date;

  
  
  constructor(itemPedido: ItemDoPedidoDTO) {
    this.id = itemPedido.id ?? uuidv4();
    this.produtoId = itemPedido.produtoId;
    this.quantidade = itemPedido.quantidade;
    this.valorUnitario = itemPedido.valorUnitario ?? 0; // TODO validar 
    this.valorTotal = this.calculaTotal();
    this.observacao = itemPedido.observacao ?? null;
    this.createdAt = new Date();

    if (this.quantidade <= 0){
      throw new Error('Quantidade do item selecionado nao pode ser menor que 0')
    }
  }

  calculaTotal(){
    this.valorTotal = this.valorUnitario * this.quantidade;
    return this.valorTotal;
  }

  mudaQuantidade(quantidade: number) {
    this.quantidade = quantidade;
    this.calculaTotal();
  }

  mudaObservacao(observacao: string) {
    this.observacao = observacao;
  }

  toObject(): ItemDoPedidoDTO {
    return {
      id: this.id,
      produtoId: this.produtoId,
      quantidade: this.quantidade,
      valorUnitario: this.valorUnitario,
      valorTotal: this.valorTotal,
      observacao: this.observacao,
    };
  }
}