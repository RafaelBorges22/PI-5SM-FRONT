// service/ServicoService.ts

import { httpClient } from './HttpClient';
import { ServicoResponse } from '../types/Servico';

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
    chave: string;
    valor: string;
  };
}

export const servicoService = {
  criarSimples: (payload: CriarServicoSimplesPayload): Promise<ServicoResponse> => {
    return httpClient.post<ServicoResponse>('/servicos', payload);
  },

  criarPix: (payload: CriarServicoPixPayload): Promise<ServicoResponse> => {
    return httpClient.post<ServicoResponse>('/servicos', payload);
  },

  listar: (): Promise<ServicoResponse[]> => {
    return httpClient.get<ServicoResponse[]>('/servicos');
  },

  buscarPorId: (id: number | string): Promise<ServicoResponse> => {
    return httpClient.get<ServicoResponse>(`/servicos/${id}`);
  },
};