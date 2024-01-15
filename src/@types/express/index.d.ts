import { TipoUsuario } from "~domain/entities/types/authType";

export {}

declare global {
  namespace Express {
    export interface Request {
        tipoUsuario?: TipoUsuario
        clienteId: string;
    }
  }
}