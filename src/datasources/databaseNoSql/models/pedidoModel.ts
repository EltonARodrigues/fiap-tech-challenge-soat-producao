import mongoose from "mongoose";
import { number } from "yargs";

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

// Define the food schema
const PedidoSchema = new mongoose.Schema<PedidoDTO>({
  id: {
    type: String,
    required: true,
  },
  clienteId: {
    type: String,
    required: true,
  },
  // faturaId: {
  //   type: String,
  //   required: true,
  // },
  status: {
    type: String,
    enum: Object.values(statusDoPedido),
    required: true,
    default: statusDoPedido.RASCUNHO
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

// Create the Food model
const Pedido = mongoose.model('Pedido', PedidoSchema);

// Export the model
export default Pedido;
