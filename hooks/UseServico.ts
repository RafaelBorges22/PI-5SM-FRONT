// hooks/useServico.ts

import { useState } from 'react';
import { servicoService } from '../services/ServicoService';
import { CriarServicoRequest, ServicoResponse } from '../types/Servico';
import { ApiError } from '../services/HttpClient';

interface UseCriarServicoState {
  loading: boolean;
  error: string | null;
  data: ServicoResponse | null;
}

interface UseCriarServicoReturn extends UseCriarServicoState {
  criarServico: (payload: CriarServicoRequest) => Promise<ServicoResponse | null>;
  reset: () => void;
}

export function useCriarServico(): UseCriarServicoReturn {
  const [state, setState] = useState<UseCriarServicoState>({
    loading: false,
    error: null,
    data: null,
  });

  const criarServico = async (
    payload: CriarServicoRequest
  ): Promise<ServicoResponse | null> => {
    setState({ loading: true, error: null, data: null });

    try {
      const response = await servicoService.criar(payload);
      setState({ loading: false, error: null, data: response });
      return response;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Erro inesperado ao criar serviço.';
      setState({ loading: false, error: message, data: null });
      return null;
    }
  };

  const reset = () => setState({ loading: false, error: null, data: null });

  return { ...state, criarServico, reset };
}