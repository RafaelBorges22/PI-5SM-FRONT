// services/servicoService.ts

import { httpClient } from './HttpClient';
import { CriarServicoRequest, ServicoResponse } from '../types/Servico';

export const servicoService = {
  /**
   * Cria um novo serviço
   * POST /api/servicos
   */
  criar: (payload: CriarServicoRequest): Promise<ServicoResponse> => {
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