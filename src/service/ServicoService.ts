// service/ServicoService.ts

import { httpClient } from './HttpClient';
import { ServicoResponse } from '../types/Servico';

// ─── Tipos internos do service ────────────────────────────────────────────────

export interface CriarServicoSimplesPayload {
  valor: number;
  nomeCliente: string;
  nomeBarbeiro: string;
  statusPagamento: 'PAGO' | 'PENDENTE' | 'CANCELADO';
  metodoPagamento: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';
  produto?: string;
  servico: string;
}

export interface CriarServicoPixPayload {
  data: {
    valor: number;
    nomeCliente: string;
    nomeBarbeiro: string;
    statusPagamento: 'PENDENTE';
    metodoPagamento: 'PIX';
    produto?: string;
    servico: string;
  };
  pix: {
    chave: string;   // sua chave PIX (UUID, CPF, e-mail, telefone, aleatória)
    valor: string;   // string com duas casas decimais ex: "50.00"
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const servicoService = {
  /**
   * Cria serviço via Dinheiro ou Cartão (body plano, sem wrapper "data")
   * POST /api/servicos
   */
  criarSimples: (payload: CriarServicoSimplesPayload): Promise<ServicoResponse> => {
    return httpClient.post<ServicoResponse>('/servicos', payload);
  },

  /**
   * Cria serviço via PIX (body com "data" + "pix")
   * POST /api/servicos
   */
  criarPix: (payload: CriarServicoPixPayload): Promise<ServicoResponse> => {
    return httpClient.post<ServicoResponse>('/servicos', payload);
  },

  /**
   * Lista todos os serviços
   * GET /api/servicos
   */
  listar: (): Promise<ServicoResponse[]> => {
    return httpClient.get<ServicoResponse[]>('/servicos');
  },

  /**
   * Busca serviço por ID
   * GET /api/servicos/:id
   */
  buscarPorId: (id: number | string): Promise<ServicoResponse> => {
    return httpClient.get<ServicoResponse>(`/servicos/${id}`);
  },
};