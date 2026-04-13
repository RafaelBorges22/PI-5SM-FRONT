// types/Servico.ts

export type StatusPagamento = 'PENDENTE' | 'PAGO' | 'CANCELADO';
export type MetodoPagamento = 'PIX' | 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface ServicoData {
  dataServico: string;
  nomeCliente: string;
  valor: string;
  nomeBarbeiro: string;
  statusPagamento: StatusPagamento;
  metodoPagamento: MetodoPagamento;
  produto?: string;
  servico: string;
}

export interface PixData {
  chave: string;
  valor: string;
}

export interface CriarServicoRequest {
  data: ServicoData;
  pix?: PixData;
}

export interface ServicoResponse {
  id: number;
  valor: number;
  dataServico: string;
  nomeCliente: string;
  nomeBarbeiro: string;
  statusPagamento: StatusPagamento;
  metodoPagamento: MetodoPagamento;
  produto?: string;
  servico: string;
  unidade?: string;
  pixTxid?: string;
  pixQrCode?: string;       // string PIX Copia e Cola
  pixImagemQrCode?: string; // base64 "data:image/png;base64,..."
}