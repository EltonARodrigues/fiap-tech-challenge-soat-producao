import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { ItemDoPedidoDTO } from "~domain/entities/types/itensPedidoType";
import { PedidoDTO, statusDoPedido } from "~domain/entities/types/pedidoType";

const ItemDoPedidoSchema = new mongoose.Schema<ItemDoPedidoDTO>({
  id: { type: String, required: true },
  produtoId: { type: String, required: true },
  quantidade: { type: Number, required: true },
  valorUnitario: { type: Number, required: true },
  valorTotal: { type: Number, required: true },
  observacao: { type: String, required: false },
});

const PedidoSchema = new mongoose.Schema<PedidoDTO>({
  id: {
    type: String,
    default: uuidv4,
    required: true,
  },
  clienteId: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(statusDoPedido),
    required: true,
    default: statusDoPedido.RASCUNHO,
  },

  itens: {
    type: [ItemDoPedidoSchema],
    allowNull: true,
  },
  retiradoEm: {
    type: Date,
    allowNull: true,
  },
  createdAt: {
    type: Date,
    allowNull: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    allowNull: false,
  },
  deletedAt: {
    type: Date,
    allowNull: true,
    defaultValue: null,
  },
});

const Pedido = mongoose.model("Pedido", PedidoSchema);

export default Pedido;
