import { useState, useCallback } from 'react';

/**
 * Hook reutilizável para gerenciar múltiplos contadores.
 * @param {object} valoresIniciais - ex: { membros: 0, visitantes: 0 }
 */
export function useContador(valoresIniciais = {}) {
  const [contadores, setContadores] = useState(valoresIniciais);

  const incrementar = useCallback((campo) => {
    setContadores(prev => ({ ...prev, [campo]: (prev[campo] || 0) + 1 }));
  }, []);

  const decrementar = useCallback((campo) => {
    setContadores(prev => ({ ...prev, [campo]: Math.max(0, (prev[campo] || 0) - 1) }));
  }, []);

  const resetar = useCallback(() => {
    setContadores(valoresIniciais);
  }, [valoresIniciais]);

  const total = Object.values(contadores).reduce((soma, v) => soma + v, 0);

  return { contadores, incrementar, decrementar, resetar, total };
}
