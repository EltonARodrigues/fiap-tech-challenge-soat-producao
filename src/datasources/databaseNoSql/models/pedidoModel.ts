import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { FaturaDTO, statusDePagamento } from "~domain/entities/types/fatura";
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

const FaturaSchema = new mongoose.Schema<FaturaDTO>({
  id: { type: String, required: true },
  pedidoId: { type: String, required: true },
  metodoDePagamentoId: { type: String, required: true },
  metodoDePagamento: { type: String, required: true },
  statusDePagamento: {  type: String, enum: Object.values(statusDePagamento), required: true },
  pagoEm: { type: Date, required: false },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  deletedAt: { type: Date, required: true },

});

// Define the food schema
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
    default: statusDoPedido.RASCUNHO
  },

  itens: {
    type: [ItemDoPedidoSchema],
    allowNull: true,
  },
  fatura: {
    type: FaturaSchema,
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
